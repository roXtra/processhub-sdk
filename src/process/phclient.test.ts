import { assert } from "chai";
import { isValidProcessView } from "./phclient.js";

describe("sdk", function () {
  describe("process", function () {
    describe("phclient", function () {
      describe("isValidProcessView", function () {
        it("should detect valid process views", function () {
          assert.isTrue(isValidProcessView("edit"));
          assert.isTrue(isValidProcessView("eDit")); // Case insensitive

          assert.isFalse(isValidProcessView("invalid"));
        });
      });
    });
  });
});
