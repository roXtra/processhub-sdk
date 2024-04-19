import { assert } from "chai";
import { Processes, Risks, getModuleForRequestPath } from "./modules.js";

describe("sdk", function () {
  describe("modules", function () {
    describe("getModuleForRequestPath", function () {
      it("should return the correct module", () => {
        assert.isTrue(getModuleForRequestPath("/").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/@3089").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/f").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/p").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/f/@3089").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/p/@3089").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/r").id === Risks.id);
        assert.isTrue(getModuleForRequestPath("/r/@3081").id === Risks.id);
      });

      it("should return the correct module for views", () => {
        // Old URL without /f (<= 8.23.0)
        assert.isTrue(getModuleForRequestPath("/view/executebuttonview").id === Processes.id);
        // New URL with /f (>= 8.24.0)
        assert.isTrue(getModuleForRequestPath("/f/view/executebuttonview").id === Processes.id);
        // New URL with /p (>= 8.33.0)
        assert.isTrue(getModuleForRequestPath("/p/view/executebuttonview").id === Processes.id);
      });

      it("should return the correct module for instance links", () => {
        assert.isTrue(getModuleForRequestPath("/r/i/1/ad903e5743a23a6e").id === Risks.id);
        assert.isTrue(getModuleForRequestPath("/f/i/1/ad903e5743a23a6e").id === Processes.id);
        assert.isTrue(getModuleForRequestPath("/p/i/1/ad903e5743a23a6e").id === Processes.id);
      });
    });
  });
});
