
import { v4 as uuidv4 } from 'uuid';
import WeaviateDataManager from "./Weaviate";
import type {ModelProvider} from "./Weaviate";

//wait to move this
interface Input {
  id: any;
  content: any;
  author:string;
  pet: string;
}
type FusionType = "Ranked" | "RelativeScore" | undefined;
interface HybridOptions {
  limit: number;
  alpha: number;
  fusionType: FusionType;
  queryProperties?: string[];
}


/**
 * 
 */
export default class Interactions extends WeaviateDataManager {
  /**
   * 
   */
  constructor(collection: string, modelProvider: ModelProvider) {
    super(collection, modelProvider);
    if (!this.activeUserCollection) this.connectCluster();

  };


  /**
   * 
   */
  async aiExchange(input: Input) {
    try {

      // get context
      const contextData = await this.getContext(input);

      // do completion
      const aiResponse = await this.doCompletion(contextData, input);


      // store message payloads
      this.storeInteractionPayload("user", input);
      this.storeInteractionPayload("assistant", aiResponse, input.author);

      return aiResponse;

    }
    catch (e: any) {
      console.error(e.message);
      return e.message ? e.message : e;
    };
  };


  async getContext(input: Input) {
    const
      baseHybridOptions: HybridOptions = {
        limit: 15,
        alpha: 0.5,
        // queryProperties: [], // empty to enable searching all fields
        fusionType: "Ranked"
      },
      hybridCorpusResult = await this.hybridCorpus(input, baseHybridOptions);
    return hybridCorpusResult;
  };

  async doCompletion(dataObject: any, input: Input) {
    return await this.doChatCompletion(
      dataObject,
      input
    );
  };



  async hybridCorpus(input: Input, baseHybridOptions: HybridOptions) {
    // should move this..
    if (!this.activeUserCollection)
      throw new Error('Error getting activeUserCollection');
    await this.activeUserCollection.tenants.create([
      { name: input.author }
    ])

    const
      activeTenant = this.activeUserCollection.withTenant(input.author),
      userContext = await activeTenant.query.fetchObjects(baseHybridOptions),
      userData = userContext.objects;

    for await (const collection of Object.values(this.corpusCollection)) {
      const collectionData = await collection.query.hybrid(input.content, baseHybridOptions);
      if (collectionData.objects) {
        userData.push(...collectionData.objects);
      }
    };

    return userData;
  };

  /**
   * 
   */
  async doChatCompletion(
    dataObject: any,
    input: Input
  ) {
    try {
      const
        // get initial response. 
        response = "hello world";//await discordChatCompletion(dataObject, input),
        // parsed = await response.json();

        
      if (response/*.ok*/) {
        const text: string = response;// parsed.choices[0].message.content;


        return text;
      }
      // error response
      else
        return response//parsed.detail || "something weird happened..";// TODO: actually handle this

    } catch (e: any) {
      console.error(e.message || e);
      return 'An error occurred while generating response: ' + e.message || e;
    };
  };


  /**
   * Stores an interaction payload.
   */
  storeInteractionPayload(role: string, input: Input, tenant:string | null = null) {
    try {
      if (this.activeUserCollection === null)
        throw new Error('activeUserCollection equals null');

      const insertObj = { ...input, messageID: input.id, role };
      // remove id from insertObj (id is a reserved item with Weaviate)
      delete insertObj.id;
      // make any null values as undefined
      const replaceNulls = (obj: { [x: string]: any; }) => {
        for (const key in obj) {
          if (obj[key] === null)
            obj[key] = undefined;
          else if (typeof obj[key] === 'object' && obj[key] !== null)
            replaceNulls(obj[key]);
        };
      };
      replaceNulls(insertObj);


      const activeTenant = this.activeUserCollection.withTenant(tenant === null ? input.author : tenant);
      activeTenant.data.insert({ id: uuidv4(), properties: { ...insertObj } });
    }
    catch (e: any) {
      console.error("storeInteractionPayload::", e.message || e);
    };
  };
};

