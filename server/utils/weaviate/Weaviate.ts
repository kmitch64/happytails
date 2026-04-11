
import type { Collection, ConnectToWeaviateCloudOptions, Text2VecMistralConfigCreate, Text2VecOpenAIConfigCreate } from 'weaviate-client';
import {
  ApiKey,
  configure,
  connectToWeaviateCloud,
  generative,
  TimeoutParams,
  vectors,
  WeaviateClient
} from 'weaviate-client';
import PetSchema from './schemas/PetSchema';

export type ModelProvider = 'mistral' | 'openai'; // anthropic


/**
 * Manages data operations with Weaviate.
 */
export default class WeaviateDataManager {

  private client: WeaviateClient | null = null;
  private collectionIdentifier: string;
  private modelProvider: ModelProvider;
  private modelproviderKeys: { [key in ModelProvider]: string };

  private text2vecConfigs: { [key in ModelProvider]: any };
  private generativeConfigs: { [key in ModelProvider]: any };

  activeUserCollection: Collection | null = null;
  corpusCollection: { [key: string]: Collection } = {};

  /**
   * Creates a new instance of the `WeaviateDataManager` class.
   */
  constructor(datasetName: string, modelProvider: ModelProvider) {

    if (process.env.MISTRAL_API_KEY == undefined || process.env.OPENAI_API_KEY == undefined ||
      process.env.WEAVIATE_REST_HOST == undefined || process.env.WEAVIATE_API_KEY == undefined
    ) {
      throw new Error('Missing required environment variables for WeaviateDataManager initialization');
    }

    this.collectionIdentifier = datasetName.replace(/\s+/g, ''); // thnx for the reminder Blahaj :)

    this.modelProvider = modelProvider;

    this.modelproviderKeys = {
      mistral: process.env.MISTRAL_API_KEY!,
      openai: process.env.OPENAI_API_KEY!
    }

    const
      text2VecMistralCreateConfig: Text2VecMistralConfigCreate = {
        model: "mistral-embed",
        vectorizeCollectionName: true
      },
      text2VecOpenaiCreateConfig: Text2VecOpenAIConfigCreate = {
        baseURL: "https://api.openai.com/v1/embeddings",//uncomfirmed atm
        dimensions: 512,
        model: "text-embedding-3-large",//OLD uncomfirmed
        modelVersion: "gpt-3.5-turbo",//OLD uncomfirmed
        type: "text",
        vectorizeCollectionName: true
      },
      generativeMistralCreateConfig = {
        maxTokens: 1024,
        model: 'mistral-small-latest',
        temperature: 0.5
      },
      generativeOpenaiCreateConfig = {
        maxTokens: 1024,
        model: 'gpt-3.5-turbo',
        temperature: 0.8
      };

    this.text2vecConfigs = {
      mistral: vectors.text2VecMistral({ ...text2VecMistralCreateConfig }),
      openai: vectors.text2VecOpenAI({ ...text2VecOpenaiCreateConfig })
    };
    this.generativeConfigs = {
      mistral: generative.mistral({ ...generativeMistralCreateConfig }),
      openai: generative.openAI({ ...generativeOpenaiCreateConfig })
    };

  }


  /**
   * Initializes the active user collection.
   */
  async activateCollection() {
    try {
      const client = await this.getClient();
      this.client = client;

      const exists = await client.collections.exists(this.collectionIdentifier);
      if (!exists) {
        await this.createMultiTenantCollection();
      };

      const collection = client.collections.get(this.collectionIdentifier);
      this.activeUserCollection = collection;

      return true;
    }
    catch (e: any) {
      console.error(e.message || e);
      return false;
    };
  };


  /**
   * Loads all existing collections into a corpus collection.
   */
  async gatherCollections() {
    try {
      const client = await this.getClient();
      // this.client = client;

      // active user context collection. multi-tenant to save creating new(visible) collections per user
      // const exists = await client.collections.exists(this.collectionIdentifier);
      // if (!exists) {
      //   await this.createMultiTenantCollection();
      // };

      // const collection = client.collections.get(this.collectionIdentifier);
      // this.activeUserCollection = collection;

      // corpus of all collections
      const
        all_collections = await client.collections.listAll(),
        corpus: { [key: string]: Collection } = {};

      for (const collection of all_collections) {
        // user and corpus still seperated at this point
        // possibly merge later? users are multi-tenant while corpus members are single tenant
        if (collection.name !== this.collectionIdentifier) {
          const collectionName = collection.name;
          const collectionData = client.collections.get(collectionName);
          corpus[collectionName] = collectionData;
        }
      };
      this.corpusCollection = corpus;

      return true;
    }
    catch (e: any) {
      console.error(e.message || e);
      return false;
    };
  };


  /**
   * Retrieves a Weaviate client instance.
   */
  private async getClient() {
    try {
      const
        weaviateCloudClusterUrl = process.env.WEAVIATE_REST_HOST!,
        timeoutParams: TimeoutParams = { query: 120000, insert: 30000, init: 30000 },
        wcdHeaders: { [key in ModelProvider]: string } = {
          openai: 'X-Openai-Api-Key',
          mistral: 'X-Mistral-Api-Key'
        },
        weaviateCloudConnectionOptions: ConnectToWeaviateCloudOptions = {
          timeout: { ...timeoutParams },
          authCredentials: new ApiKey(process.env.WEAVIATE_API_KEY!),
          headers: {
            [wcdHeaders[this.modelProvider]]: this.modelproviderKeys[this.modelProvider]
          }
        },
        client = await connectToWeaviateCloud(weaviateCloudClusterUrl, { ...weaviateCloudConnectionOptions });

      while (!await client.isReady())
        await new Promise(r => setTimeout(r, 2000));

      return client;
    }
    catch (e: any) {
      throw new Error('Error connecting to Weaviate: ' + (e.message || e));
    };
  };


  /**
   * Creates a Weaviate Multi-tenancy Collection.
   */
  private async createMultiTenantCollection() {
    try {
      if (!this.client) throw new Error('Client not initialized');

      const
        multiTenantCollectionCreateConfig = {
          name: this.collectionIdentifier,
          description: PetSchema.description,
          multiTenancy: configure.multiTenancy({
            enabled: true,
            autoTenantCreation: true
          }),
          properties: PetSchema.properties,
          vectorizers: this.text2vecConfigs[this.modelProvider],
          generative: this.generativeConfigs[this.modelProvider]
        },
        createConfig = {
          weaviate: multiTenantCollectionCreateConfig
        };

      return await this.client.collections.create({ ...createConfig.weaviate });
    }
    catch (e: any) {
      console.error(e.message || e);
      return null;
    };
  };

  /**
   * Creates a Weaviate Single-tenancy Collection.
   */
  private async createSingleTenantCollection(name: any) {
    try {
      if (!this.client) throw new Error('Client not initialized');

      const
        singleTenantCollectionCreateConfig = {
          name: name,
          description: PetSchema.description,
          properties: PetSchema.properties,
          vectorizers: this.text2vecConfigs[this.modelProvider],
          generative: this.generativeConfigs[this.modelProvider]
        },
        createConfig = {
          singleTenant: singleTenantCollectionCreateConfig
        };

      return await this.client.collections.create({ ...createConfig.singleTenant });
    }
    catch (e: any) {
      console.error(e.message || e);
      return null;
    };
  };

};


