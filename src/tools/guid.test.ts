import { assert } from "chai";
import * as Guid from "./guid.js";

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

      describe("isUserId", function () {
        it("should validate system user id", function () {
          assert.isTrue(Guid.isUserId("-1"));
        });

        it("should deny invalid user id", function () {
          assert.isFalse(Guid.isUserId("-100"));
          assert.isFalse(Guid.isUserId("abc"));
          assert.isFalse(Guid.isUserId("123abc"));
          assert.isFalse(Guid.isUserId(""));
          assert.isFalse(Guid.isUserId("G_567"));
        });

        it("should validate user id", function () {
          assert.isTrue(Guid.isUserId("1"));
          assert.isTrue(Guid.isUserId("2"));
          assert.isTrue(Guid.isUserId("3"));
          assert.isTrue(Guid.isUserId("100"));
          assert.isTrue(Guid.isUserId("5678"));
        });
      });
    });
  });
});
