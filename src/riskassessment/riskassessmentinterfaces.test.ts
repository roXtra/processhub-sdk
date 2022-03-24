import { expect } from "chai";
import { RiskAssessmentCycle, RiskAssessmentCycleSchema } from "./riskassessmentinterfaces.js";

describe("sdk", function () {
  describe("riskassessment", function () {
    describe("riskassessmentinterfaces", function () {
      describe("joi schema", function () {
        it("should validate all RiskAssessmentCycle options", function () {
          for (const item in RiskAssessmentCycle) {
            if (typeof item === "number") {
              expect(RiskAssessmentCycleSchema.validate(item).error).is.undefined;
            }
          }
        });
      });
    });
  });
});
