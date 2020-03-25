import { getErrorHandlers } from "./errorhandler";
import { IBaseRequest, ApiResult, IBaseError, IBaseMessage, API_FAILED } from "./apiinterfaces";
import { getBackendUrl, getBasePath } from "../config";
import isEmpty from "lodash/isEmpty";
import fetchWithTimeout from "../tools/fetchwithtimeout";

// Api-Aufruf per GET
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getJson<Request extends IBaseRequest>(path: string, request: Request, accessToken: string = null): Promise<IBaseMessage> {

  if (typeof window !== "undefined") {
    request.moduleId = window.__INITIAL_CONFIG__.moduleId;
  }

  // Request als Querystring serialisieren
  const str = [];
  for (const p in request) {
    if (Object.prototype.hasOwnProperty.call(request, p)) {
      const requestedPath = String(request[p]);
      const requestWithoutBasePath = requestedPath.replace(getBasePath(), "");
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(requestWithoutBasePath));
    }
  }

  const url = (isEmpty(request)) ? getBackendUrl() + path : getBackendUrl() + path + "?" + str.join("&");

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      headers: {
        "Accept": "application/json"
      },
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        "Accept": "application/json",
        "x-accesstoken": accessToken,   // X-accesstoken Kleinschreibung erforderlich
        "authorization": accessToken
      }
    };
  }
  try {
    const response = await fetchWithTimeout(url, req);
    switch (response.status) {
      case 200: {
        const json = await response.json();
        if (json.result !== ApiResult.API_OK) {
          console.log("getJson " + url + ": " + json.result);
          console.log(json);
        }
        return json;
      }
      case 403: {  // API_FORBIDDEN -> server requests redirect to signin
        if (typeof window !== "undefined") {
          //  Not possible on server rendering
          window.location.href = window.__INITIAL_CONFIG__.roXtraUrl;
        }
        break;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach(h => h.handleError(error, path));
        return error;
      }
    }
  } catch (ex) {
    // For Testing
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK
      };
      return testResult;
    }
    throw new Error(ex.message);
  }
}

// Api-Aufruf per POST
// Gemäß http-Spezifikation soll POST genutzt werden, wenn der Aufruf zu Änderungen auf der Serverseite führt
// POST-Anforderungen werden ohne explizite Useranforderung vom Browser NICHT wiederholt ausgeführt
export async function postJson<Request extends IBaseRequest>(path: string, request: Request, accessToken: string = null): Promise<IBaseMessage> {
  const url = getBackendUrl() + path;

  if (typeof window !== "undefined") {
    request.moduleId = window.__INITIAL_CONFIG__.moduleId;
  }

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-accesstoken": accessToken   // X-accesstoken Kleinschreibung erforderlich
      }
    };
  }
  try {
    const response = await fetchWithTimeout(url, req);
    switch (response.status) {
      case 200: {
        const json = await response.json();
        if (json.result !== ApiResult.API_OK) {
          console.log("postJson " + url + ": " + json.result);
          console.log(json);
        }
        return json;
      }
      default: {
        const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach(h => h.handleError(error, path));
        return error;
      }
    }
  } catch (ex) {
    // For Testing
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      const testResult: IBaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK
      };
      return testResult;
    }
    throw new Error(ex.message);
  }
}


// Externer Api-Aufruf per GET
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getExternalJson<Request extends IBaseRequest>(apiEndpointUrl: string, request: Request, accessToken: string = null): Promise<any> {

  // Request als Querystring serialisieren
  const str = [];
  for (const p in request) {
    if (Object.prototype.hasOwnProperty.call(request, p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(String(request[p])));
    }
  }

  const url = apiEndpointUrl + "?" + str.join("&");

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      headers: {
        "Accept": "application/json"
      },
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        "Accept": "application/json",
        "x-accesstoken": accessToken   // X-accesstoken Kleinschreibung erforderlich
      }
    };
  }
  const response = await fetchWithTimeout(url, req);

  switch (response.status) {
    case 200: {
      const json = await response.json();
      if (json.result !== ApiResult.API_OK) {
        console.log("getJson " + url + ": " + json.result);
        console.log(json);
      }
      return json;
    }
    case 403: {  // API_FORBIDDEN -> server requests redirect to signin
      if (typeof window !== "undefined") {
        //  Not possible on server rendering
        window.location.href = window.__INITIAL_CONFIG__.roXtraUrl;
      }
      break;
    }
    default: {
      const error: IBaseError = { result: response.status as ApiResult, type: API_FAILED };
      getErrorHandlers().forEach(h => h.handleError(error, url));
      return error;
    }
  }
}