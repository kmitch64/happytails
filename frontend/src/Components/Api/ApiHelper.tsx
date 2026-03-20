/**
 * Modified to handle optional authentication
 * getToken is typed inline as a function returning a Promise
 */
export const getAuthHeaders = async (
    getToken: (options?: any) => Promise<string | null | undefined>
): Promise<Record<string, string | undefined>> => {
    // Use Record<string, string | undefined> to add 'Authorization' dynamically
    const headers: Record<string, string | undefined> = {
        'Content-Type': 'application/json', // Default header
    };

    // Check if getToken was actually passed as a function
    if (typeof getToken === 'function') {
        try {
            const jwt = await getToken();
            // Only add the Authorization header if a token actually exists
            if (jwt) {
                headers['Authorization'] = `Bearer ${jwt}`;
            }

        } catch (e) {
            // If getToken fails (e.g., user not logged in), just log it and proceed as guest
            console.warn("Optional authentication failed or user not logged in. Proceeding as guest.");
        }
    }

    return headers;
};

export const getAuthHeadersNoJson = async (
    getToken: (options?: any) => Promise<string | null | undefined>
): Promise<Record<string, string | undefined>> => {
    const headers: Record<string, string | undefined> = {};

    if (typeof getToken === 'function') {
        try {
            const jwt = await getToken();
            if (jwt) {
                headers['Authorization'] = `Bearer ${jwt}`;
            }

        } catch (e) {
            console.warn("Optional authentication failed. Proceeding as guest.");
        }
    }
    return headers;
};

/**
 * necessary to ensure that fetch works the way it should
 * in this asynchronous environment the getAutHeader does not hold the actual header
 * it holds the promise of an header thats called in the API helpers
 * the function will fail before it gets to populate the headers
 */
export const fetchHelper = async (url: string, options: RequestInit): Promise<any> => {

    try {
        const response: Response = await fetch(url, options); // url = api urls & options = options for the data

        const contentType = response.headers.get("content-type");
        // try to parse JSON data / other data regardless of response status for detailed error messages
        const rawData = await response.text(); // only checks the incoming stream once
        let data: any;
        const isTextFile = (contentType && contentType.includes("text/plain")) || url.endsWith('.txt');
        if (isTextFile) {
            data = rawData;
        } else {
            // Attempt JSON, but if it fails, get the raw text to see the error
            try {
                data = JSON.parse(rawData);

            } catch (e) {
                data = { message: rawData || 'No response body' };
            }
        }


        if (response.ok) {
            return data;
        } else {
            const detailedMessage = data || {};
            // Cast to 'any' to allow adding the custom .payload property 
            const error = new Error(detailedMessage.error || detailedMessage.message || `API request failed with status: ${response.status}.`) as any;

            error.payload = detailedMessage;
            console.error('API call failed:', response.status, data);
            throw error;
        }
    } catch (error) {
        console.error('Network or Authorization error:', error);
        throw error;
    }
};