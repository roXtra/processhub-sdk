import * as chai from "chai";
import chaiExclude from "chai-exclude";
import fetchWithTimeout from "./fetchwithtimeout";
import { AxiosRequestConfig } from "axios";

chai.use(chaiExclude);

describe("sdk", function () {
  describe("tools", function () {
    describe("fetchWithTimeout", function () {
      it("should throw error if url is not reachable", async () => {
        const request: AxiosRequestConfig = {};
        return fetchWithTimeout("https://localhost/this/url/is/not/reachable", request)
          .then((onFulfilled) => {
            throw new Error("This must not happen!");
          })
          .catch(() => {
            return Promise.resolve();
          });
      });

      it("should throw error if timeout occurred", async () => {
        const request: AxiosRequestConfig = {};
        // Connect to unreachable url - example.com is defined to be unreachable
        return fetchWithTimeout("http://example.com:81", request, 2000)
          .then((onFulfilled) => {
            throw new Error("This must not happen!");
          })
          .catch((err: Error) => {
            chai.expect(err.message).eq("Fetch request timed out: Request was to url http://example.com:81 with timeout 2000", "Request did not timeout correctly!");
          });
      });

      it("should resolve if url is reachable", async () => {
        const request: AxiosRequestConfig = {};
        return fetchWithTimeout("https://www.roxtra.com", request)
          .then((onFulfilled) => {
            return Promise.resolve();
          })
          .catch((err: Error) => {
            throw new Error("This must not happen! " + err.message);
          });
      });
    });
  });
});
