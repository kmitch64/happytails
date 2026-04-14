import type { Collection } from 'weaviate-client';
import { WeaviateClient } from 'weaviate-client';
export type ModelProvider = 'mistral' | 'openai';
/**
 * Manages data operations with Weaviate.
 */
export default class WeaviateDataManager {
    private collectionIdentifier;
    private modelProvider;
    private modelproviderKeys;
    private text2vecConfigs;
    private generativeConfigs;
    client: WeaviateClient | null;
    activeUserCollection: Collection | null;
    corpusCollection: {
        [key: string]: Collection;
    };
    /**
     * Creates a new instance of the `WeaviateDataManager` class.
     */
    constructor(datasetName: string, modelProvider: ModelProvider);
    /**
     * Initializes the active user collection.
     */
    activateCollection(): Promise<{
        client: WeaviateClient;
        collection: Collection<undefined, string, undefined>;
    }>;
    /**
     * Loads all existing collections into a corpus collection.
     */
    gatherCollections(): Promise<false | {
        [key: string]: Collection<undefined, string, undefined>;
    }>;
    /**
     * Retrieves a Weaviate client instance.
     */
    private getClient;
    /**
     * Creates a Weaviate Multi-tenancy Collection.
     */
    private createMultiTenantCollection;
    /**
     * Creates a Weaviate Single-tenancy Collection.
     */
    private createSingleTenantCollection;
}
