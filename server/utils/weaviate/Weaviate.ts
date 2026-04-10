// import { getSmolVLMImageDescription, } from '../handlers/requesters.mjs';
// import { learnUrl } from '../handlers/scrape.mjs';
// import { getChannelMessages, sendMessage, typingIndicator } from '../handlers/messages.mjs';
// import { determineSentiments, determineEngagement, discordChatCompletion, getPixtralApiImageResponse } from '../completions/ChatCompletions.mjs';
// import dms from './schemas/DiscordmessageSchema2.mjs';
import { v4 as uuidv4 } from 'uuid';
import { inspect } from 'util';
import weaviate, {
  ApiKey,
  generative,
  TimeoutParams,
  vectors,//vectorizer
  WeaviateClient
} from 'weaviate-client';
import type { Collection, ConnectToWeaviateCloudOptions, Text2VecOpenAIConfigCreate, Vectors } from 'weaviate-client';

type userType = 'user' | 'assistant';
type searchType = 'generative' | 'semantic';
type methodType = 'hybrid' | 'nearText';
type sourceType = 'history' | 'discord';
type ModelProvider = 'mistral' | 'openai'; // anthropic

// const Config = (await import('../../config.json', { with: { type: "json" } })).default.Config;

/**
 * Manages data operations with Weaviate.
 */
class WeaviateDataManager {
  private client: WeaviateClient | null = null;
  private dataCollectionName: string = '';
  private modelProvider: ModelProvider;

  private MISTRAL_API_KEY: string | undefined;
  private OPENAI_API_KEY: string | undefined;
  private WEAVIATE_REST_HOST: string | undefined;
  private WEAVIATE_API_KEY: string | undefined;

  activeUserCollection: Collection<undefined, string, undefined> | null = null;
  corpusCollection: { [key: string]: Collection<undefined, string, undefined> } = {};

  /**
   * Creates a new instance of the `WeaviateDataManager` class.
   */
  constructor(collection: string, modelProvider: ModelProvider) {
    this.modelProvider = modelProvider;
    this.dataCollectionName = collection.replace(/\s+/g, ''); // thnx for the reminder Blahaj :)

    this.MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    this.WEAVIATE_REST_HOST = process.env.WEAVIATE_REST_HOST;
    this.WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;
  }


  /**
   * Retrieves a Weaviate client instance.
   */
  async getClient() {
    if (this.MISTRAL_API_KEY == undefined || this.OPENAI_API_KEY == undefined ||
      this.WEAVIATE_REST_HOST == undefined || this.WEAVIATE_API_KEY == undefined
    ) {
      throw new Error('Missing required environment variables for WeaviateDataManager initialization');
    }
    try {
      const
        weaviateCloudClusterUrl = this.WEAVIATE_REST_HOST,
        timeoutParams: TimeoutParams = { query: 120000, insert: 30000, init: 30000 },
        wcdHeaders: { [key in ModelProvider]: string } = {
          openai: 'X-Openai-Api-Key',
          mistral: 'X-Mistral-Api-Key'
        },
        weaviateCloudConnectionOptions: ConnectToWeaviateCloudOptions = {
          timeout: { ...timeoutParams },
          authCredentials: new ApiKey(this.WEAVIATE_API_KEY),
          headers: {
            [wcdHeaders[this.modelProvider]]: this.MISTRAL_API_KEY//only using mistral atm. should add an object for modelProvider/key
          }
        },
        client = await weaviate.connectToWeaviateCloud(weaviateCloudClusterUrl!, { ...weaviateCloudConnectionOptions }),
        ready = await client.isReady();

      while (!ready)
        await new Promise(r => setTimeout(r, 2000));

      return client;
    }
    catch (e: any) {
      console.error(e.message || e);
      return null;
    };
  };

  /**
   * Opens a client collection channel.
   */
  async openCollectionChannel() {
    try {
      const client = await this.getClient();
      if (client instanceof Error || !client) throw new Error('Error initializing client: ' + (client ? client.message : 'Unknown error'));
      this.client = client;

      const exists = await client.collections.exists(this.dataCollectionName);
      if (!exists) {
        await this.createMultiTenantCollection();
      };

      const collection = client.collections.get(this.dataCollectionName);
      this.activeUserCollection = collection;

      return true;
    }
    catch (e: any) {
      console.error(e.message || e);
      return false;
    };
  };

