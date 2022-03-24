import fetch from "cross-fetch";
import { executeWithTimeout, TaskTimedOutError } from "./executewithtimeout.js";

export const RequestTimedOutPrefix = "Fetch request timed out: ";

export default async function (url: string, options: RequestInit, timeoutMS = 60000): Promise<Response> {
  const fetchRequest = (): Promise<Response> => fetch(url, options);
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
