import { expect } from "chai";
import { BpmnError, ErrorCode, isBpmnError } from "./bpmnerror.js";

describe("sdk", function () {
  describe("instance", function () {
    describe("bpmnerror", function () {
      describe("isBpmnError", function () {
        it("should check isBpmnError", function () {
          const error1 = new BpmnError(ErrorCode.ConfigInvalid, "Config is invalid");
          expect(isBpmnError(error1)).to.equal(true);

          const innerError = new Error("ERROR!");
          const error2 = new BpmnError(ErrorCode.UnknownError, "An unknown error occured", innerError);
          expect(isBpmnError(error2)).to.equal(true);

          const error3 = new BpmnError("CUSTOM_ERROR", "error message", innerError);
          expect(isBpmnError(error3)).to.equal(true);
        });
      });
    });
  });
});
