export async function get(apiUrl: string, token: string): Promise<Response> {
  const headers = {
    "Authorization": "Bearer " + token
  };

  const req = {
    method: "GET",
    headers: headers,
  };

  return await fetch(apiUrl, req);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post(apiUrl: string, token: string, body: any): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  };

  const req = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };

  return await fetch(apiUrl, req);
}
