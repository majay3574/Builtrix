import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export type RequestContentType =
  | 'json'
  | 'form-data'
  | 'x-www-form-urlencoded'
  | 'binary'
  | 'graphql';

interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endPoint: string;
  userData?: Record<string, any> | FormData | Blob | string;
  customHeaders?: Record<string, string>;
  additionalConfig?: AxiosRequestConfig;
  contentType?: RequestContentType;
}

export async function httpRequest({
  method,
  endPoint,
  userData,
  customHeaders = {},
  additionalConfig = {},
  contentType = 'json',
}: HttpRequestOptions): Promise<any> {
  let requestBody: any = undefined;
  const headers: Record<string, string> = {
    Connection: 'keep-alive',
    ...customHeaders,
  };

  switch (contentType) {
    case 'json':
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(userData);
      break;

    case 'form-data':
      headers['Content-Type'] = 'multipart/form-data';
      if (userData instanceof FormData) {
        requestBody = userData;
      } else {
        requestBody = new FormData();
        Object.entries(userData || {}).forEach(([key, value]) => {
          requestBody.append(key, value);
        });
      }
      break;

    case 'x-www-form-urlencoded':
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      requestBody = new URLSearchParams(userData as Record<string, string>).toString();
      break;

    case 'binary':
      headers['Content-Type'] = 'application/octet-stream';
      requestBody = userData;
      break;

    case 'graphql':
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify({
        query: (userData as any)?.query,
        variables: (userData as any)?.variables || {},
      });
      break;
  }

  try {
    const config: AxiosRequestConfig = {
      headers,
      ...additionalConfig,
    };

    const response: AxiosResponse<any> = await axios({
      method,
      url: endPoint,
      data: method !== 'GET' ? requestBody : undefined,
      ...config,
    });

    return {
      data: response.data,
      status: `${response.status} ${response.statusText}`,
    };
  } catch (error) {
    console.error(`Error making ${method.toUpperCase()} request:`, error);
    throw error;
  }
}
