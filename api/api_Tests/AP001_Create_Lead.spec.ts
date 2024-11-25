import test from "playwright/test";
import { generateAccessToken } from "../api_services/generateAccessTokken";
import { createLead, GetcreatedLead } from "../api_services/lead";

let instanceURL: any, accessTokken: any
let response: any, createdUser: string
test(`Generate Access Tokken`, async () => {
    [instanceURL, accessTokken] = await generateAccessToken();
    console.log(instanceURL, accessTokken);
})

test(`CreateLead`, async () => {
    [response, createdUser] = await createLead(instanceURL, accessTokken);
    console.log(response,
        `${createdUser} Successfully Created`
    );

})

test(`Retrive Created Lead from SalesForce`, async () => {
    let response = await GetcreatedLead(instanceURL, accessTokken, createdUser);
    console.log(response);

})


