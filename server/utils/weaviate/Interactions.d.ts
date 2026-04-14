import WeaviateDataManager from "./Weaviate";
/**
 *
 */
export default class Interactions extends WeaviateDataManager {
    /**
     *
     */
    constructor(collection: string, modelProvider: ModelProvider);
    getContext(username: string, input: Input): Promise<import("weaviate-client").WeaviateNonGenericObject[]>;
    private hybridCorpus;
    /**
     * Stores an interaction payload.
     */
    storeInteractionPayload(role: string, input: Input, tenant: string): Promise<void>;
}
