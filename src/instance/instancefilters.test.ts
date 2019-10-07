import { assert } from "chai";
import * as InstanceFilters from "./instancefilters";
import * as PH from "../";
import { ITodoDetails } from "../todo/todointerfaces";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancefilters", function () {
      it("should check filterUserInstances Method", () => {
        const instanceDetails: PH.Instance.IInstanceDetails = {
          instanceId: PH.Tools.createId(), // Potential instanceId till execute
          processId: "xyz",
          extras: {
            roleOwners: {},
            fieldContents: {},
            todos: [
              {
                todoId: "123",
                userId: "xyz",
                workspaceId: "xyz",
                processId: "xyz",
                instanceId: "xyz",
                displayName: "test todo",
                description: "test description",
                bpmnTaskId: "xyz",
                bpmnLaneId: "xyz"
              } as ITodoDetails
            ]
          }
        } as PH.Instance.IInstanceDetails;

        let resInstDetails = InstanceFilters.filterUserInstances([ instanceDetails ], { userId: "xyz" } as any);

        assert.isTrue(resInstDetails.length === 1);
        assert.isTrue(resInstDetails.last().processId === "xyz");
        assert.isTrue(resInstDetails.last().extras.todos.length === 1);
        assert.isTrue(resInstDetails.last().extras.todos.last().displayName === "test todo");

        resInstDetails = InstanceFilters.filterUserInstances([ instanceDetails ], null);
        assert.isTrue(resInstDetails.length === 0);
      });
    });
  });
});