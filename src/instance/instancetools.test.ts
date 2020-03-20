import { assert } from "chai";
import { fieldContentsExcerpt, parseInstanceMailAddress, getInstanceMailAddress, getInstanceTitle } from "./instancetools";
import { createId } from "../tools/guid";
import { IInstanceDetails } from "./instanceinterfaces";
import { IProcessDetails } from "../process";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancetools", function () {

      describe("fieldContentsExcerpt", function () {
        it("soll Feldinhalte als Übersicht liefern", function () {
          const instance: IInstanceDetails = {
            instanceId: createId(),
            workspaceId: createId(),
            processId: createId(),
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

      describe("getInstanceTitle", function () {
        const instance: IInstanceDetails = {
          instanceId: createId(),
          processId: createId(),
          workspaceId: createId(),
          extras: {
            instanceState: undefined,
            fieldContents: {
              Titel: {
                type: "ProcessHubTextInput",
                value: ""
              }
            }
          }
        };

        const process: IProcessDetails = {
          processId: instance.processId,
          workspaceId: instance.workspaceId,
          displayName: "Test",
          description: "",
          extras: {
            settings: {
              dashboard: {
                cardTitle: "{{ field.Titel }}"
              }
            }
          }
        };

        it("should use Titel field", function () {
          instance.extras.fieldContents["Titel"] = {
            type: "ProcessHubTextInput",
            value: "A"
          };
          const res = getInstanceTitle(instance, process);
          assert.equal(res, "A");
        });

        it("should return instanceId if title field is not set", function () {
          instance.extras.fieldContents["Titel"] = {
            type: "ProcessHubTextInput",
            value: ""
          };
          const res = getInstanceTitle(instance, process);
          assert.isTrue(res.includes(instance.instanceId.toLocaleLowerCase()));
        });

      });
    });
  });
});