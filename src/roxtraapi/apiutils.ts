export async function get(APIUrl: string, token: string): Promise<Response> {
  const headers = {
    "Authorization": "Bearer " + token
  };

  const req = {
    method: "GET",
    headers: headers,
  };

  return await fetch(APIUrl, req);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post(APIUrl: string, token: string, body: any): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  };

  const req = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };

  return await fetch(APIUrl, req);
}
