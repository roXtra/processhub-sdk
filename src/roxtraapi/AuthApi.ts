import { IAuthApi } from "./IApi";
import { AuthRequestBody } from "./ApiTypes";

async function post(APIUrl: string, body: AuthRequestBody): Promise<Response> {
  const req = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    return await fetch(APIUrl, req);
  }
  catch (ex) {
    console.error("Konnte keine Verbindung zur Auth API aufbauen");
    return undefined;
  }
}

export class AuthApi implements IAuthApi {

  public async authenticate(baseURL: string, clientId: string, clientSecret: string): Promise<Response> {
    const apiURL: string = baseURL + "/api/auth/AuthByClientSecret";

    return await post(apiURL, {
      ClientId: clientId,
      ClientSecret: clientSecret
    });
  }
}