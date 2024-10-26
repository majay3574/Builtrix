import test from "playwright/test";
import { generateAccessToken } from "../api_test/generateAccessTokken";
import { createLead } from "../api_test/lead";

let instanceURL: any, accessTokken: any
test.beforeAll(`Generate Access Tokken`, async () => {
    [instanceURL, accessTokken] = await generateAccessToken();
    console.log(instanceURL, accessTokken);
})

test(`CreateLead`, async () => {
    let response = await createLead(instanceURL, accessTokken);
    console.log(response);
})

test