/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assert } from "chai";
import * as DataTools from "./datatools";
import { IFieldContentMap } from "../data/datainterfaces";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { ILoadTemplateReply } from "../process/legacyapi";
import { createBpmnTemplate } from "../process/bpmn/bpmnmoddlehelper";
import { IRoleOwnerMap } from "../process/processrights";
import { IProcessRoles, getProcessRoles } from "../process";

describe("sdk", function () {
  describe("data", function () {
    describe("datatools", function () {
      describe("parseAndInsertStringWithFieldContent", function () {
        it("should replace field values", function () {
          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as IFieldContentMap, {}, {});

          assert.equal(res, resultString);
        });

        it("should replace field values with {field['name']} notation", function () {
          const testString = "Hallo {field['existiert']}, wie gehts {field['existiertnicht']}\n{trölölö} {{{moepmoep}}}\nfield['existiertnicht2']\n";
          const resultString = "Hallo {Teststring eingesetzt!}, wie gehts {}\n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as IFieldContentMap, {}, {});
          console.log(res);
          assert.equal(res, resultString);
        });

        it("should accept empty field maps", function () {
          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, undefined, {}, {});

          assert.equal(res, testString);
        });

        it("should replace long field old names with short values", function () {
          const testString = "{{ field.fieldname1 }}{{ field.fieldname2 }}{{ field.fieldname3 }}";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { fieldname1: "1", fieldname2: "2", fieldname3: "3" } as IFieldContentMap, {}, {});

          assert.equal(res, resultString);
        });

        it("should replace long field names with short values", function () {
          const testString = "field['fieldname1']field['fieldname2']field['fieldname3']";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { fieldname1: "1", fieldname2: "2", fieldname3: "3" } as IFieldContentMap, {}, {});

          assert.equal(res, resultString);
        });

        it("should replace field and role", async function () {
          const testString = "{{ field.Anlagen }}{{ role.Bearbeiter }}";
          const resultString = "1Administrator, Admin";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);

          const processRoles: IProcessRoles = getProcessRoles(undefined, bpmnProcess, "1");
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { Anlagen: "1" } as IFieldContentMap, processRoles, {
            [bpmnProcess.getLanes(false).find((l) => l.name === "Bearbeiter")!.id]: [{ memberId: "1", displayName: "Administrator, Admin" }],
          } as IRoleOwnerMap);

          assert.equal(res, resultString);
        });

        it("should replace undefined date with empty string", async function () {
          const testString = "{{ field.Date }}{{ field.DateTime }}";
          const resultString = "";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);
          const processRoles: IProcessRoles = getProcessRoles(undefined, bpmnProcess, "1");

          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              Date: {
                value: undefined,
                type: "ProcessHubDate",
              },
              DateTime: {
                value: undefined,
                type: "ProcessHubDateTime",
              },
            },
            processRoles,
            {},
          );

          assert.equal(res, resultString);
        });

        it("should replace date", async function () {
          const testString = "{{ field.Date }}";
          const resultString = "25.10.2019";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);
          const processRoles: IProcessRoles = getProcessRoles(undefined, bpmnProcess, "1");

          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              Date: {
                value: new Date(2019, 9, 25, 12, 0, 0),
                type: "ProcessHubDate",
              },
            },
            processRoles,
            {},
          );

          assert.equal(res, resultString);
        });

        it("should replace missing roles with empty string", async function () {
          const testString = "{{ role.Date }}/{{ role.DateTime }}";
          const resultString = "/";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate();

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);
          const processRoles: IProcessRoles = getProcessRoles(undefined, bpmnProcess, "1");

          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              Date: {
                value: new Date(2019, 10, 25, 12, 0, 0),
                type: "ProcessHubDate",
              },
              DateTime: {
                value: new Date(2019, 10, 25, 12, 0, 0),
                type: "ProcessHubDateTime",
              },
            },
            processRoles,
            {},
          );

          assert.equal(res, resultString);
        });

        it.only("should escape field placeholders_422e1b17-af66-4336-8185-1ddf682ef2c3", function () {
          const testString = "SELECT * FROM Users WHERE UserName = field['userId'];";
          const resultString = "SELECT * FROM Users WHERE UserName = 'Hans OR 1=1';";

          const res = DataTools.parseAndInsertStringWithFieldContent(testString, { userId: "Hans OR 1=1" } as IFieldContentMap, {}, {}, true);

          assert.equal(res, resultString);
        });
      });
    });
  });
});
