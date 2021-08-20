import { assert } from "chai";
import * as InstanceFilters from "./instancefilters";
import { ITodoDetails } from "../todo/todointerfaces";
import { IUserDetails } from "../user";
import { createId } from "../tools/guid";
import { getLastArrayEntry } from "../tools/array";
import { IInstanceDetails } from "./instanceinterfaces";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancefilters", function () {
      it("should check filterUserInstances Method", () => {
        const instanceDetails: IInstanceDetails = {
          instanceId: createId(), // Potential instanceId till execute
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
                bpmnLaneId: "xyz",
              } as ITodoDetails,
            ],
          },
        } as IInstanceDetails;

        let resInstDetails = InstanceFilters.filterUserInstances([instanceDetails], { userId: "xyz" } as IUserDetails);

        assert.isTrue(resInstDetails.length === 1);
        assert.isTrue(getLastArrayEntry(resInstDetails)?.processId === "xyz");
        assert.isTrue(getLastArrayEntry(resInstDetails)?.extras.todos?.length === 1);
        assert.isTrue(getLastArrayEntry(getLastArrayEntry(resInstDetails)?.extras.todos)?.displayName === "test todo");

        resInstDetails = InstanceFilters.filterUserInstances([instanceDetails], undefined);
        assert.isTrue(resInstDetails.length === 0);
      });
    });
  });
});
