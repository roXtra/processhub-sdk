import { assert } from "chai";
import { getModuleForRequestPath } from "./modules";
import { ModuleId } from "./imodule";

describe("sdk", function () {
  describe("modules", function () {
    describe("getModuleForRequestPath", function () {
      it("should return the correct module", () => {
        assert.isTrue(getModuleForRequestPath("/").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/@3089").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/f").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/f/@3089").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p/@3089").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/r").moduleId === ModuleId.Risks);
        assert.isTrue(getModuleForRequestPath("/r/@3081").moduleId === ModuleId.Risks);
      });

      it("should return the correct module for views", () => {
        // Old URL without /f (<= 8.23.0)
        assert.isTrue(getModuleForRequestPath("/view/executebuttonview").moduleId === ModuleId.Processes);
        // New URL with /f (>= 8.24.0)
        assert.isTrue(getModuleForRequestPath("/f/view/executebuttonview").moduleId === ModuleId.Processes);
        // New URL with /p (>= 8.33.0)
        assert.isTrue(getModuleForRequestPath("/p/view/executebuttonview").moduleId === ModuleId.Processes);
      });

      it("should return the correct module for instance links", () => {
        assert.isTrue(getModuleForRequestPath("/r/i/1/ad903e5743a23a6e").moduleId === ModuleId.Risks);
        assert.isTrue(getModuleForRequestPath("/f/i/1/ad903e5743a23a6e").moduleId === ModuleId.Processes);
        assert.isTrue(getModuleForRequestPath("/p/i/1/ad903e5743a23a6e").moduleId === ModuleId.Processes);
      });
    });
  });
});
