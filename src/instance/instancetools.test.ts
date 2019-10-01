import { assert } from "chai";
import { fieldContentsExcerpt, parseInstanceMailAddress, getInstanceMailAddress } from "./instancetools";
import { createId } from "../tools/guid";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancetools", function () {

      describe("fieldContentsExcerpt", function () {
        it("soll Feldinhalte als Übersicht liefern", function () {
          const instance: any = {
            extras: {}
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

      describe("parseInstanceMailAddress", function () {
        it("should return 0 if not an instance mail address", function () {
          assert.equal(parseInstanceMailAddress("test@mail.processhub.com"), null);
        });

        it("should parse instanceId from mail address", function () {
          const id = createId();
          assert.equal(parseInstanceMailAddress(getInstanceMailAddress(id).toUpperCase()), id); // Ignore case

          // null on invalid ids
          assert.equal(parseInstanceMailAddress(getInstanceMailAddress(id + "0").toUpperCase()), null);
        });
      });
    });
  });
});