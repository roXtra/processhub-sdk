import { getErrorHandlers } from "./errorhandler";
import { IBaseRequest, ApiResult, IBaseError, IBaseMessage, API_FAILED } from "./apiinterfaces";
import { getBackendUrl, getBasePath } from "../config";
import isEmpty from "lodash/isEmpty";
import fetchWithTimeout, { RequestTimedOutPrefix } from "../tools/fetchwithtimeout";

/**
 * @default showErrorModal = true
 * @default accessToken = undefined
 */
export type RequestOptions = { showErrorModal?: boolean; accessToken?: string };

// Api-Aufruf per GET
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getJson<Request extends IBaseRequest>(path: string, request: Request, options: RequestOptions = { showErrorModal: true }): Promise<IBaseMessage> {
  const { showErrorModal } = options;
  let { accessToken } = options;
  if (request.moduleId === undefined && typeof window !== "undefined") {
    request.moduleId = window.__INITIAL_CONFIG__.moduleId;
  }

  if (accessToken == null && typeof window !== "undefined") {
    accessToken = window.__INITIAL_CONFIG__.xAccesstoken;
  }

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

  let req: RequestInit;
  if (accessToken == null) {
    req = {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
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
  try {
    const response = await fetchWithTimeout(url, req);
    switch (response.status) {
      case 200: {
        const json = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (json.result !== ApiResult.API_OK) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log("getJson " + url + ": " + String(json.result));
          console.log(json);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      }
      case 401: {
        // API_UNAUTHORIZED -> server requests redirect to signin
        if (typeof window !== "undefined") {
          //  Not possible on server rendering
          console.log("401 -> redirect to roxtra login page with url: " + window.location.href);
          window.location.href = window.__INITIAL_CONFIG__.roXtraUrl + "?redirect=" + encodeURIComponent(window.location.href);
        }
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        return error;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
        return error;
      }
    }
  } catch (exception) {
    // For Testing
    const ex = exception as { message: string };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK,
      };
      return testResult;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(ex.message);
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
    request.moduleId = window.__INITIAL_CONFIG__.moduleId;
  }

  if (accessToken == null && typeof window !== "undefined") {
    accessToken = window.__INITIAL_CONFIG__.xAccesstoken;
  }

  let req: RequestInit;
  if (accessToken == null) {
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "x-accesstoken": accessToken, // X-accesstoken Kleinschreibung erforderlich
      },
    };
  }
  try {
    const response = await fetchWithTimeout(url, req);
    switch (response.status) {
      case 200: {
        const json = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (json.result !== ApiResult.API_OK) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log("postJson " + url + ": " + String(json.result));
          console.log(json);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      }
      case 401: {
        // API_UNAUTHORIZED -> server requests redirect to signin
        if (typeof window !== "undefined") {
          //  Not possible on server rendering
          window.location.href = window.__INITIAL_CONFIG__.roXtraUrl + "?redirect=" + encodeURIComponent(window.location.href);
        }
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        return error;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
        return error;
      }
    }
  } catch (exception) {
    // For Testing
    const ex = exception as { message: string };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK,
      };
      return testResult;
    }
    if (ex != null && ex.message.startsWith(RequestTimedOutPrefix)) {
      const error: IBaseError = { result: ApiResult.API_REQUESTTIMEOUT, type: API_FAILED };
      getErrorHandlers().forEach((h) => h.handleError(error, path, showErrorModal));
      return error;
    }

    throw new Error(ex.message);
  }
}

// Externer Api-Aufruf per GET
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getExternalJson<Request extends IBaseRequest>(
  apiEndpointUrl: string,
  request: Request,
  options: RequestOptions = { showErrorModal: true },
): Promise<any> {
  const { showErrorModal, accessToken } = options;
  // Request als Querystring serialisieren
  const str = [];
  for (const p in request) {
    if (Object.prototype.hasOwnProperty.call(request, p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(String(request[p])));
    }
  }

  const url = apiEndpointUrl + "?" + str.join("&");

  let req: RequestInit;
  if (accessToken == null) {
    req = {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        Accept: "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "x-accesstoken": accessToken, // X-accesstoken Kleinschreibung erforderlich
      },
    };
  }
  const response = await fetchWithTimeout(url, req);

  switch (response.status) {
    case 200: {
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (json.result !== ApiResult.API_OK) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log("getJson " + url + ": " + String(json.result));
        console.log(json);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return json;
    }
    case 401: {
      // API_UNAUTHORIZED -> server requests redirect to signin
      if (typeof window !== "undefined") {
        //  Not possible on server rendering
        window.location.href = window.__INITIAL_CONFIG__.roXtraUrl + "?redirect=" + encodeURIComponent(window.location.href);
      }
      const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
      return error;
    }
    default: {
      const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
      getErrorHandlers().forEach((h) => h.handleError(error, url, showErrorModal));
      return error;
    }
  }
}
