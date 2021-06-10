import { expect } from "chai";
import { FieldTypeOptions, isFieldValue, ITreeViewFieldValue, TreeViewFieldValueSchema } from "./datainterfaces";

describe("sdk", function () {
  describe("data", function () {
    describe("datainterfaces", function () {
      describe("joi schema", function () {
        it("should accept fields with basic types", function () {
          // Field with undefined value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: undefined })).to.be.true;

          // Field with null value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: null })).to.be.true;

          // Field with string value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: "" })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: "value" })).to.be.true;

          // Field with string array value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: [] })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: ["one"] })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: ["one", "two"] })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: ["one", "two", ""] })).to.be.true;

          // Field with number value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: -42 })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: 0 })).to.be.true;
          expect(isFieldValue({ type: FieldTypeOptions[0], value: 42 })).to.be.true;

          // Field with date value
          expect(isFieldValue({ type: FieldTypeOptions[0], value: new Date() })).to.be.true;
        });

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

          const treeViewEntryEmpty: ITreeViewFieldValue = {
            entries: [],
          };

          expect(TreeViewFieldValueSchema.required().validate(treeViewEntryEmpty).error).to.be.undefined;
        });
      });
    });
  });
});
