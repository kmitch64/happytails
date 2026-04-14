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
        const { client, collection } = await this.activateCollection();
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
    storeInteractionPayload(role, input, tenant) {
        try {
            if (this.activeUserCollection === null)
                throw new Error('activeUserCollection equals null');
            const insertObj = { ...input, messageID: input.id, role };
            // remove id from insertObj (id is a reserved item with Weaviate)
            delete insertObj.id;
            // make any null values as undefined
            const replaceNulls = (obj) => {
                for (const key in obj) {
                    if (obj[key] === null)
                        obj[key] = undefined;
                    else if (typeof obj[key] === 'object' && obj[key] !== null)
                        replaceNulls(obj[key]);
                }
                ;
            };
            replaceNulls(insertObj);
            const activeTenant = this.activeUserCollection.withTenant(tenant);
            activeTenant.data.insert({ id: uuidv4(), properties: { ...insertObj } });
        }
        catch (e) {
            console.log("storeInteractionPayload::", e.message || e);
        }
        ;
    }
    ;
}
;
