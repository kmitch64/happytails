
import { v4 as uuidv4 } from 'uuid';
import WeaviateDataManager from "./Weaviate";
import type { ModelProvider } from "./Weaviate";

//wait to move this
interface Input {
  id: any;
  content: any;
  author: string;
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



  };

  
  async getContext(username: string, input: Input) {
    const
      baseHybridOptions: HybridOptions = {
        limit: 15,
        alpha: 0.5,
        // queryProperties: [], // empty to enable searching all fields
        fusionType: "Ranked"
      },
      hybridCorpusResult = await this.hybridCorpus(username, input, baseHybridOptions);
    return hybridCorpusResult;
  };


  private async hybridCorpus(username: string, input: Input, baseHybridOptions: HybridOptions) {
    const {client, collection} = await this.activateCollection();

    await collection.tenants.create([
      { name: username }
    ])

    const
      activeTenant = collection.withTenant(username),
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
   * Stores an interaction payload.
   */
  storeInteractionPayload(role: string, input: Input, tenant: string) {
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

      const activeTenant = this.activeUserCollection.withTenant(tenant);
      activeTenant.data.insert({ id: uuidv4(), properties: { ...insertObj } });
    }
    catch (e: any) {
      console.log("storeInteractionPayload::", e.message || e);
    };
  };

};

