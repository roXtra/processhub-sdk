import { AuditTrailAction } from "./audittrailinterfaces.js";
import { expect } from "chai";

describe("sdk", function () {
  describe("audittrail", function () {
    describe("audittrailinterfaces", function () {
      it("values should be < 100 chars and contain only ascii characters", function () {
        for (const key in AuditTrailAction) {
          const value = AuditTrailAction[key as keyof typeof AuditTrailAction];
          expect(value.length).lessThanOrEqual(100);
          expect(value).to.match(/^[\x20-\x7F]*$/);
        }
      });
    });
  });
});
