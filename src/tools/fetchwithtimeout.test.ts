import { assert } from "chai";
import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import fetchWithTimeout from "./fetchwithtimeout.js";

describe("sdk", function () {
  describe("tools", function () {
    describe("fetchWithTimeout", function () {
      const server = createServer((request, response) => {
        if (request.url === "/timeout") {
          return;
        }
        if (request.url === "/unreachable") {
          request.socket.destroy();
          return;
        }
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: true }));
      });
      let baseUrl: string;

      before((done) => {
        server.listen(0, "127.0.0.1", () => {
          baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
          done();
        });
      });

      after((done) => {
        server.closeAllConnections();
        server.close(done);
      });

      it("should propagate connection errors", async () => {
        await fetchWithTimeout(`${baseUrl}/unreachable`, { proxy: false }).then(
          () => assert.fail("The disconnected request must fail"),
          (error: Error & { code: string }) => assert.equal(error.code, "ECONNRESET"),
        );
      });

      it("should throw error if timeout occurred", async () => {
        const url = `${baseUrl}/timeout`;
        await fetchWithTimeout(url, { proxy: false }, 50).then(
          () => assert.fail("The delayed request must time out"),
          (error: Error) => assert.equal(error.message, `Request timed out: Request was to url ${url} with timeout 50`),
        );
      });

      it("should resolve if url is reachable", async () => {
        const response = await fetchWithTimeout(`${baseUrl}/success`, { proxy: false });
        assert.equal(response.status, 200);
        assert.deepEqual(response.data, { success: true });
      });
    });
  });
});
