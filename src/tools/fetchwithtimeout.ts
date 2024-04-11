import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const RequestTimedOutPrefix = "Request timed out: ";

export const fetchWithTimeout = async function (url: string, options: AxiosRequestConfig, timeoutMS = 60000): Promise<AxiosResponse> {
  options.timeout = timeoutMS;
  try {
    const response = await axios(url, options);
    return response;
  } catch (ex) {
    // Code is ECONNABORTED (Node18) or ETIMEDOUT (Node20)
    if (ex instanceof AxiosError && (ex.code === "ECONNABORTED" || ex.code === "ETIMEDOUT")) {
      // Fetch operation timed out
      throw new Error(`${RequestTimedOutPrefix}Request was to url ${url} with timeout ${timeoutMS}`);
    } else {
      // Exception occurred during fetch operation
      throw ex;
    }
  }
};

export default fetchWithTimeout;
