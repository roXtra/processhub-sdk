import "fetch-everywhere";

export default function (url: string, options: RequestInit, timeoutMS = 60000): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch request timed out")), timeoutMS)
    )
  ]);
}