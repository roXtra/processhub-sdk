import { assert } from "chai";
import { isValidWorkspaceView } from "./phclient.js";

describe("sdk", function () {
  describe("workspace", function () {
    describe("phclient", function () {
      describe("isValidWorkspaceView", function () {
        it("should detect valid workspace views", function () {
          assert.isTrue(isValidWorkspaceView("addprocess"));
          assert.isTrue(isValidWorkspaceView("addProCess")); // Case insensitive

          assert.isFalse(isValidWorkspaceView("invalid"));
        });
      });
    });
  });
});
