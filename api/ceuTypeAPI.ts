import { postRequest } from "../utils/requestUtils";
import url from "../data/apiData/url.json"
import { ceuGetListOfData, ceuTypeCreationData, ceuTypeDelete, generateCode } from "../data/apiData/outhData"
import { assertResponse, assertStatus } from "../utils/verificationUtils";
import { generateOauthToken } from "./accessToken";


export async function createCEUType(code: string, authorization: any) {
    let response = await postRequest(ceuTypeCreationData(code), url.endPointURL, authorization);
    let ceu_type_id = response.data.data.ceu_type_id
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    await assertResponse(response.data.message, "Request Successful");
    console.log(response);
    return ceu_type_id;
}


export async function ceu_type_list(authorization: any, id: any) {
    let response = await postRequest(ceuGetListOfData, url.endPointURL, authorization);
    //let codeArray: string[] = response.data.data.map((item: { code: string }) => item.code);
    //console.log("All codes:", codeArray);
    let specificCodeItem = response.data.data.find((item: { _id: number }) => item._id === id);
    if (specificCodeItem) {
        console.log(`Code for _id = ${id}:`, specificCodeItem.code);
    } else {
        console.log(`Code for _id = ${id}:`);
    }
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    await assertResponse(response.data.message, "Request Successful");
    return specificCodeItem.code
}

export async function delete_ceu_type(code: string, authorization: any) {
    let response = await postRequest(ceuTypeDelete(code), url.endPointURL, authorization);
    console.log(response.data);
    let message = response.data.data.message
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    await assertResponse(response.data.message, "Request Successful");
    await assertResponse(response.data.data.result, "success");
    await assertResponse(message, true);

}
