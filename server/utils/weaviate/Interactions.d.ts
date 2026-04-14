import WeaviateDataManager from "./Weaviate";
import type { ModelProvider } from "./Weaviate";
interface Input {
    id: any;
    content: any;
    author: string;
    pet: string;
}
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
    storeInteractionPayload(role: string, input: Input, tenant: string): void;
}
export {};
