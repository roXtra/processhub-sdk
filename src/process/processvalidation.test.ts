import { assert } from "chai";
import * as ProcessValidation from "./processvalidation.js";
import { IProcessDetails } from "./processinterfaces.js";
import { createId } from "../tools/guid.js";

describe("sdk", function () {
  describe("process", function () {
    describe("validation", function () {
      it("should test displayName and description of process details validation", function () {
        let obj: Partial<IProcessDetails> = { displayName: "test1234", description: "hallo test" };
        let res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "test12", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "te", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "test 1234", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(!res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "123456789012345678901234567890123456789012345678901", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "12345678901234567890123456789012345678901234567890", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = { displayName: "012345678901234567890123456789012345678901234567891", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.displayName) + " - " + String(obj.description));

        obj = {
          workspaceId: createId(),
          displayName: "Unittest process " + createId(),
          description: "Unittest process decription",
          processId: createId(),
          useModeler: false,
          extras: {},
        } as IProcessDetails;

        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.displayName) + " - " + String(obj.description));
      });

      it("should test deletionPeriod and retentionPeriod of process details validation", function () {
        let obj: Partial<IProcessDetails> = { displayName: "test", description: "test", deletionPeriod: 0, retentionPeriod: 0 };
        let res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 0, retentionPeriod: 1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 1, retentionPeriod: 0 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 1, retentionPeriod: 1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 1, retentionPeriod: 2 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 2, retentionPeriod: 1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: undefined, retentionPeriod: 1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: 1, retentionPeriod: undefined };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: undefined, retentionPeriod: undefined };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isTrue(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: undefined, retentionPeriod: -1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: -1, retentionPeriod: undefined };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));

        obj = { ...obj, deletionPeriod: -1, retentionPeriod: -1 };
        res = ProcessValidation.isProcessDetailsValid(obj as IProcessDetails);
        assert.isFalse(res, "error: " + String(obj.deletionPeriod) + " - " + String(obj.retentionPeriod));
      });
    });
  });
});
