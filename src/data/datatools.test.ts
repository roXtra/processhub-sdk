import { assert } from "chai";
import * as DataTools from "./datatools";
import { FieldContentMap } from "../data/datainterfaces";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { LoadTemplateReply } from "../process/legacyapi";
import { createBpmnTemplate } from "../process/bpmn/bpmnmoddlehelper";
import { RoleOwnerMap } from "../process/processrights";

describe("sdk", function () {
  describe("data", function () {
    describe("datatools", function () {

      describe("parseAndInsertStringWithFieldContent", function () {
        it("should replace field values", function () {

          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as FieldContentMap, null, null);

          assert.equal(res, resultString);
        });

        it("should replace field values with {field['name']} notation", function () {

          const testString = "Hallo {field['existiert']}, wie gehts {field['existiertnicht']}\n{trölölö} {{{moepmoep}}}\nfield['existiertnicht2']\n";
          const resultString = "Hallo {Teststring eingesetzt!}, wie gehts {}\n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as FieldContentMap, null, null);
          console.log(res);
          assert.equal(res, resultString);
        });

        it("should accept empty field maps", function () {

          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, null, null, null);

          assert.equal(res, testString);
        });

        it("should replace long field old names with short values", function () {

          const testString = "{{ field.fieldname1 }}{{ field.fieldname2 }}{{ field.fieldname3 }}";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { fieldname1: "1", fieldname2: "2", fieldname3: "3", } as FieldContentMap, null, null);

          assert.equal(res, resultString);
        });

        it("should replace long field names with short values", function () {

          const testString = "field['fieldname1']field['fieldname2']field['fieldname3']";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { fieldname1: "1", fieldname2: "2", fieldname3: "3", } as FieldContentMap, null, null);

          assert.equal(res, resultString);
        });

        it("should replace field and role", async function () {

          const testString = "{{ field.Anlagen }}{{ role.Bearbeiter }}";
          const resultString = "1Administrator, Admin";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: LoadTemplateReply = await createBpmnTemplate();

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);

          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { Anlagen: "1" } as FieldContentMap, bpmnProcess, { [bpmnProcess.getLanes(false).find(l => l.name === "Bearbeiter").id]: [{ memberId: "1", displayName: "Administrator, Admin" }] } as RoleOwnerMap);

          assert.equal(res, resultString);
        });
      });

    });
  });
});