import "fetch-everywhere";

export default function (url: string, options: RequestInit, timeoutMS = 60000): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch request timed out")), timeoutMS)
    )
  ]);
}