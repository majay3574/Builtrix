import url from "../../data/apiData/url.json";
import { createLeaddata, oauthData, updateLeadData } from '../../data/apiData/rawData';
import { httpRequest } from "../../helpers/requestUtils";

const baseURL = url.leadEndPoint;

export async function createLead(instanceUrl: string, accessToken: string) {
    const response = await httpRequest({
        method: 'POST',
        endPoint: `${instanceUrl}${baseURL}`,
        userData: createLeaddata,
        contentType: 'json',
        customHeaders: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const createdUser = response.data.id;
    return [response, createdUser];
}

export async function GetcreatedLead(instanceUrl: string, accessToken: string, leadId: any) {
    const response = await httpRequest({
        method: 'GET',
        endPoint: `${instanceUrl}${baseURL}/${leadId}`,
        contentType: 'json',
        customHeaders: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response;
}

export async function patchCreatedLead(instanceUrl: string, accessToken: string, leadId: any) {
    const response = await httpRequest({
        method: 'PATCH',
        endPoint: `${instanceUrl}${baseURL}/${leadId}`,
        userData: updateLeadData,
        contentType: 'json',
        customHeaders: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response;
}

export async function deleteLead(instanceUrl: string, accessToken: string, leadId: any) {
    const response = await httpRequest({
        method: 'DELETE',
        endPoint: `${instanceUrl}${baseURL}/${leadId}`,
        contentType: 'json',
        customHeaders: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response;
}
