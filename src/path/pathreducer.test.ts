import { assert } from "chai";
import { PathState } from "./phclient";
import { IPathLoadedMessage, PATHLOADED_MESSAGE } from "./legacyapi";
import { parseUrl } from "./urlparser";
import { pathReducer } from "./pathreducer";
import { Page } from "./pathinterfaces";
import { WorkspaceView } from "../workspace/phclient";
import { ApiResult } from "../legacyapi/apiinterfaces";

describe("sdk", function () {
  describe("path", function () {

    describe("pathReducer", function () {

      it("soll PATHLOADED_MESSAGE korrekt reducen", function () {
        const oldState: PathState = new PathState();

        const message: IPathLoadedMessage = {
          type: PATHLOADED_MESSAGE,
          pathDetails: parseUrl("/@testworkspace/processes")
        };

        const newState = pathReducer(oldState, message);

        assert.deepEqual(newState.currentPath.page, Page.WorkspacePage);
        assert.deepEqual(newState.currentPath.view, WorkspaceView.Processes);

      });

      it("soll PATHLOADED_MESSAGE mit Fehlermeldung korrekt reducen", function () {
        const oldState: PathState = new PathState();

        const message: IPathLoadedMessage = {
          type: PATHLOADED_MESSAGE,
          pathDetails: parseUrl("/@invalid"),
          error: ApiResult.API_NOTFOUND
        };

        const newState = pathReducer(oldState, message);

        // Deepequal nicht sínnvoll, da nur Server erkennen kann, ob Workspace gefunden wurde
        assert.equal(newState.lastApiResult, ApiResult.API_NOTFOUND);
      });

      it("soll unbekannte Actions korrekt reducen", function () {
        const oldState: PathState = { currentPath: { page: Page.WorkspacePage } };
        const newState = pathReducer(oldState, {
          type: "UNKNOWN"
        });
        assert.deepEqual(newState, oldState);
      });

    });

  });
});
