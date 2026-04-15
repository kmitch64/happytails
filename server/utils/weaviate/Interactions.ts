
import { v4 as uuidv4 } from 'uuid';
import WeaviateDataManager from "./Weaviate";


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
    const {collection} = await this.activateCollection();

    await collection.tenants.create([
      { name: username }
    ]);

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
  async storeInteractionPayload(tenant: string, input: Input) {
    try {
      const {collection} = await this.activateCollection();
      const activeTenant = collection.withTenant(tenant);

      await activeTenant.data.insert(input);
    }
    catch (e: any) {
      console.error("storeInteractionPayload::", e);
    };
  };

};

