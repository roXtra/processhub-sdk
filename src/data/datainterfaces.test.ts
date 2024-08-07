import { expect } from "chai";
import { ITreeViewFieldValue, TreeViewFieldValueSchema } from "./fields/treeview.js";

describe("sdk", function () {
  describe("data", function () {
    describe("datainterfaces", function () {
      describe("joi schema", function () {
        it("accepts TreeView FieldValues", function () {
          // Field with undefined value
          expect(TreeViewFieldValueSchema.required().validate(undefined).error).not.to.equal(undefined);

          const treeViewEntry: ITreeViewFieldValue = {
            entries: [
              {
                id: "123",
                name: "Test",
                checked: false,
                subItems: [],
              },
            ],
          };

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntry).error).to.equal(undefined);

          // Test empty tree
          const treeViewEntryEmpty: ITreeViewFieldValue = {
            entries: [],
          };

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntryEmpty).error).to.equal(undefined);

          // Test nested tree
          const treeViewEntryNested: ITreeViewFieldValue = {
            entries: [
              {
                id: "123",
                name: "Test",
                checked: false,
                subItems: [
                  {
                    id: "456",
                    name: "Test2",
                    checked: true,
                    subItems: [],
                  },
                ],
              },
            ],
          };

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntryNested).error, "Error when validating nested TreeViewFieldValue").to.equal(undefined);
        });
      });
    });
  });
});
