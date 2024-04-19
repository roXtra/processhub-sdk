import { expect } from "chai";
import { compareRoXtraVersions } from "./version.js";

describe("tools", function () {
  describe("version", function () {
    describe("compareRoXtraVersions", function () {
      it("a < b", function () {
        expect(compareRoXtraVersions("7.0.0", "8.0.0")).to.be.lessThan(0);
        expect(compareRoXtraVersions("8.006.0", "8.007.0")).to.be.lessThan(0);
        expect(compareRoXtraVersions("8.006.0", "8.006.1")).to.be.lessThan(0);
      });

      it("a > b", function () {
        expect(compareRoXtraVersions("8.0.0", "7.0.0")).to.be.greaterThan(0);
        expect(compareRoXtraVersions("8.007.0", "8.006.0")).to.be.greaterThan(0);
        expect(compareRoXtraVersions("8.006.1", "8.006.0")).to.be.greaterThan(0);
      });

      it("a === b", function () {
        expect(compareRoXtraVersions("8.006.0", "8.006.0")).to.equal(0);
      });
    });
  });
});
