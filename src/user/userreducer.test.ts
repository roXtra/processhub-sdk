import { assert } from "chai";
import { UserState } from "./phclient";
import { ApiResult } from "../legacyapi/apiinterfaces";
import { createUserId } from "../tools/guid";
import { userReducer } from "./userreducer";
import { UserActionLoggedIn, UserActionFailed } from "./useractions";
import { UserActionsType } from "./userinterfaces";

describe("sdk", function () {
  describe("user", function () {

    describe("userReducer", function () {

      it("soll USERACTION_LOGIN korrekt reducen", function () {
        const oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        const user = { userId: createUserId() };
        const newState = userReducer(oldState, {
          type: UserActionsType.LoggedIn,
          userDetails: user
        } as UserActionLoggedIn);
        assert.deepEqual<any>(newState, { currentUser: user, lastApiResult: ApiResult.API_OK });
      });

      it("soll USERACTION_FAILED korrekt reducen", function () {
        const oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        const newState = userReducer(oldState, {
          type: UserActionsType.Failed,
          result: ApiResult.API_DENIED
        } as UserActionFailed);
        assert.deepEqual<any>(newState, { lastApiResult: ApiResult.API_DENIED });
      });

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