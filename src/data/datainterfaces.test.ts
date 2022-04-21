import { expect } from "chai";
import { ITreeViewFieldValue, TreeViewFieldValueSchema } from "./fields/treeview";

describe("sdk", function () {
  describe("data", function () {
    describe("datainterfaces", function () {
      describe("joi schema", function () {
        it("accepts TreeView FieldValues", function () {
          // Field with undefined value
          expect(TreeViewFieldValueSchema.required().validate(undefined).error).to.not.be.undefined;

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

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntry).error).to.be.undefined;

          // Test empty tree
          const treeViewEntryEmpty: ITreeViewFieldValue = {
            entries: [],
          };

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntryEmpty).error).to.be.undefined;

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

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntryNested).error, "Error when validating nested TreeViewFieldValue").to.be.undefined;
        });
      });
    });
  });
});
