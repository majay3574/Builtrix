

import url from "../../data/apiData/url.json";
import { oauthData } from '../../data/apiData/rawData';
import { httpRequest } from "../../helpers/apiUtils/requestUtils";

const baseURL = url.bearerTokken;

export async function generateAccessToken() {
    try {
        const response = await httpRequest({
            method: 'POST',
            endPoint: baseURL,
            userData: oauthData,
            contentType: 'x-www-form-urlencoded',
            customHeaders: {
                "Connection": "keep-alive",
            }
        });
        const instanceUrl = response.data.instance_url;
        const bearerToken = response.data.access_token;

        return [instanceUrl, bearerToken];

    } catch (error) {
        console.error("Error generating access token:", error);
        throw error;
    }
}

