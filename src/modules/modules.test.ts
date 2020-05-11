import { assert } from "chai";
import { getModuleForRequestPath } from "./modules";
import { ModuleId } from "./imodule";

describe("sdk", function () {
  describe("modules", function () {
    describe("getModuleForRequestPath", function () {

      it("should return the correct module", () => {
        assert.isTrue(getModuleForRequestPath("/").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/@3089").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/f").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/f/@3089").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/r").moduleId === ModuleId.RiskManagement);
        assert.isTrue(getModuleForRequestPath("/r/@3081").moduleId === ModuleId.RiskManagement);
      });

      it("should return the correct module for views", () => {
        // Old URL without /f (<= 8.23.0)
        assert.isTrue(getModuleForRequestPath("/view/executebuttonview").moduleId === ModuleId.EForm);
        // New URL with /f (>= 8.24.0)
        assert.isTrue(getModuleForRequestPath("/f/view/executebuttonview").moduleId === ModuleId.EForm);
      });

    });
  });
});