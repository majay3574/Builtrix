import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export async function postRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig,
): Promise<any> {

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {

        const headers = {
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive",
            ...customHeaders
        };

        const response: AxiosResponse<any> = await axios.post(endPoint, formData, {
            headers,
            ...additionalConfig
        });
        return {
            data: response.data,
            status: response.status
        }

    } catch (error) {
        console.error("Error making POST request:", error);
        throw error;
    }
}


export async function getRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig
): Promise<any> {
    try {
        const queryParams = new URLSearchParams(userData).toString();

        const headers = {
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            ...customHeaders
        };

        const url = queryParams ? `${endPoint}?${queryParams}` : endPoint;
        const response: AxiosResponse<any> = await axios.get(url, {
            headers,
            ...additionalConfig
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error making GET request:", error);
        throw error;
    }
}



export async function deleteRequest(
    userData: Record<string, any>,
    endPoint: string,
    customHeaders?: Record<string, string>,
    additionalConfig?: AxiosRequestConfig
): Promise<any> {

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const headers = {
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive",
            ...customHeaders
        };

        const config: AxiosRequestConfig = {
            headers,
            data: formData,
            ...additionalConfig
        };

        const response: AxiosResponse<any> = await axios.delete(endPoint, config);

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Error making DELETE request:", error);
        throw error;
    }
}
