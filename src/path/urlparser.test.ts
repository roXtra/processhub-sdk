import { assert } from "chai";
import { parseUrl, parseNotificationLink } from "./urlparser.js";
import { IPathDetails, Page } from "./pathinterfaces.js";
import { WorkspaceView } from "../workspace/phclient.js";
import { ProcessView } from "../process/phclient.js";

describe("sdk", function () {
  describe("path", function () {
    describe("urlparser", function () {
      describe("parseUrl", function () {
        it("should detect valid pages", function () {
          assert.isUndefined(parseUrl("/f/@testworkSpace/xx")); // Ignore case and / at end
          assert.isUndefined(parseUrl("/p/@testworkSpace/xx")); // Ignore case and / at end
          const wrongPath = parseUrl("/xx"); // Ignore case and / at end
          assert.deepEqual(wrongPath, {
            page: Page.StartPage,
          } as IPathDetails);
        });

        it("should parse top page", function () {
          let path = parseUrl("/f/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.StartPage,
          } as IPathDetails);
          path = parseUrl("/p/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.StartPage,
          } as IPathDetails);
        });

        it("should parse workspace pages", function () {
          let path = parseUrl("/f/@testworkSpace/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.Processes,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/addprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.AddProcess,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);

          // New URL with /p (>= 8.33.0)
          path = parseUrl("/p/@testworkSpace/"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.Processes,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);

          path = parseUrl("/p/@testworkSpace/addprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.WorkspacePage,
            view: WorkspaceView.AddProcess,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);
        });

        it("should parse process pages", function () {
          let path = parseUrl("/f/@testworkSpace/p/process"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process",
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/p/process/edit"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process",
          } as IPathDetails);

          path = parseUrl("/f/@testworkSpace/newprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.NewProcess,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);

          // New URL with /p (>= 8.33.0)
          path = parseUrl("/p/@testworkSpace/p/process"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process",
          } as IPathDetails);

          path = parseUrl("/p/@testworkSpace/p/process/edit"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process",
          } as IPathDetails);

          path = parseUrl("/p/@testworkSpace/newprocess"); // Ignore case and / at end
          assert.deepEqual(path, {
            page: Page.ProcessPage,
            view: ProcessView.NewProcess,
            workspaceUrlName: "testworkspace",
          } as IPathDetails);
        });

        describe("riskmanagement", function () {
          it("should parse top page", function () {
            const path = parseUrl("/r/"); // Ignore case and / at end
            assert.deepEqual(path, {
              page: Page.StartPage,
            } as IPathDetails);
          });

          it("should parse workspace pages", function () {
            const path = parseUrl("/r/@testworkSpace/"); // Ignore case and / at end
            assert.deepEqual(path, {
              page: Page.WorkspacePage,
              view: WorkspaceView.Processes,
              workspaceUrlName: "testworkspace",
            } as IPathDetails);
          });
        });
      });

      describe("parseNotificationLink", function () {
        it("should parse current instance links", function () {
          let elements = parseNotificationLink("/f/I/2/e8B278368B1002d7"); // Ignore case and / at end
          console.log(elements);
          assert.deepEqual(elements, {
            workspaceId: "2",
            instanceId: "E8B278368B1002D7",
          });

          elements = parseNotificationLink("/p/I/2/e8B278368B1002d7"); // Ignore case and / at end
          console.log(elements);
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            workspaceId: "2",
          });
        });

        it("should parse old instance/todo links", function () {
          let elements = parseNotificationLink("/f/I/@TestWorkspace/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
          });

          elements = parseNotificationLink("/p/I/@TestWorkspace/e8B278368B1002d7"); // Ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
          });
        });

        it("should parse area id", function () {
          const elements = parseNotificationLink("/p/i/6/7d419e29a9cd1432");
          assert.deepEqual(elements, {
            workspaceId: "6",
            instanceId: "7D419E29A9CD1432",
          });
        });

        describe("riskmanagement", function () {
          it("should parse risk todo links", function () {
            const elements = parseNotificationLink("/r/i/1/e8B278368B1002d7"); // Ignore case and / at end
            assert.deepEqual(elements, {
              instanceId: "E8B278368B1002D7",
              workspaceId: "1",
            });
          });
        });
      });
    });
  });
});