  async connectCluster() {
    try {
      const client = await this.getClient();
      if (client instanceof Error || !client) throw new Error('Error initializing client: ' + (client ? client.message : 'Unknown error'));
      this.client = client;

      // active user context collection. multi-tenant to save creating new(visible) collections per user
      const exists = await client.collections.exists(this.dataCollectionName);
      if (!exists) {
        await this.createMultiTenantCollection();
      };

      const collection = client.collections.get(this.dataCollectionName);
      this.activeUserCollection = collection;

      // corpus of all collections
      const
        all_collections = await client.collections.listAll(),
        // using object to allow calling by name ~~(NYI)~~ yes it is
        corpus: { [key: string]: Collection<undefined, string, undefined> } = {};

      for (const collection of all_collections) {
        // user and corpus still seperated at this point
        // possibly merge later? users are multi-tenant while corpus members are single tenant
        if (collection.name !== this.dataCollectionName) {
          const collectionName = collection.name;
          const collectionData = await client.collections.get(collectionName);
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
   * Creates a Weaviate Multi-tenancy Collection.
   */
  async createMultiTenantCollection() {
    try {
      if (!this.client) throw new Error('Client not initialized');

      const
        text2VecMistralCreateConfig = {
          model: "mistral-embed",
          vectorizeCollectionName: true
        },
        text2VecOpenaiCreateConfig: Text2VecOpenAIConfigCreate = {
          baseURL: "https://api.openai.com/v1/engines/davinci-codex/completions",
          dimensions: 512,
          model: "text-embedding-3-large",
          modelVersion: "gpt-3.5-turbo",
          type: "text",
          vectorizeCollectionName: false
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
        },
        text2vecConfigs = {
          mistral: vectors.text2VecMistral({ ...text2VecMistralCreateConfig }),
          openai: vectors.text2VecOpenAI({ ...text2VecOpenaiCreateConfig })
        },
        generativeConfigs = {
          mistral: generative.mistral({ ...generativeMistralCreateConfig }),
          openai: generative.openAI({ ...generativeOpenaiCreateConfig })
        },
        discordCollectionCreateConfig = {
          name: this.dataCollectionName,
          description: dms.description,
          multiTenancy: weaviate.configure.multiTenancy({
            enabled: true,
            autoTenantCreation: true
          }),
          properties: dms.properties,
          vectorizers: text2vecConfigs[this.modelProvider],
          generative: generativeConfigs[this.modelProvider]
        },
        createConfig = {
          discord: discordCollectionCreateConfig
        };

      return await this.client.collections.create({ ...createConfig.discord });
    }
    catch (e: any) {
      console.error(e.message || e);
      return null;
    };
  };

  async createSingleTenantCollection(name: any) {
    try {
      if (!this.client) throw new Error('Client not initialized');

      const
        text2VecMistralCreateConfig = {
          model: "mistral-embed",
          vectorizeCollectionName: true
        },
        text2VecOpenaiCreateConfig: Text2VecOpenAIConfigCreate = {
          baseURL: "https://api.openai.com/v1/engines/davinci-codex/completions",
          dimensions: 512,
          model: "text-embedding-3-large",
          modelVersion: "gpt-3.5-turbo",
          type: "text",
          vectorizeCollectionName: true // if the collection name is contextual to the data, set to true
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
        },
        text2vecConfigs = {
          mistral: vectors.text2VecMistral({ ...text2VecMistralCreateConfig }),
          openai: vectors.text2VecOpenAI({ ...text2VecOpenaiCreateConfig })
        },
        generativeConfigs = {
          mistral: generative.mistral({ ...generativeMistralCreateConfig }),
          openai: generative.openAI({ ...generativeOpenaiCreateConfig })
        },
        discordCollectionCreateConfig = {
          name: name,
          description: dms.description,
          properties: dms.properties,
          vectorizers: text2vecConfigs[this.modelProvider],
          generative: generativeConfigs[this.modelProvider]
        },
        createConfig = {
          discord: discordCollectionCreateConfig
        };

      return await this.client.collections.create({ ...createConfig.discord });
    }
    catch (e: any) {
      console.error(e.message || e);
      return null;
    };
  };
};

/**
 * Handles the interactions with Discord.
 * Requires a DataManager instance.
 */
// class DiscordMethodHandler {
//   /**@private*/ DataManagerInstance;
//   /**
//    * Creates a new instance of the `DiscordMethodHandler` class.
//    * 
//    * @param {WeaviateDataManager} instanceData - The instanceData provisioner. (currently only Weaviate)
//    */
//   constructor(instanceData: any) {
//     this.DataManagerInstance = instanceData;
//   };


//   /**
//    * Handles the exchange of messages between a Discord bot and a user.
//    */
//   async discordxchange(bot_token: any, input: { content: any; channel_id: any; author: { username: null | undefined; }; }) {
//     try {
//       if (!this.DataManagerInstance) return 'Error getting weaviate data manager';
//       if (!this.DataManagerInstance.activeUserCollection) await this.DataManagerInstance.connectCluster();

//       const
//         extractedSentiments = await determineSentiments(input.content),
//         channelMessages = await getChannelMessages(input.channel_id, bot_token),
//         engagementAssessment = await determineEngagement(extractedSentiments, channelMessages, input);

//       if (engagementAssessment) {
//         // engage user
//         await typingIndicator(input.channel_id, bot_token);

//         // get context
//         const contextData = await this.getContext(input, bot_token);
//         await typingIndicator(input.channel_id, bot_token);

//         // do completion
//         const aiResponse = await this.doCompletion(contextData, input, bot_token, extractedSentiments);
//         await typingIndicator(input.channel_id, bot_token);

//         // respond in channel
//         const aiInput = await sendMessage(
//           input.channel_id,
//           { content: aiResponse },
//           bot_token
//         );

//         // store message payloads
//         this.storeDiscordMessagePayload("user", input);
//         this.storeDiscordMessagePayload("assistant", aiInput, input.author.username);

//         return aiResponse;
//       }
//       // adding '' only because i return the response string for a reason i dont remember. This interaction is essentially over at the sendMessage.
//       else return '';
//     } catch (e: any) {
//       console.error(e.message);
//       return e.message ? e.message : e;
//     };
//   };


//   async getContext(input: { content: any; }, bot_token: any) {
//     const
//       userQuery = input.content,
//       baseHybridOptions = {
//         limit: 15,
//         alpha: 0.5,
//         // queryProperties: [], // empty to enable searching all fields
//         fusionType: "Ranked", // "RelativeScore" | "Ranked"
//       },
//       hybridCorpusResult = await this.hybridCorpus(userQuery, baseHybridOptions);
//     return hybridCorpusResult;
//   };

//   async doCompletion(dataObject: any, input: any, bot_token: any, sentiments: any) {
//     return await this.doDiscordChatCompletion(
//       dataObject,
//       input,
//       bot_token,
//       sentiments
//     );
//   };


//   async hybridCorpus(input: { author: { username: any; }; content: any; }, baseHybridOptions: {
//     limit: number; alpha: number;
//     // queryProperties: [], // empty to enable searching all fields
//     fusionType: string;
//   }) {
//     // should move this..
//     await this.DataManagerInstance.activeUserCollection.tenants.create([
//       { name: input.author.username }
//     ])

//     const
//       activeTenant = this.DataManagerInstance.activeUserCollection.withTenant(input.author.username),
//       userContext = await activeTenant.query.fetchObjects(baseHybridOptions),
//       userData = userContext.objects;

//     // Object.values(this.DataManagerInstance.corpusCollection).forEach(async (collection) => {
//     for await (const collection of Object.values(this.DataManagerInstance.corpusCollection)) {
//       const
//         collectionName = collection.name,
//         collectionData = await collection.query.hybrid(input.content, baseHybridOptions);

//       collectionData.objects ? Object.apply(userData, collectionData.objects) : null;
//     };
//     // });

//     return userData;
//   };


//   /**
//    * Generates a response based on the provided user query and data object using a specified model API key and completion options.
//    * Handles different types of tasks, including image description tasks.
//    */
//   async doDiscordChatCompletion(
//     dataObject: any,
//     input: { channel_id: any; },
//     bot_token: any,
//     sentiments: any
//   ) {
//     try {
//       const
//         // get initial response. 
//         response = await discordChatCompletion(dataObject, input, sentiments),
//         parsed = await response.json();

//       if (response.ok) {
//         /** @type {string}*/const text = parsed.choices[0].message.content;

//         if (text.includes('[TASK,')) {
//           await typingIndicator(input.channel_id, bot_token);

//           const
//             parsedTask = text.split('TASK, ')[1].split('[')[1].split(']]')[0].trim(),
//             task = parsedTask.split(',')[0].trim(),
//             args = JSON.parse(parsedTask.split(`${task}, `)[1]);

//           // engage user
//           await sendMessage(input.channel_id, { content: "One moment please.." }, bot_token);
//           await typingIndicator(input.channel_id, bot_token);
//           console.log("running task");

//           const taskList = {
//             "IMAGE": async (args: { user_input: any; image_url: any; }) => {
//               const
//                 imageTaskResponse = await getPixtralApiImageResponse(
//                   args.user_input,
//                   args.image_url
//                 ),
//                 imageTaskParsed = await imageTaskResponse.json();

//               return imageTaskResponse.ok
//                 ? imageTaskParsed.choices[0].message.content
//                 : imageTaskParsed.detail.map((msg: any) => inspect(msg, { depth: null }));
//             },

//             "SCRAPE": async (args: { url: string | URL; }) => {
//               const
//                 webScrapeResult = await learnUrl(args.url),
//                 baseDomain = new URL(args.url).hostname.split('.'),
//                 name = baseDomain.reduce((a, c) => a + c, ''),
//                 scrapedCollection = await this.createSingleTeneantCollectionWithData(name, args.url, webScrapeResult);

//               if (!scrapedCollection) throw new Error('Error creating collection');

//               this.DataManagerInstance.corpusCollection[name] = scrapedCollection; // oh, i am using that already.. duh

//               return `Scraped data from ${args.url}, created collection ${name} and added to the corpus.`;
//             }
//           };

//           return await taskList[task](args);
//         }
//         // regular response
//         else
//           return text;
//       }
//       // error response
//       else
//         return parsed.detail && parsed.detail.map((msg: any) => inspect(msg, { depth: null }));// : 'something weird happened..';// TODO: actually handle this

//     } catch (e) {
//       console.error(e.message || e);
//       return 'An error occurred while generating response: ' + e.message || e;
//     };
//   };

//   async createSingleTeneantCollectionWithData(name: string, url: any, webScrapeResult: any) {
//     try {
//       // insert to new collection
//       await this.DataManagerInstance.createSingleTenantCollection(name.toUpperCase());
//       const collection = await this.DataManagerInstance.client.collections.get(url);
//       await collection.data.insertMany({ id: uuidv4(), properties: { ...webScrapeResult } });
//       return collection;
//     } catch (e) {
//       console.error(e.message || e);
//       return false;
//     }
//   };


//   /**
//    * Stores a Discord message payload.
//    */
//   storeDiscordMessagePayload(role: string, input: { id: any; author: { username: any; }; }, tenant = null) {
//     try {
//       if (this.DataManagerInstance.activeUserCollection === null)
//         throw new Error('Error getting collection');

//       const insertObj = { ...input, messageID: input.id, role };
//       // remove id from insertObj (id is a reserved item with Weaviate)
//       delete insertObj.id;
//       // make any null values as undefined
//       const replaceNulls = (obj: { [x: string]: any; }) => {
//         for (const key in obj) {
//           if (obj[key] === null)
//             obj[key] = undefined;
//           else if (typeof obj[key] === 'object' && obj[key] !== null)
//             replaceNulls(obj[key]);
//         };
//       };
//       replaceNulls(insertObj);


//       const activeTenant = this.DataManagerInstance.activeUserCollection.withTenant(tenant === null ? input.author.username : tenant);
//       activeTenant.data.insert({ id: uuidv4(), properties: { ...insertObj } });
//     }
//     catch (e) {
//       console.error("storeDiscordMessagePayload::", e.message || e);
//     };
//   };
// };
export { WeaviateDataManager/*, DiscordMethodHandler */ };
