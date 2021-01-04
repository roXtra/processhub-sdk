import fetch from "cross-fetch";

class TimeoutHandler {
  private timeoutMS: number;
  private timeoutID?: NodeJS.Timeout;

  constructor(config: { milliseconds: number }) {
    this.timeoutMS = config.milliseconds;
    this.timeoutID = undefined;
  }

  get execute(): Promise<Response> {
    return new Promise((response, reject) => {
      this.timeoutID = setTimeout(() => {
        reject(`Given request with ID ${String(this.timeoutID)} timed out!`);
      }, this.timeoutMS);
    });
  }

  clear(): void {
    if (this.timeoutID !== undefined) {
      clearTimeout(this.timeoutID);
    }
  }
}

export default function (url: string, options: RequestInit, timeoutMS = 60000): Promise<Response> {
  const timeoutHandler = new TimeoutHandler({ milliseconds: timeoutMS });
  const fetchRequest = fetch(url, options);

  return Promise.race([fetchRequest, timeoutHandler.execute])
    .then(
      (response) => {
        return response;
      },
      () => {
        throw new Error(`Fetch request timed out: Request was to url ${url} with timeout ${timeoutMS}`);
      },
    )
    .finally(() => {
      // Always clear timeout to avoid memory leaks
      timeoutHandler.clear();
    });
}
