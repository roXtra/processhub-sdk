import { assert } from "chai";
import { UserState } from "./phclient";
import { ApiResult } from "../legacyapi/apiinterfaces";
import { userReducer } from "./userreducer";

describe("sdk", function () {
  describe("user", function () {

    describe("userReducer", function () {

      it("soll unbekannte Actions korrekt reducen", function () {
        const oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        const newState = userReducer(oldState, {
          type: "UNKNOWN"
        });
        assert.deepEqual(newState, oldState);
      });


    });
  });
});