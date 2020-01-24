import { assert } from "chai";
import * as ProcessValidation from "./processvalidation";
import { IProcessDetails } from "./processinterfaces";
import { createId } from "../tools/guid";

describe("sdk", function () {
  describe("process", function () {
    describe("validation", function () {

      it("soll Process-Details Validierung testen", function () {
        let obj = { displayName: "test1234", description: "hallo test" };
        let res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test12", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "te", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test 1234", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(!res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "123456789012345678901234567890123456789012345678901", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "12345678901234567890123456789012345678901234567890", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "012345678901234567890123456789012345678901234567891", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + obj.displayName + " - " + obj.description);

        obj = {
          workspaceId: createId(),
          displayName: "Unittest process " + createId(),
          description: "Unittest process decription",
          processId: createId(),
          useModeler: false,
          extras: {}
        } as IProcessDetails;

        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);
      });
    });
  });
});