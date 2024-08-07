/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BpmnModdle from "bpmn-moddle";
import { assert, expect } from "chai";
import { Bpmn } from "modeler/bpmn/bpmn";
import { isId } from "../../tools/guid.js";
import { BpmnProcess } from "./bpmnprocess.js";
import { ILoadTemplateReply } from "../legacyapi.js";
import { createBpmnTemplate, bpmnModdleInstance } from "./bpmnmoddlehelper.js";
import { IRowDetails } from "../phclient.js";
import { getLastArrayEntry } from "../../tools/array.js";
import fs from "fs/promises";
import { IFieldConfigSchema } from "../../data/datainterfaces.js";
import { IDateRangeFieldConfigSchema } from "../../data/fields/daterange.js";
import { IFieldDefinition } from "../../data/ifielddefinition.js";

let TestRowDetails: IRowDetails[] = [];

function addTask(rowDetails: IRowDetails[], rowNumber: number, bpmnProcess: BpmnProcess): void {
  rowDetails.splice(rowNumber + 1, 0, {
    rowNumber: rowNumber + 1,
    selectedRole: rowDetails[rowNumber].selectedRole,
    task: "",
    taskId: "",
    laneId: rowDetails[rowNumber].laneId,
    taskType: "bpmn:UserTask",
    jumpsTo: rowDetails[rowNumber].jumpsTo,
  });

  bpmnProcess.addTaskBetween(rowDetails, rowNumber + 1);

  rowDetails[rowNumber].jumpsTo = [rowDetails[rowNumber + 1].taskId];

  // Update higher rownumbers
  let counter: number = rowNumber + 1;
  while (counter < rowDetails.length) {
    rowDetails[counter].rowNumber = counter;
    counter++;
  }
}

async function createTestBpmnProcess(): Promise<BpmnProcess> {
  const bpmnProcess: BpmnProcess = new BpmnProcess();
  const reply: ILoadTemplateReply = await createBpmnTemplate("de-DE");

  bpmnProcess.setBpmnDefinitions(reply.bpmnXml);

  const sortedTasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
  assert.isTrue(sortedTasks.length === 2, "wrong template process 1");
  const start = bpmnProcess.getStartEvents(bpmnProcess.processId());
  assert.isTrue(start.length === 1, "wrong template process 2");
  let rowDetails: IRowDetails[] = [];

  const startElem = getLastArrayEntry(start)!;
  const testLane = bpmnProcess.getLaneOfFlowNode(startElem.id);

  rowDetails.push({
    rowNumber: 0,
    selectedRole: testLane!.id,
    task: startElem.name!,
    taskId: startElem.id,
    laneId: testLane!.id,
    taskType: startElem.$type,
    jumpsTo: startElem.outgoing!.map((out) => out.targetRef.id),
  });

  let counter = 1;
  rowDetails = rowDetails.concat(
    sortedTasks.map((r): IRowDetails => {
      const testLane = bpmnProcess.getLaneOfFlowNode(r.id);
      const row = {
        rowNumber: counter,
        selectedRole: testLane!.id,
        task: r.name,
        taskId: r.id,
        laneId: testLane!.id,
        taskType: r.$type,
        jumpsTo: r.outgoing!.map((out) => out.targetRef.id),
      } as IRowDetails;
      counter++;
      return row;
    }),
  );

  assert.isTrue(rowDetails.length === 3, "wrong template 3");
  TestRowDetails = rowDetails;

  return bpmnProcess;
}

