import { test } from "@playwright/test";
import { getUserDetail, updateUser, userCreation } from "../../userAPI";
import { generateOauthToken } from "../../accessToken";
import { userCreationData } from "../../../data/apiData/outhData";
import { FakerData } from "../../../utils/fakerUtils";

let username = FakerData.getUserId()
test('Creating User and Updating User', async () => {
    const access_token = await generateOauthToken();
    let userID = await userCreation(userCreationData(username), access_token);
    let retrivedUserName = await getUserDetail(userID, access_token);
    let updatedUser = await updateUser(userID, retrivedUserName, access_token);
    console.log(updatedUser);

});