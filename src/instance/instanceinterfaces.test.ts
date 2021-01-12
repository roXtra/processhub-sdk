import { expect } from "chai";
import { State, StateSchema } from ".";

describe("sdk", function () {
  describe("instance", function () {
    describe("instanceinterfaces", function () {
      describe("joi schema", function () {
        it("should validate all State options", function () {
          for (const item in State) {
            if (typeof item === "number") {
              expect(StateSchema.validate(item).error).is.undefined;
            }
          }
        });
      });
    });
  });
});
