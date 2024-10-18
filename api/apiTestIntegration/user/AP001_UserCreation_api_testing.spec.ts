import { test } from "@playwright/test";
import { userCreation } from "../../userAPI";
import { generateOauthToken } from "../../accessToken";
import { userCreationData } from "../../../data/apiData/outhData";
import { FakerData } from "../../../utils/fakerUtils";

let username = FakerData.getUserId();
test.describe('Testing UserAPI Functionality', () => {
    test('Creating User', async () => {
        const access_token = await generateOauthToken();
        console.log(access_token);
        let retrivedUserName = await userCreation(userCreationData(username), access_token);
        console.log(retrivedUserName);

    });
});



