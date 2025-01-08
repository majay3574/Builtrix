import test from "playwright/test";
import { generateAccessToken } from "../../api_services/generateAccessTokken";
import { createLead, GetcreatedLead, patchCreatedLead } from "../../api_services/lead";

let instanceURL: any, accessTokken: any
let response: any, createdUser: string
test.describe(`Salesforce_Create_And_Update_Lead`, () => {
    test.describe.configure({ mode: 'serial' })
    test(`Generate Access Tokken`, async () => {
        [instanceURL, accessTokken] = await generateAccessToken();
        console.log(instanceURL, accessTokken);
    })

    test(`Create Lead from Salesforce`, async () => {
        [response, createdUser] = await createLead(instanceURL, accessTokken);
        console.log(response,
            `${createdUser} Successfully Created`
        );

    })

    test(`Update Created Lead from Salesforce`, async () => {
        let response = await patchCreatedLead(instanceURL, accessTokken, createdUser);
        console.log(response);

    })

    test(`Retrive Created Lead from SalesForce`, async () => {
        let response = await GetcreatedLead(instanceURL, accessTokken, createdUser);
        console.log(response);

    })
})