import { assert } from "chai";
import { getModuleForRequestPath } from "./modules";
import { ModuleId } from "./imodule";

describe("sdk", function () {
  describe("modules", function () {
    describe("getModuleForRequestPath", function () {

      it("should return the correct module", () => {
        assert.isTrue(getModuleForRequestPath("/").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/@3089").moduleId === ModuleId.EForm);
        assert.isTrue(getModuleForRequestPath("/riskmanagement").moduleId === ModuleId.RiskManagement);
        assert.isTrue(getModuleForRequestPath("/riskmanagement/@3081").moduleId === ModuleId.RiskManagement);
      });

      it("should return the correct module for views", () => {
        assert.isTrue(getModuleForRequestPath("/view/executebuttonview").moduleId === ModuleId.EForm);
      });

    });
  });
});