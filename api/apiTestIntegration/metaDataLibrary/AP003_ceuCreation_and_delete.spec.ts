import { test } from "@playwright/test";
import { generateOauthToken } from "../../accessToken";
import { generateCode } from "../../../data/apiData/outhData";
import { ceu_type_list, createCEUType, delete_ceu_type } from "../../ceuTypeAPI";

let generatedcode = generateCode();
test.describe('Testing UserCEUAPI Functionality', () => {
    test('Creating CEU Type', async () => {

        const access_token = await generateOauthToken();
        let ceu_id = await createCEUType(generatedcode, access_token);
        let code = await ceu_type_list(access_token, ceu_id);
        await delete_ceu_type(code, access_token);
        

    });
});



