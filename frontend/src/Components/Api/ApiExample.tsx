import { getAuthHeaders, fetchHelper } from "./apiHelper";

/**
 * Example Interface for the Pet Data
 */
interface PetData {
    name: string; //Required
    species: string;
    age: number;
    [key: string]: any; // Allows ANY other fields to send later
}

/**
 * Example Interface for the API Response
 */
interface PetResponse {
    id: string; //Required (matches the response that is sent from backend//variables can change to match backend)
    status: string;
    message?: string;
}

const BASE_URL = 'https://api.example.com/pets';

/**
 * Create a new pet entry
 * cast the return as <PetResponse> to fetchHelper so the return type is known
 */
//RECOMMENED
const create_1 = async (
    petData: PetData,
    getToken: (options?: any) => Promise<string | null | undefined>
): Promise<PetResponse> => {

    // Await the headers here to solve the async timing issue 
    // where the promise must resolve before the fetch is called
    const headers = await getAuthHeaders(getToken);

    const result = await fetchHelper(BASE_URL, {
        method: 'POST',
        headers: headers as Record<string, string>, // Casting to align with RequestInit's strict expectations
        body: JSON.stringify(petData),
    }) as PetResponse;
    return result;
};

//without petResponse
const create_2 = async (
    petData: PetData,
    getToken: (options?: any) => Promise<string | null | undefined>
) => {
    const headers = await getAuthHeaders(getToken);
    const result = await fetchHelper(BASE_URL, {
        method: 'POST',
        headers: headers as Record<string, string>,
        body: JSON.stringify(petData),
    });
    return result;
};

export default {
    create_1,
    create_2
}