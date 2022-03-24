import { assert } from "chai";
import { getModuleForRequestPath } from "./modules.js";
import { ModuleId } from "./imodule.js";

describe("sdk", function () {
  describe("modules", function () {
    describe("getModuleForRequestPath", function () {
      it("should return the correct module", () => {
        assert.isTrue(getModuleForRequestPath("/").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/@3089").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/f").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/f/@3089").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p/@3089").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/r").id === ModuleId.Risks);
        assert.isTrue(getModuleForRequestPath("/r/@3081").id === ModuleId.Risks);
      });

      it("should return the correct module for views", () => {
        // Old URL without /f (<= 8.23.0)
        assert.isTrue(getModuleForRequestPath("/view/executebuttonview").id === ModuleId.Processes);
        // New URL with /f (>= 8.24.0)
        assert.isTrue(getModuleForRequestPath("/f/view/executebuttonview").id === ModuleId.Processes);
        // New URL with /p (>= 8.33.0)
        assert.isTrue(getModuleForRequestPath("/p/view/executebuttonview").id === ModuleId.Processes);
      });

      it("should return the correct module for instance links", () => {
        assert.isTrue(getModuleForRequestPath("/r/i/1/ad903e5743a23a6e").id === ModuleId.Risks);
        assert.isTrue(getModuleForRequestPath("/f/i/1/ad903e5743a23a6e").id === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p/i/1/ad903e5743a23a6e").id === ModuleId.Processes);
      });
    });
  });
});
