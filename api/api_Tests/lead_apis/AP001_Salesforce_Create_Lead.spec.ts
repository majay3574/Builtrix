import test from "playwright/test";
import { generateAccessToken } from "../../api_services/generateAccessTokken";
import { createLead, GetcreatedLead } from "../../api_services/lead";


let instanceURL: string;
let accessToken: string;
let response: any;
let createdUser: string;

test.describe(`Salesforce_Create_Lead`, () => {
    test.describe.configure({ mode: 'serial' });

    test(`Generate Access Token`, async () => {
        [instanceURL, accessToken] = await generateAccessToken();
        console.log("Instance URL:", instanceURL);
        console.log("Access Token:", accessToken);
    });

    test(`Create Lead from Salesforce`, async () => {
        [response, createdUser] = await createLead(instanceURL, accessToken);
        console.log("Create Lead Response:", response);
        console.log(`Lead ID: ${createdUser} successfully created`);
    });

    test(`Retrieve Created Lead from Salesforce`, async () => {
        const retrievedLead = await GetcreatedLead(instanceURL, accessToken, createdUser);
        console.log("Retrieved Lead:", retrievedLead);
    });
});
