import test from "playwright/test";
import { generateAccessToken } from "../../api_services/generateAccessTokken";
import { createLead, GetcreatedLead, patchCreatedLead } from "../../api_services/lead";

let instanceURL: string;
let accessToken: string;
let response: any;
let createdUser: string;

test.describe(`Salesforce_Create_And_Update_Lead`, () => {
    test.describe.configure({ mode: 'serial' });

    test(`Generate Access Token`, async () => {
        [instanceURL, accessToken] = await generateAccessToken();
        console.log("Instance URL:", instanceURL);
        console.log("Access Token:", accessToken);
    });

    test(`Create Lead from Salesforce`, async () => {
        [response, createdUser] = await createLead(instanceURL, accessToken);
        console.log("Create Lead Response:", response);
        console.log(`Lead ID ${createdUser} successfully created.`);
    });

    test(`Update Created Lead from Salesforce`, async () => {
        const updateResponse = await patchCreatedLead(instanceURL, accessToken, createdUser);
        console.log("Update Lead Response:", updateResponse);
    });

    test(`Verify Updated Lead`, async () => {
        const verificationResponse = await GetcreatedLead(instanceURL, accessToken, createdUser);
        console.log("Fetched Updated Lead:", verificationResponse);
    });
});
