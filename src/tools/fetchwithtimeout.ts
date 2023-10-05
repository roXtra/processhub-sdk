import { executeWithTimeout, TaskTimedOutError } from "./executewithtimeout";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const RequestTimedOutPrefix = "Fetch request timed out: ";

export default async function (url: string, options: AxiosRequestConfig, timeoutMS = 60000): Promise<AxiosResponse> {
  const fetchRequest = (): Promise<AxiosResponse> => axios(url, options);
  return executeWithTimeout(fetchRequest, timeoutMS).catch((err) => {
    if (err instanceof TaskTimedOutError) {
      // Fetch operation timed out
      throw new Error(`${RequestTimedOutPrefix}Request was to url ${url} with timeout ${timeoutMS}`);
    } else {
      // Exception occurred during fetch operation
      throw err;
    }
  });
}
