import { expect } from "chai";
import axios, { AxiosAdapter } from "axios";
import { ApiResult, API_FAILED, IBaseError } from "./apiinterfaces.js";
import { getJson, postJson } from "./apirequests.js";
import { IErrorHandler, registerErrorHandler, removeErrorHandler } from "./errorhandler.js";

describe("legacy API HTTP error responses", () => {
  const path = "/api/process/linkreportdraft";
  const message = "The document is archived. (Document ID: 123)";
  let originalAdapter: typeof axios.defaults.adapter;
  let calls: { error: IBaseError; path: string; showErrorModal?: boolean }[];
  let handler: IErrorHandler;

  beforeEach(() => {
    originalAdapter = axios.defaults.adapter;
    calls = [];
    handler = { handleError: (error, requestPath, showErrorModal) => calls.push({ error, path: requestPath, showErrorModal }) };
    registerErrorHandler(handler);
  });

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    removeErrorHandler(handler);
  });

  function respond(status: number, data: unknown): void {
    const adapter: AxiosAdapter = (config) => Promise.resolve({ status, statusText: "", data, headers: {}, config });
    axios.defaults.adapter = adapter;
  }

  for (const [method, request] of [
    ["GET", getJson],
    ["POST", postJson],
  ] as const) {
    describe(method, () => {
      for (const status of [ApiResult.API_INVALID, ApiResult.API_NOTFOUND, ApiResult.API_ERROR]) {
        it(`preserves document error details for HTTP ${status}`, async () => {
          respond(status, { type: API_FAILED, result: status, errorMessage: message, errorCode: "REPORT_TEMPLATE_NOT_RELEASED" });
          const result = await request(path, { moduleId: 1 }, { accessToken: "test-token", showErrorModal: false });
          expect(result).to.deep.equal({ type: API_FAILED, result: status, errorMessage: message, errorCode: "REPORT_TEMPLATE_NOT_RELEASED" });
          expect(calls).to.deep.equal([{ error: result, path, showErrorModal: false }]);
        });
      }

      for (const [name, body] of [
        ["null", null],
        ["HTML", "<html>Proxy failure</html>"],
        ["array", []],
        ["missing fields", {}],
        ["invalid field types", { errorMessage: { text: message }, errorCode: 123 }],
      ] as const) {
        it(`keeps the existing fallback for ${name}`, async () => {
          respond(ApiResult.API_INVALID, body);
          const result = await request(path, { moduleId: 1 }, { accessToken: "test-token", showErrorModal: true });
          expect(result).to.deep.equal({ type: API_FAILED, result: ApiResult.API_INVALID });
          expect(calls).to.deep.equal([{ error: result, path, showErrorModal: true }]);
        });
      }

      it("uses the HTTP status and failure type instead of untrusted body fields", async () => {
        respond(ApiResult.API_FORBIDDEN, { type: "OK", result: ApiResult.API_OK, errorMessage: message, errorCode: "FORBIDDEN", extra: "ignored" });
        const result = await request(path, { moduleId: 1 }, { accessToken: "test-token" });
        expect(result).to.deep.equal({ type: API_FAILED, result: ApiResult.API_FORBIDDEN, errorMessage: message, errorCode: "FORBIDDEN" });
        expect(calls).to.have.length(1);
      });

      it("returns successful response data without invoking an error handler", async () => {
        const data = { type: "OK", result: ApiResult.API_OK, document: { roxFileId: 123 } };
        respond(ApiResult.API_OK, data);
        expect(await request(path, { moduleId: 1 }, { accessToken: "test-token" })).to.equal(data);
        expect(calls).to.have.length(0);
      });
    });
  }
});
