import { assert } from "chai";
import { parseUrl, parseNotificationLink } from "./urlparser";
import { PathDetails, Page } from "./pathinterfaces";
import { WorkspaceView } from "../workspace/phclient";
import { ProcessView } from "../process/phclient";

describe("sdk", function () {
  describe("path", function () {
    describe("urlparser", function () {

      describe("parseUrl", function () {

        it("should detect valid pages", function () {
          assert.isNull(parseUrl("/@testworkSpace/xx")); // Ignore case and / at end
          assert.isNull(parseUrl("/xx")); // Ignore case and / at end
        });

        it("should parse top page", function () {
          const path = parseUrl("/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.StartPage
          } as PathDetails);
        });

        it("should parse workspace pages", function () {
          let path = parseUrl("/@testworkSpace/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.Processes,
            workspaceUrlName: "testworkspace"
          } as PathDetails);

          path = parseUrl("/@testworkSpace/members"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.Members,
            workspaceUrlName: "testworkspace"
          } as PathDetails);

          path = parseUrl("/@testworkSpace/addprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.AddProcess,
            workspaceUrlName: "testworkspace"
          } as PathDetails);
        });

        it("should parse process pages", function () {
          let path = parseUrl("/@testworkSpace/p/process"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          } as PathDetails);

          path = parseUrl("/@testworkSpace/p/process/edit"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          } as PathDetails);

          path = parseUrl("/@testworkSpace/newprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.NewProcess,
            workspaceUrlName: "testworkspace"
          } as PathDetails);
        });

      });

      describe("parseNotificationLink", function () {

        it("should parse invalid instance links", function () {
          const elements = parseNotificationLink("/i/invalidid"); // Ignore case and / at end
          assert.deepEqual(elements, {});
        });

        it("should parse current instance links", function () {
          const elements = parseNotificationLink("/I/ffB278368B1002d7/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            workspaceId: "FFB278368B1002D7"
          });
        });

        it("should parse old instance/todo links", function () {
          const elements = parseNotificationLink("/I/@TestWorkspace/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });
        });
      });
    });
  });
});