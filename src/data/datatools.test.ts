/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assert, expect } from "chai";
import * as DataTools from "./datatools";
import { BpmnProcess } from "../process/bpmn/bpmnprocess";
import { ILoadTemplateReply } from "../process/legacyapi";
import { createBpmnTemplate } from "../process/bpmn/bpmnmoddlehelper";
import { getProcessRoles, IProcessRoles, IRoleOwnerMap } from "../process/processrights";
import Joi from "joi";
import { createId } from "../tools/guid";
import { IUserDetailsNoExtras, Licence, UserStatus } from "../user/userinterfaces";

describe("sdk", function () {
  describe("data", function () {
    describe("datatools", function () {
      describe("replaceObjectReferences", function () {
        it("should replace field values with {field['name']} notation", function () {
          const testString = "Hallo {field['existiert']}, wie gehts {field['existiertnicht']}\n{trölölö} {{{moepmoep}}}\nfield['existiertnicht2']\n";
          const resultString = "Hallo {Teststring eingesetzt!}, wie gehts {}\n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.replaceObjectReferences(testString, "field", { existiert: "Teststring eingesetzt!" });
          console.log(res);
          assert.equal(res, resultString);
        });

        it("should replace long field names with short values", function () {
          const testString = "field['fieldname1']field['fieldname2']field['fieldname3']";
          const resultString = "123";
          const res = DataTools.replaceObjectReferences(testString, "field", {
            fieldname1: "1",
            fieldname2: "2",
            fieldname3: "3",
          });
          assert.equal(res, resultString);
        });
      });

      describe("parseAndInsertStringWithFieldContent", function () {
        it("should replace user fields", () => {
          const testString =
            "Hallo role['Ersteller'].fields.Salutation role['Ersteller'].firstName role['Ersteller'].lastName, die Anschrift lautet: role['Ersteller'].fields.Address1";
          const resultString = "Hallo Frau Vorname Nachname, die Anschrift lautet: Schillerstr. 21";

          const user: IUserDetailsNoExtras = {
            licence: Licence.Writer,
            extendedRights: [],
            status: UserStatus.Active,
            fields: { Salutation: "Frau", Address1: "Schillerstr. 21" },
            userId: "1",
            displayName: "Nachname, Vorname",
            firstName: "Vorname",
            lastName: "Nachname",
            mail: "",
          };

          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            { existiert: { value: "Teststring eingesetzt!", type: "ProcessHubTextInput" } },
            {
              ["Lane_7A0DD19E05A33282"]: {
                potentialRoleOwners: [],
                roleName: "Ersteller",
                isStartingRole: true,
              },
            },
            { ["Lane_7A0DD19E05A33282"]: [{ memberId: user.userId, user }] },
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace field values", function () {
          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            { existiert: { value: "Teststring eingesetzt!", type: "ProcessHubTextInput" } },
            {},
            {},
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace field values with {field['name']} notation", function () {
          const testString = "Hallo {field['existiert']}, wie gehts {field['existiertnicht']}\n{trölölö} {{{moepmoep}}}\nfield['existiertnicht2']\n";
          const resultString = "Hallo {Teststring eingesetzt!}, wie gehts {}\n{trölölö} {{{moepmoep}}}\n\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            { existiert: { value: "Teststring eingesetzt!", type: "ProcessHubTextInput" } },
            {},
            {},
            "de-DE",
          );
          console.log(res);
          assert.equal(res, resultString);
        });

        it("should accept empty field maps", function () {
          const testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, undefined, {}, {}, "de-DE");

          assert.equal(res, testString);
        });

        it("should replace long field old names with short values", function () {
          const testString = "{{ field.fieldname1 }}{{ field.fieldname2 }}{{ field.fieldname3 }}";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              fieldname1: { value: "1", type: "ProcessHubTextInput" },
              fieldname2: { value: "2", type: "ProcessHubTextInput" },
              fieldname3: { value: "3", type: "ProcessHubTextInput" },
            },
            {},
            {},
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace long field names with short values", function () {
          const testString = "field['fieldname1']field['fieldname2']field['fieldname3']";
          const resultString = "123";
          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              fieldname1: { value: "1", type: "ProcessHubTextInput" },
              fieldname2: { value: "2", type: "ProcessHubTextInput" },
              fieldname3: { value: "3", type: "ProcessHubTextInput" },
            },
            {},
            {},
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace field and role", async function () {
          const testString = "{{ field.Anlagen }}{{ role.Bearbeiter }}";
          const resultString = "1Administrator, Admin";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate("de-DE");

          bpmnProcess.setBpmnDefinitions(reply.bpmnXml);

          const processRoles: IProcessRoles = getProcessRoles(undefined, bpmnProcess, "1");
          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            { Anlagen: { value: ["1"], type: "ProcessHubFileUpload" } },
            processRoles,
            {
              [bpmnProcess.getLanes(false).find((l) => l.name === "Bearbeiter")!.id]: [{ memberId: "1", displayName: "Administrator, Admin" }],
            } as IRoleOwnerMap,
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace undefined date with empty string", async function () {
          const testString = "{{ field.Date }}{{ field.DateTime }}";
          const resultString = "";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate("de-DE");

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
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace date", async function () {
          const testString = "{{ field.Date }}";
          const resultString = "25.10.2019";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate("de-DE");

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
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should replace missing roles with empty string", async function () {
          const testString = "{{ role.Date }}/{{ role.DateTime }}";
          const resultString = "/";

          const bpmnProcess: BpmnProcess = new BpmnProcess();
          const reply: ILoadTemplateReply = await createBpmnTemplate("de-DE");

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
            "de-DE",
          );

          assert.equal(res, resultString);
        });

        it("should escape field placeholders_422e1b17-af66-4336-8185-1ddf682ef2c3", function () {
          const testString = "SELECT * FROM Users WHERE UserName = 'field['userName']' AND Age = field['age'] AND HomeTown = 'field['homeTown']';";
          const resultString = "SELECT * FROM Users WHERE UserName = 'Hans' AND Age = 30 AND HomeTown = 'Göppingen\\' OR \\'1\\'=\\'1';";

          const res = DataTools.parseAndInsertStringWithFieldContent(
            testString,
            {
              userName: { type: "ProcessHubTextInput", value: "Hans" },
              age: { type: "ProcessHubNumber", value: 30 },
              homeTown: { type: "ProcessHubTextInput", value: "Göppingen' OR '1'='1" },
            },
            {},
            {},
            "de-DE",
            true,
          );

          assert.equal(res, resultString);
        });

        it("should replace instance values", function () {
          const testString = "Id: 'instance['instanceId']', Titel: 'instance['title']'";
          const resultString = "Id: 'e8b278368b1002d7', Titel: 'test instance'";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, {}, {}, {}, "de-DE", false, "", undefined, {
            instanceId: "E8B278368B1002D7",
            workspaceId: "1",
            processId: createId(),
            title: "test instance",
            takenStartEvent: "",
            reachedEndEvents: [],
            extras: {},
          });

          assert.equal(res, resultString);
        });

        it("should replace risk metrics", function () {
          const testString = "RPZ: riskMetric['Risiko']";
          const resultString = "RPZ: 33";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, {}, {}, {}, "de-DE", false, "", undefined, undefined, { Risiko: 33 });

          assert.equal(res, resultString);
        });

        it("should replace missing risk metrics with default value", function () {
          const testString = "RPZ: riskMetric['Risiko2']";
          const resultString = "RPZ: ";
          const res = DataTools.parseAndInsertStringWithFieldContent(testString, {}, {}, {}, "de-DE", false, "", undefined, undefined, { Risiko: 33 });

          assert.equal(res, resultString);
        });
      });

      describe("validateType", function () {
        it("should validate type without options", function () {
          // Test simple string validation
          const expectedString = "This is a string";
          const actualString = DataTools.validateType<string>(Joi.string(), expectedString);
          expect(actualString).to.equal(expectedString);

          // Test if undefined will be rejected
          expect(() => {
            DataTools.validateType<string>(Joi.string(), undefined);
          }).to.throw();

          // Test if a numberstring will not be casted to a number
          const expectedNumberString = "42";
          const actualNumber = DataTools.validateType<number>(Joi.number().options({ convert: true }), expectedNumberString);
          expect(typeof actualNumber === "string").to.be.true;
          expect(actualNumber).to.equal(expectedNumberString);
        });

        it("should validate type with options", function () {
          // Test simple string validation with options
          const expectedString = "This is a string";
          let actualString = DataTools.validateType<string>(Joi.string(), expectedString, { allowUndefined: false, convert: false });
          expect(actualString).to.equal(expectedString);
          actualString = DataTools.validateType<string>(Joi.string(), expectedString, { allowUndefined: false, convert: true });
          expect(actualString).to.equal(expectedString);
          actualString = DataTools.validateType<string>(Joi.string(), expectedString, { allowUndefined: true, convert: false });
          expect(actualString).to.equal(expectedString);
          actualString = DataTools.validateType<string>(Joi.string(), expectedString, { allowUndefined: true, convert: true });
          expect(actualString).to.equal(expectedString);

          // Test allowUndefined option
          expect(() => {
            DataTools.validateType<string>(Joi.string(), undefined, { allowUndefined: false });
          }).to.throw();

          let undefinedString = DataTools.validateType<string | undefined>(Joi.string(), undefined, { allowUndefined: true });
          expect(undefinedString).to.be.undefined;

          undefinedString = DataTools.validateType<string>(Joi.string(), undefined, { allowUndefined: true });
          expect(undefinedString).to.be.undefined;

          undefinedString = DataTools.validateType<string | undefined>(Joi.string(), "Not undefined", { allowUndefined: true });
          expect(undefinedString).to.equal("Not undefined");

          // Test convert option
          const expectedNumberString = "42";
          let actualNumber = DataTools.validateType<number>(Joi.number().options({ convert: true }), expectedNumberString, { convert: false });
          expect(typeof actualNumber === "string").to.be.true;
          expect(actualNumber).to.equal(expectedNumberString);

          actualNumber = DataTools.validateType<number>(Joi.number().options({ convert: true }), expectedNumberString, { convert: true });
          expect(typeof actualNumber === "number").to.be.true;
          expect(actualNumber).to.equal(Number(expectedNumberString));
        });
      });
    });
  });
});
