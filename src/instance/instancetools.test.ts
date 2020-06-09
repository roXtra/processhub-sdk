import { assert } from "chai";
import { fieldContentsExcerpt } from "./instancetools";
import { createId } from "../tools/guid";
import { IInstanceDetails } from "./instanceinterfaces";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancetools", function () {

      describe("fieldContentsExcerpt", function () {
        it("soll Feldinhalte als Übersicht liefern", function () {
          const instance: IInstanceDetails = {
            instanceId: createId(),
            workspaceId: createId(),
            processId: createId(),
            title: "",
            extras: {
              instanceState: undefined,
            }
          };
          assert.equal(fieldContentsExcerpt(null, 100), "");  // Fault tolerant
          assert.equal(fieldContentsExcerpt(instance, 100), "");

          instance.extras.fieldContents = {
            "feld1": "test",
            "feld1.1": "", // Ignores empty fields
            "feld2": true, // Ignores boolean
            "feld3": "http://link", // Ignores links
            "feld4": "test2"
          };
          assert.equal(fieldContentsExcerpt(instance, 100), "test / test2");

          assert.equal(fieldContentsExcerpt(instance, 8), "test /...");
        });
      });

    });
  });
});