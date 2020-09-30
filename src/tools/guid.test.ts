import { assert } from "chai";
import * as Guid from "./guid";

describe("sdk", function () {
  describe("tools", function () {
    describe("guid", function () {
      describe("createId", function () {
        it("should create valid Id", function () {
          const id = Guid.createId();
          assert(id.length === 16);
          assert(id.toUpperCase() === id);
        });
        it("should create different Ids", function () {
          const id = Guid.createId();
          assert(id !== Guid.createId());
        });
      });

      describe("nullId", function () {
        it("should create empty NullId", function () {
          assert.equal(Guid.nullId(), "0000000000000000");
        });
      });
      describe("createInstanceNumber", function () {
        it("soll gültige Nummern erzeugen", function () {
          const numStr = Guid.createInstanceNumber();
          assert.equal(numStr.length, 12);
          assert.equal(numStr.substr(3, 1), ".");
          assert.equal(numStr.substr(8, 1), ".");
        });
      });
    });
  });
});
