import { userCreationData, getLearnerUser, updateUserData } from "../data/apiData/outhData";
import url from "../data/apiData/url.json"
import { postRequest } from "../utils/requestUtils";
import { assertStatus, assertResponse } from "../utils/verificationUtils";
import { generateOauthToken } from "./accessToken"
/* let access_token: any
const authorization: any = `Authorization: '${access_token}'`;
async () => {
    access_token = (await generateOauthToken()).accessToken;
} */
export async function userCreation(userData: any, authorization: any) {
    try {

        let response = await postRequest(userData, url.endPointURL, authorization);
        console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.result, "success");
        return response.data.user_id
    } catch (error) {
        console.error("Failed to execute", error);
        throw error;
    }
}

export async function getUserDetail(retrivied_userID: any, authorization: any) {
    let response = await postRequest(getLearnerUser(retrivied_userID), url.learnerEndPointURL, authorization);
    await assertStatus(response.status, 200);
    console.log("User Data:", response.data.data.user_data);
    console.log("User Name:", response.data.data.user_data.Username);
    return response.data.data.user_data.Username

}

export async function updateUser(retrivied_userID: any, username: any, authorization: any) {
    let response = await postRequest(updateUserData(retrivied_userID, username), url.endPointURL, authorization);
    console.log(response);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    await assertResponse(response.data.message, "Request Successful");

}