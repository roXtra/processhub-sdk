import fetch from "cross-fetch";
import { executeWithTimeout, TaskTimedOutError } from "./executewithtimeout";

export default function (url: string, options: RequestInit, timeoutMS = 60000): Promise<Response> {
  const fetchRequest = fetch(url, options);
  return executeWithTimeout(() => fetchRequest, timeoutMS).catch((err) => {
    if (err instanceof TaskTimedOutError) {
      // Fetch operation timed out
      throw new Error(`Fetch request timed out: Request was to url ${url} with timeout ${timeoutMS}`);
    } else {
      // Exception occurred during fetch operation
      throw err;
    }
  });
}
