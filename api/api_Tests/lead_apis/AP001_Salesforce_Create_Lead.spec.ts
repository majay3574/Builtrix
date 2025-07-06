import test from "playwright/test";
import { generateAccessToken } from "../../api_services/generateAccessTokken";
import { createLead, GetcreatedLead } from "../../api_services/lead";
import { createLeadSchema } from "../../schema/leadSchema/create_Lead_Schema";
import { fullLeadSchema } from "../../schema/leadSchema/get_Lead_Schema";


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
        try {
            createLeadSchema.parse(response.data);
            console.log('✅ Zod validation passed!');
        } catch (err: any) {
            console.error('Zod validation failed:', err.errors);
            throw new Error('Schema validation failed');
        }
    });

    test(`Retrieve Created Lead from Salesforce`, async () => {
        const retrievedLead = await GetcreatedLead(instanceURL, accessToken, createdUser);
        console.log("Retrieved Lead:", retrievedLead);
        try {
            fullLeadSchema.parse(retrievedLead.data);
            console.log('✅ Lead schema validated successfully');
        } catch (err: any) {
            console.error('❌ Zod validation error:', err.errors);
            throw new Error('Schema validation failed');
        }
    });
});
