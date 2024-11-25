import url from "../../data/apiData/url.json";
import { createLeaddata, oauthData } from '../../data/apiData/rawData';
import { httpRequest } from "../../helpers/requestUtils";

const baseURL = url.leadEndPoint;



export async function createLead(instanceUrl: string, accessToken: string) {

    const response = await httpRequest('post', `${instanceUrl}${baseURL}`, createLeaddata, {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });
    const createdUser = response.data.id
    return [response, createdUser];

}

export async function GetcreatedLead(instanceUrl: string, accessToken: string, leadId: any) {
    console.log(`${instanceUrl}${baseURL}/${leadId}`);

    const response = await httpRequest('get',`${instanceUrl}${baseURL}/${leadId}`
, createLeaddata, {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });
    return response;

}