describe("sdk", function () {
  describe("process", function () {
    describe("bpmnprocess", function () {
      let freigabe2Xml: string;

      before(async function () {
        freigabe2Xml = await fs.readFile("./src/test/testfiles/freigabe2.bpmn", "utf-8");
      });

      describe("getNextActivities", function () {
        let bpmnProcess: BpmnProcess;

        before(async function () {
          const xml = await fs.readFile("./src/test/testfiles/getNextActivities.bpmn", "utf-8");
          bpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(xml);
        });

        it("should not return undefined values", function () {
          const flowElements = bpmnProcess.getProcess(bpmnProcess.processId()).flowElements;
          for (const flowElement of flowElements) {
            const nextActivities = bpmnProcess.getNextActivities(flowElement.id);
            nextActivities.forEach((nextActivity) => expect(nextActivity).not.to.equal(undefined));
          }
        });
      });

      describe("getDecisionTasksForTask", function () {
        it("returns the possible decision tasks", async function () {
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(freigabe2Xml);
          const decisionTasks = bpmnProcess.getDecisionTasksForTask("ExclusiveGateway_7C5D3E25718AB6BB", "de-DE");
          const expectedBpmnTaskIds = ["SubProcess_51C13A1CF5228786", "ExclusiveGateway_4E9D96C025622364"];
          for (const expectedBpmnTaskId of expectedBpmnTaskIds) {
            const decisionTask = decisionTasks.find((d) => d.bpmnTaskId === expectedBpmnTaskId);
            expect(decisionTask).not.to.equal(undefined);
            expect(decisionTask!.name).not.to.eq(null);
            expect(decisionTask!.name.length).to.be.greaterThan(0);
          }
        });
      });

      describe("getPreviousSequenceFlowName", function () {
        it("returns the name of the sequence flow that reaches the target element", async function () {
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(freigabe2Xml);
          let name = bpmnProcess.getPreviousSequenceFlowName("ExclusiveGateway_2B69BC9F8A518A72", "ExclusiveGateway_7C5D3E25718AB6BB");
          assert.equal(name, "nein");
          name = bpmnProcess.getPreviousSequenceFlowName("SubProcess_51C13A1CF5228786", "ExclusiveGateway_7C5D3E25718AB6BB");
          assert.equal(name, "Ja");
        });
      });

      describe("toXmlString", function () {
        it("loads and exports a bpmn file with an empty lane", async function () {
          const processXml: string = await fs.readFile("./src/test/testfiles/emptylane.bpmn", "utf-8");
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(processXml);
          const exportedXmlString = await bpmnProcess.toXmlString();

          // Load exported xml with moddle
          const moddle: BpmnModdle = new BpmnModdle();
          const fromXmlRes = await moddle.fromXML(exportedXmlString);
          const definitions = (fromXmlRes as BpmnModdle.IParseResult).rootElement as Bpmn.IDefinitions;

          // Check if empty lane is still there
          const process: Bpmn.IProcess = definitions.rootElements.find((e) => e.$type === "bpmn:Process") as Bpmn.IProcess;
          const [laneSet] = process.laneSets!;
          expect(laneSet.lanes).not.to.equal(undefined);
          expect(laneSet.lanes.length).to.equal(1);
        });
      });

      describe("getBpmnId", function () {
        it("soll nur eine ID zurückgeben", function () {
          const id: string = BpmnProcess.getBpmnId();
          assert(isId(id));
        });

        it("soll eine ID mit einem Prefix zurückgeben", function () {
          const id: string = BpmnProcess.getBpmnId("bpmn:UserTask");
          assert(id.length > 16);
        });
      });

      describe("BpmnProcessClass", function () {
        it("instanziiert BpmnProcess Objekt und ruft loadFromTemplate auf", async function () {
          const process: BpmnProcess = new BpmnProcess();
          await process.loadFromTemplate("de-DE");
        });

        it("erstellt mit dem BpmnModdleHelper ein Template", async function () {
          const bpmnProcess = await createTestBpmnProcess();

          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess != null);
        });

        it("soll alle Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();

          const processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);
        });

        it("soll id von BPMN zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess.processId().includes("_"));
          assert(bpmnProcess.definitionId().includes("_"));
        });

        it("soll ausgewählten Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();

          const processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);
        });

        it("soll Start oder EndEvent von ausgewähltem Prozess zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();

          const processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);

          // Wie test zuvor bis hier her

          const startEvents: Bpmn.IStartEvent[] = bpmnProcess.getStartEvents(process.id);
          assert(startEvents[0].outgoing![0].targetRef.$type === "bpmn:UserTask");
          assert(startEvents[0].outgoing![0].sourceRef.$type === "bpmn:StartEvent");

          const endEvent: Bpmn.IEndEvent = bpmnProcess.getEndEvents(process.id)[0];
          assert(endEvent.incoming![0].sourceRef.$type === "bpmn:UserTask");
          assert(endEvent.incoming![0].targetRef.$type === "bpmn:EndEvent");
        });

        it("soll Lane anlegen", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          const processes = bpmnProcess.getProcesses();
          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
          const testLaneId: string = bpmnProcess.addLane(process.id, testId, "Test Lane");

          const lanes: Bpmn.ILane[] = bpmnProcess.getLanes(false);

          assert(lanes.length === 3);
          assert(lanes[lanes.length - 1].id === testLaneId);
        });

        it("soll Task aus Lane entfernen", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          const processes = bpmnProcess.getProcesses();
          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          // Wie test zuvor bis hier her
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const testLane = bpmnProcess.getProcessLane(process.id, rowDetails[1].laneId);

          assert(testLane!.flowNodeRef.length === 2);

          const testTaskName = "Test Aufgabe";

          addTask(rowDetails, 1, bpmnProcess);
          assert.isTrue(rowDetails[2].taskId.startsWith("UserTask_"));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          assert.isTrue(bpmnProcess.getExistingTask(bpmnProcess.processId(), rowDetails[2].taskId).name === testTaskName);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const testTaskId: string = rowDetails[2].taskId;

          // +2 hier wegen dem Start und End Event!!!!

          expect(testLane!.flowNodeRef.length).to.equal(3);

          const testTaskObject: Bpmn.IUserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.IUserTask;

          bpmnProcess.removeTaskObjectFromLanes(process.id, testTaskObject);

          assert(testLane!.flowNodeRef.length === 2);
          bpmnProcess.removeTaskObjectFromLanes(process.id, bpmnProcess.getStartEvents(process.id)[0]);
          expect(testLane!.flowNodeRef.length).to.equal(1);
        });

        describe("Extension Values", function () {
          let bpmnProcess: BpmnProcess;
          let testTaskObject: Bpmn.IUserTask;

          before(async () => {
            bpmnProcess = await createTestBpmnProcess();

            const processes = bpmnProcess.getProcesses();
            const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

            // Wie test zuvor bis hier her
            const testLaneName = "Test Lane";

            const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
            bpmnProcess.addLane(process.id, testId, testLaneName);
            const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

            const testTaskId: string = rowDetails[1].taskId;

            testTaskObject = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.IUserTask;
            assert(testTaskObject.name === rowDetails[1].task);
            assert(testTaskObject.id === testTaskId);
            assert(testTaskObject.$type === "bpmn:UserTask");
          });

          it("soll Text einfügen und lesen - Description", function () {
            const testValue = "tritra test 123!";
            BpmnProcess.addOrUpdateExtension(testTaskObject, "description", testValue, "Text");

            const extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

            assert(extensionValues.description === testValue, extensionValues.description! + " == " + testValue);
          });

          it("soll Text einfügen und lesen - SequenzFlowExpression", function () {
            const testValue = "((field['Feld_1'] == 1) && (role['Bearbeiter'] == 'Administrator, Admin'))";
            const expectedValue = "((field['Feld_1'] == 1) && (role['Bearbeiter'] == 'Administrator, Admin'))";
            BpmnProcess.addOrUpdateExtension(testTaskObject, "sequenceflow-expression", testValue, "Text");

            const extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

            expect(extensionValues.sequenceFlowExpression).to.be.equal(expectedValue, extensionValues.sequenceFlowExpression! + " == " + expectedValue);
          });

          it("soll Boolean einfügen und lesen", function () {
            const testValue = true;
            BpmnProcess.addOrUpdateExtension(testTaskObject, "isBuilder-expression", testValue, "Boolean");

            const extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

            assert(extensionValues.isBuilderExpression === testValue, String(extensionValues.isBuilderExpression) + " == " + String(testValue));
          });

          it("soll List einfügen und lesen", function () {
            const testValue: string[] = ["Receiver1", "Receiver2"];
            BpmnProcess.addOrUpdateExtension(testTaskObject, "send-task-receiver", testValue, "List");

            const extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

            expect(extensionValues.sendTaskReceiver).to.eql(testValue, String(extensionValues.sendTaskReceiver) + " == " + String(testValue));
          });

          it("soll alte Syntax korrekt aus XML laden und austauschen", function () {
            const testValue = "(({{ field.Feld_1 }} == 1) && ({{ role.Bearbeiter }} == 'Administrator, Admin')) || role['Pruefer'].displayName && role['Ersteller'].firstname";
            const sollValue = "((field['Feld_1'] == 1) && (role['Bearbeiter'] == 'Administrator, Admin')) || role['Pruefer'].displayName && role['Ersteller'].firstname";
            BpmnProcess.addOrUpdateExtension(testTaskObject, "sequenceflow-expression", testValue, "Text");

            const extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

            expect(extensionValues.sequenceFlowExpression).to.be.equal(sollValue, extensionValues.sequenceFlowExpression! + " == " + sollValue);
          });
        });

        describe("convertFieldConfig", () => {
          const bpmnProcess = new BpmnProcess();

          before(async () => {
            const xml = await fs.readFile("./src/test/testfiles/alle-feldtypen.bpmn", "utf-8");
            await bpmnProcess.loadXml(xml);
          });

          function validateFieldConfigs(fieldDefinitions: IFieldDefinition[]): void {
            for (const fieldDefinition of fieldDefinitions!) {
              IFieldConfigSchema.required().validate(fieldDefinition.config);
              if (fieldDefinition.type === "ProcessHubDateRange") {
                IDateRangeFieldConfigSchema.required().validate(fieldDefinition.config);
              }
            }
          }

          it("should update field config if task extension is read", () => {
            const startEvent = bpmnProcess.getExistingActivityObject("StartEvent_4A99CF678C6B929B");
            const extensions = BpmnProcess.getExtensionValues(startEvent);
            validateFieldConfigs(extensions.fieldDefinitions!);
          });

          it("should update field config if field definitions are read", () => {
            const definitions = bpmnProcess.getFieldDefinitions();
            validateFieldConfigs(definitions);
          });
        });

        describe("deleteTask", function () {
          it("soll Task löschen und Reihenfolge überprüfen", async function () {
            const bpmnProcess = await createTestBpmnProcess();
            const processes = bpmnProcess.getProcesses();
            const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

            // Wie test zuvor bis hier her
            const testLaneName = "Test Lane";
            const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
            bpmnProcess.addLane(process.id, testId, testLaneName);

            const testLaneName2 = "Test Lane2";
            const testId2: string = BpmnProcess.getBpmnId("bpmn:Lane");
            bpmnProcess.addLane(process.id, testId2, testLaneName2);

            const testTaskName1 = "Test Aufgabe A";

            const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

            const testTaskId1: string = rowDetails[1].taskId;

            const testTaskObject1: Bpmn.IUserTask = bpmnProcess.getExistingTask(process.id, testTaskId1) as Bpmn.IUserTask;
            bpmnProcess.changeTaskName(rowDetails[1].taskId, testTaskName1);

            assert(testTaskObject1.name === testTaskName1);
            assert(testTaskObject1.id === testTaskId1);
            assert(testTaskObject1.$type === "bpmn:UserTask");

            const testTaskName2 = "Test Aufgabe B";
            const testTaskId2: string = rowDetails[2].taskId;

            const testTaskObject2: Bpmn.IUserTask = bpmnProcess.getExistingTask(process.id, testTaskId2) as Bpmn.IUserTask;
            bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName2);

            assert(testTaskObject2.name === testTaskName2);
            assert(testTaskObject2.id === testTaskId2);
            assert(testTaskObject2.$type === "bpmn:UserTask");

            const testTaskName3 = "Test Aufgabe C";
            const testTaskId3: string = rowDetails[2].taskId;

            const testTaskObject3: Bpmn.IUserTask = bpmnProcess.getExistingTask(process.id, testTaskId3) as Bpmn.IUserTask;
            bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName3);

            assert(testTaskObject3.name === testTaskName3, testTaskObject3.name! + " === " + testTaskName3);
            assert(testTaskObject3.id === testTaskId3, testTaskObject3.id + " === " + testTaskId3);
            assert(testTaskObject3.$type === "bpmn:UserTask", testTaskObject3.$type + " === " + "bpmn:UserTask");

            const tasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasks.length === 2);

            let lanes = bpmnProcess.getLanes(false);
            assert(lanes.length === 4);

            bpmnProcess.deleteTask(bpmnProcess.processId(), rowDetails, 2);

            const tasksEnd = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasksEnd.length === 1);

            lanes = bpmnProcess.getLanes(true);
            assert(lanes.length === 1);
          });
        });
      });

      describe("getSetSenderAsRoleOwner", function () {
        it("sets and gets SetSenderAsRoleOwner", function () {
          const startEvent: Bpmn.IStartEvent = bpmnModdleInstance.create("bpmn:StartEvent", {});
          BpmnProcess.setSetSenderAsRoleOwner(startEvent, false);
          expect(BpmnProcess.getSetSenderAsRoleOwner(startEvent)).to.equal(false);
          BpmnProcess.setSetSenderAsRoleOwner(startEvent, true);
          expect(BpmnProcess.getSetSenderAsRoleOwner(startEvent)).to.equal(true);
        });
      });

      describe("getFollowingSequenceFlowName", function () {
        it("soll Following Sequence Flow Name zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          const processes = bpmnProcess.getProcesses();
          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          const testLaneName = "Test Lane";
          const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
          bpmnProcess.addLane(process.id, testId, testLaneName);

          const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          const testTaskId1: string = rowDetails[1].taskId;

          const taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId1);
          assert.isTrue(taskObj.outgoing!.length === 1, "wrong outgoing");

          const checkName = "Test Sequence Name 123";
          taskObj.outgoing![taskObj.outgoing!.length - 1].name = checkName;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), checkName, "Sequence Flow Name wrong");
        });

        it("soll Null zurückgeben", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          const processes = bpmnProcess.getProcesses();
          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          const testLaneName = "Test Lane";
          const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
          bpmnProcess.addLane(process.id, testId, testLaneName);

          const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          const testTaskId1: string = rowDetails[1].taskId;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), null, "Sequence Flow Name wrong");
        });

        it("soll Null zurückgeben too much outgoings", async function () {
          const bpmnProcess = await createTestBpmnProcess();
          const processes = bpmnProcess.getProcesses();
          const process: Bpmn.IProcess = bpmnProcess.getProcess(processes[0].id);

          const testLaneName = "Test Lane";
          const testId: string = BpmnProcess.getBpmnId("bpmn:Lane");
          bpmnProcess.addLane(process.id, testId, testLaneName);

          const rowDetails: IRowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          const testTaskId1: string = rowDetails[1].taskId;

          const testTaskId2: string = rowDetails[2].taskId;

          const taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId1);
          assert.isTrue(taskObj.outgoing!.length === 1, "wrong outgoing");

          const taskObj2 = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId2);
          assert.isTrue(taskObj2.outgoing!.length === 1, "wrong outgoing");

          taskObj.outgoing!.push(taskObj2.outgoing![taskObj2.outgoing!.length - 1]);
          taskObj2.outgoing![taskObj2.outgoing!.length - 1].sourceRef = taskObj;
          taskObj2.outgoing!.pop();

          const checkName = "Test Sequence Name 123";
          taskObj.outgoing![taskObj.outgoing!.length - 1].name = checkName;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), null, "Sequence Flow Name wrong");
        });

        it("should check addtaskbetween method", async function () {
          const bpmnProcess = await createTestBpmnProcess();

          const sortedTasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
          assert.isTrue(sortedTasks.length === 2, "wrong template process 1");
          const start = bpmnProcess.getStartEvents(bpmnProcess.processId());
          assert.isTrue(start.length === 1, "wrong template process 2");
          let rowDetails: IRowDetails[] = [];

          const startElem = getLastArrayEntry(start)!;
          const testLane = bpmnProcess.getLaneOfFlowNode(startElem.id);

          rowDetails.push({
            rowNumber: 0,
            selectedRole: testLane!.id,
            task: startElem.name!,
            taskId: startElem.id,
            laneId: testLane!.id,
            taskType: startElem.$type,
            jumpsTo: startElem.outgoing!.map((out) => out.targetRef.id),
          });

          let counter = 1;
          rowDetails = rowDetails.concat(
            sortedTasks.map((r): IRowDetails => {
              const testLane = bpmnProcess.getLaneOfFlowNode(r.id);
              const row = {
                rowNumber: counter,
                selectedRole: testLane?.id,
                task: r.name,
                taskId: r.id,
                laneId: testLane?.id,
                taskType: r.$type,
                jumpsTo: r.outgoing?.map((out) => out.targetRef.id),
              } as IRowDetails;
              counter++;
              return row;
            }),
          );

          assert.isTrue(rowDetails.length === 3, "wrong template 3");

          const rowNumber = 1;
          const testTaskName = "Test Task Name 1337";
          rowDetails.splice(2, 0, {
            rowNumber: rowNumber + 1,
            selectedRole: rowDetails[rowNumber].selectedRole,
            task: testTaskName,
            taskId: "",
            laneId: rowDetails[rowNumber].laneId,
            taskType: "bpmn:UserTask",
            jumpsTo: rowDetails[rowNumber].jumpsTo,
          });

          bpmnProcess.addTaskBetween(rowDetails, 2);

          rowDetails[1].jumpsTo = [rowDetails[2].taskId];

          // Update higher rownumbers
          let counter2: number = 1 + 1;
          while (counter2 < rowDetails.length) {
            rowDetails[counter2].rowNumber = counter2;
            counter2++;
          }

          assert.isTrue(rowDetails.length === 4, "error in addTaskBetween method");
          assert.isTrue(rowDetails[2].task === testTaskName, "wrong testtaskname");
          assert.isTrue(rowDetails[2].taskId != null, "taskId is not set after method");

          const newLane = bpmnProcess.getLaneOfFlowNode(rowDetails[rowNumber].taskId);
          assert.isTrue(newLane?.id === rowDetails[2].laneId);
          assert.isTrue(newLane?.id === rowDetails[2 - 1].laneId);

          const taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), rowDetails[2].taskId);
          assert.isTrue(taskObj != null);
          bpmnProcess.changeTaskName(rowDetails[2].taskId, "TEST 123 a");
          assert.isTrue(taskObj.name === "TEST 123 a", "wrong testtaskname");
        });
      });

      describe("getFieldDefinitions", function () {
        it("should return the fields in the same order as the tasks and events appear", async () => {
          const processXml: string = await fs.readFile("./src/test/testfiles/field-order.bpmn", "utf-8");
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(processXml);

          const fieldDefinitions = bpmnProcess.getFieldDefinitions();
          expect(fieldDefinitions.length).to.equal(5);
          expect(fieldDefinitions[0].name).to.equal("Titel");
          expect(fieldDefinitions[1].name).to.equal("A");
          expect(fieldDefinitions[2].name).to.equal("B");
          expect(fieldDefinitions[3].name).to.equal("C");
          expect(fieldDefinitions[4].name).to.equal("D");
        });
      });
    });
  });
});
