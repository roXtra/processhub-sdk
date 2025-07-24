import { getErrorHandlers } from "./errorhandler.js";
import { IBaseRequest, ApiResult, IBaseError, IBaseMessage, API_FAILED } from "./apiinterfaces.js";
import { getBackendUrl, getBasePath } from "../config.js";
import isEmpty from "lodash/isEmpty.js";
import fetchWithTimeout, { RequestTimedOutPrefix } from "../tools/fetchwithtimeout.js";
import { AxiosRequestConfig } from "axios";
import { getUserToken } from "./auth.js";
import { getModuleForRequestPath } from "../modules/modules.js";

/**
 * @default showErrorModal = true
 * @default accessToken = undefined
 */
export type RequestOptions = { showErrorModal?: boolean; accessToken?: string; timeoutInMs?: number };

// Api-Aufruf per GET
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getJson<Request extends IBaseRequest>(path: string, request: Request, options: RequestOptions = { showErrorModal: true }): Promise<IBaseMessage> {
  const { showErrorModal } = options;
  let { accessToken } = options;
  if (request.moduleId === undefined && typeof window !== "undefined") {
    request.moduleId = getModuleForRequestPath(window.location.pathname).id;
  }

  accessToken = accessToken || getUserToken();

  // Request als Querystring serialisieren
  const str = [];
  for (const p in request) {
    if (Object.prototype.hasOwnProperty.call(request, p)) {
      const requestedPath = String(request[p]);
      const requestWithoutBasePath = requestedPath.replace(getBasePath().toLowerCase(), "");
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(requestWithoutBasePath));
    }
  }

  const url = isEmpty(request) ? getBackendUrl() + path : getBackendUrl() + path + "?" + str.join("&");

  let req: AxiosRequestConfig;
  if (accessToken == null) {
    req = {
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "x-accesstoken": accessToken, // X-accesstoken Kleinschreibung erforderlich
        authorization: accessToken,
      },
    };
  }
  req.responseType = "json";
  req.validateStatus = () => true;
  try {
    const response = await fetchWithTimeout(url, req, options.timeoutInMs);
    switch (response.status) {
      case 200: {
        const json = response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (json.result !== ApiResult.API_OK) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log("getJson " + url + ": " + String(json.result));
          console.log(json);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
        return error;
      }
    }
  } catch (ex) {
    // For Testing
    if (ex instanceof Error && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK,
      };
      return testResult;
    }
    throw new Error(String(ex));
  }
}

// Api-Aufruf per POST
// Gemäß http-Spezifikation soll POST genutzt werden, wenn der Aufruf zu Änderungen auf der Serverseite führt
// POST-Anforderungen werden ohne explizite Useranforderung vom Browser NICHT wiederholt ausgeführt
export async function postJson<Request extends IBaseRequest>(path: string, request: Request, options: RequestOptions = { showErrorModal: true }): Promise<IBaseMessage> {
  const { showErrorModal } = options;
  let { accessToken } = options;
  const url = getBackendUrl() + path;

  if (request.moduleId === undefined && typeof window !== "undefined") {
    request.moduleId = getModuleForRequestPath(window.location.pathname).id;
  }

  accessToken = accessToken || getUserToken();

  let req: AxiosRequestConfig;
  if (accessToken == null) {
    req = {
      method: "POST",
      data: JSON.stringify(request),
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      method: "POST",
      data: JSON.stringify(request),
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "x-accesstoken": accessToken, // X-accesstoken Kleinschreibung erforderlich
      },
    };
  }
  req.responseType = "json";
  req.validateStatus = () => true;
  try {
    const response = await fetchWithTimeout(url, req, options.timeoutInMs);
    switch (response.status) {
      case 200: {
        const json = response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (json.result !== ApiResult.API_OK) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log("postJson " + url + ": " + String(json.result));
          console.log(json);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
        return error;
      }
    }
  } catch (ex) {
    // For Testing
    if (ex instanceof Error && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK,
      };
      return testResult;
    }
    if (ex instanceof Error && ex.message.startsWith(RequestTimedOutPrefix)) {
      const error: IBaseError = { result: ApiResult.API_REQUESTTIMEOUT, type: API_FAILED };
      getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
      return error;
    }
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (ex instanceof Error && (ex as any).code === "ENETUNREACH") {
      // Replace with a robust error code check
      const error: IBaseError = { result: ApiResult.API_NETWORK_ERROR, type: API_FAILED };
      getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
      return error;
    }

    throw new Error(String(ex));
  }
}
