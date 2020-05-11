import { assert } from "chai";
import { parseUrl, parseNotificationLink } from "./urlparser";
import { IPathDetails, Page } from "./pathinterfaces";
import { WorkspaceView } from "../workspace/phclient";
import { ProcessView } from "../process/phclient";

describe("sdk", function () {
  describe("path", function () {
    describe("urlparser", function () {

      describe("parseUrl", function () {

        it("should detect valid pages", function () {
          assert.isNull(parseUrl("/f/@testworkSpace/xx")); // Ignore case and / at end
          const wrongPath =parseUrl("/xx"); // Ignore case and / at end
          assert.deepEqual(wrongPath, {
            page: Page.StartPage
          } as IPathDetails);
        });

        it("should parse top page", function () {
          const path = parseUrl("/f/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.StartPage
          } as IPathDetails);
        });

        it("should parse workspace pages", function () {
          let path = parseUrl("/f/@testworkSpace/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.Processes,
            workspaceUrlName: "testworkspace"
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/addprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.AddProcess,
            workspaceUrlName: "testworkspace"
          } as IPathDetails);
        });

        it("should parse process pages", function () {
          let path = parseUrl("/f/@testworkSpace/p/process"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/p/process/edit"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/newprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.NewProcess,
            workspaceUrlName: "testworkspace"
          } as IPathDetails);
        });

        describe("riskmanagement", function () {
          it("should parse top page", function () {
            const path = parseUrl("/r/"); // Ignore case and / at end
            assert.deepEqual(path, {
              page: Page.StartPage
            } as IPathDetails);
          });

          it("should parse workspace pages", function () {
            const path = parseUrl("/r/@testworkSpace/"); // Ignore case and / at end
            assert.deepEqual(path, {
              page: Page.WorkspacePage,
              view: WorkspaceView.Processes,
              workspaceUrlName: "testworkspace"
            } as IPathDetails);
          });
        });

      });

      describe("parseNotificationLink", function () {

        it("should parse invalid instance links", function () {
          const elements = parseNotificationLink("/f/i/invalidid"); // Ignore case and / at end
          assert.deepEqual(elements, {});
        });

        it("should parse current instance links", function () {
          const elements = parseNotificationLink("/f/I/ffB278368B1002d7/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            workspaceId: "FFB278368B1002D7"
          });
        });

        it("should parse old instance/todo links", function () {
          const elements = parseNotificationLink("/f/I/@TestWorkspace/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });
        });

        describe("riskmanagement", function () {
          it("should parse risk todo links", function () {
            const elements = parseNotificationLink("/r/i/TestWorkspace/e8B278368B1002d7"); // Ignore case and / at end
            assert.deepEqual(elements, {
              instanceId: "E8B278368B1002D7"
            });
          });
        });
      });
    });
  });
});