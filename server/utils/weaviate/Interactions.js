import { v4 as uuidv4 } from 'uuid';
import WeaviateDataManager from "./Weaviate.js";
/**
 *
 */
export default class Interactions extends WeaviateDataManager {
    /**
     *
     */
    constructor(collection, modelProvider) {
        super(collection, modelProvider);
    }
    ;
    async getContext(username, input) {
        const baseHybridOptions = {
            limit: 15,
            alpha: 0.5,
            // queryProperties: [], // empty to enable searching all fields
            fusionType: "Ranked"
        }, hybridCorpusResult = await this.hybridCorpus(username, input, baseHybridOptions);
        return hybridCorpusResult;
    }
    ;
    async hybridCorpus(username, input, baseHybridOptions) {
        const { collection } = await this.activateCollection();
        await collection.tenants.create([
            { name: username }
        ]);
        const activeTenant = collection.withTenant(username), userContext = await activeTenant.query.fetchObjects(baseHybridOptions), userData = userContext.objects;
        for await (const collection of Object.values(this.corpusCollection)) {
            const collectionData = await collection.query.hybrid(input.content, baseHybridOptions);
            if (collectionData.objects) {
                userData.push(...collectionData.objects);
            }
        }
        ;
        return userData;
    }
    ;
    /**
     * Stores an interaction payload.
     */
    async storeInteractionPayload(tenant, input) {
        try {
            const { collection } = await this.activateCollection();
            const activeTenant = collection.withTenant(tenant);
            
            await activeTenant.data.insert(input);
        }
        catch (e) {
            console.error("storeInteractionPayload::", e);
        }
        ;
    }
    ;
}
;
