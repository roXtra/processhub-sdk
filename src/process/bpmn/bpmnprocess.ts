import * as BpmnModdleHelper from "./bpmnmoddlehelper";
import * as Todo from "../../todo";
import { FieldDefinition, FieldDefinitionItem } from "../../data/datainterfaces";
import { LaneDictionary } from "./bpmnprocessdiagram";
import { BpmnProcessDiagram } from "./bpmnprocessdiagram";
import { Bpmn, Bpmndi } from "../bpmn";
import { RunningTaskLane, TaskToLaneMapEntry, StartButtonMap, ProcessDiagramSize, TaskSettingsValueType, BpmnExtensionName, TaskExtensions } from "../processinterfaces";
import { isTrue } from "../../tools/assert";
import { tl } from "../../tl";
import { createId } from "../../tools/guid";
import { InstanceDetails } from "../../instance/instanceinterfaces";
import { DecisionTask, DecisionTaskTypes, filterTodosForInstance } from "../../todo";
import { LoadTemplateReply } from "../legacyapi";
import { RowDetails } from "../phclient";
import { getExtensionValues, addOrUpdateExtension, getExtensionBody } from "./bpmnextensions";
import { bpmnModdleInstance } from "./bpmnmoddlehelper";

export class BpmnProcess {

  private bpmnXml: Bpmn.Definitions;
  private processDiagram: BpmnProcessDiagram;

  constructor() {
    this.bpmnXml = null;
    this.processDiagram = new BpmnProcessDiagram(this);
  }

  public static addOrUpdateExtension(baseElement: Bpmn.BaseElement, key: BpmnExtensionName, value: string | boolean | {}[], extensionValueType: TaskSettingsValueType): void {
    addOrUpdateExtension(baseElement, key, value, extensionValueType);
  }

  public static getExtensionValues(activityObject: Bpmn.Activity): TaskExtensions {
    return getExtensionValues(activityObject);
  }

  public static getFlowNodeDescription(flowNode: Bpmn.FlowNode): string {
    return getExtensionBody(flowNode, "description");
  }

  public static setSetSenderAsRoleOwner(startEvent: Bpmn.StartEvent, setSetSenderAsRoleOwner: boolean): void {
    addOrUpdateExtension(startEvent, "set-sender-as-role-owner", setSetSenderAsRoleOwner, "Boolean");
  }

  public static getSetSenderAsRoleOwner(startEvent: Bpmn.StartEvent): boolean {
    const valueAsString: string = getExtensionBody(startEvent, "set-sender-as-role-owner");
    if (valueAsString) {
      return valueAsString === "true";
    } else {
      // Default value is true
      return true;
    }
  }

  public getBpmnDefinitions(): Bpmn.Definitions {
    return this.bpmnXml;
  }

  public setBpmnDefinitions(definitions: Bpmn.Definitions): void {
    this.bpmnXml = definitions;
  }

  public definitionId(): string {
    return this.bpmnXml.id;
  }

  public processId(): string {
    return this.getProcesses()[0].id;
  }

  public fixExclusiveGateway(): void {
    const exclusiveGateways: Bpmn.ExclusiveGateway[] = this.getFlowElementsOfType<Bpmn.ExclusiveGateway>("bpmn:ExclusiveGateway");

    for (const exGat of exclusiveGateways) {
      // Wenn nur 1 outgoing von einem xor ist, dann braucht dies keine Bedingung
      if (exGat.outgoing != null && exGat.outgoing.length > 1) {
        for (const seqFlow of exGat.outgoing) {
          // This.variables.choosenTaskId
          seqFlow.conditionExpression = bpmnModdleInstance.create("bpmn:FormalExpression", {
            body: "this.variables.taskInput." + exGat.id + ".userInput.choosenTaskId == '" + seqFlow.targetRef.id + "'", language: "JavaScript"
          });
        }
      } else if (exGat.outgoing != null && exGat.outgoing.length === 1) {
        exGat.outgoing[exGat.outgoing.length - 1].conditionExpression = null;
      }
    }
  }

  public getFieldDefinitionList(): FieldDefinitionItem[] {
    const fieldDefinitionsList: FieldDefinitionItem[] = [];

    const process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process") as Bpmn.Process;
    process.flowElements.map(flowElement => {
      const extVals = getExtensionValues(flowElement);
      if (extVals) {
        const taskFields = getExtensionValues(flowElement).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // Currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map(taskField => {
            if (taskField.type === "ProcessHubRoxFile") {
              fieldDefinitionsList.push({
                bpmnTaskId: flowElement.id,
                isStartEvent: flowElement.$type === "bpmn:StartEvent" ? true : false,
                fieldDefinition: taskField
              });
            }
          });
        }
      }
    });
    return fieldDefinitionsList;
  }

  public getFieldDefinitions(): FieldDefinition[] {
    const fieldDefinitions: FieldDefinition[] = [];

    const process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process") as Bpmn.Process;
    process.flowElements.map(flowElement => {
      const extVals = getExtensionValues(flowElement);
      if (extVals) {
        const taskFields = getExtensionValues(flowElement).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // Currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map(taskField => {
            if (fieldDefinitions.find(fieldDefinition => fieldDefinition.name === taskField.name) == null)
              fieldDefinitions.push(taskField);
          });
        }
      }
    });

    return fieldDefinitions;
  }

  public getFieldDefinitionsOfSpecificType(fieldType: string): FieldDefinition[] {
    const fieldDefinitions: FieldDefinition[] = [];

    const process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process") as Bpmn.Process;
    process.flowElements.map(flowElement => {
      const extVals = getExtensionValues(flowElement);
      if (extVals) {
        const taskFields = getExtensionValues(flowElement).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // Currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map(taskField => {
            if (fieldDefinitions.find(fieldDefinition => fieldDefinition.name === taskField.name) == null && taskField.type === fieldType)
              fieldDefinitions.push(taskField);
          });
        }
      }
    });

    return fieldDefinitions;
  }

  public getFieldDefinitionsForTask(taskObject: Bpmn.Task | Bpmn.Activity): FieldDefinition[] {
    const extVals = getExtensionValues(taskObject);
    if (extVals)
      return extVals.fieldDefinitions;
    else
      return null;
  }

  public async loadXml(processXmlStr: string): Promise<void> {
    return await new Promise<void>((resolve, reject): void => {
      if (processXmlStr != null) {
        bpmnModdleInstance.fromXML(processXmlStr, (err: any, bpmnXml: any) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          this.bpmnXml = bpmnXml;

          // Fix für startevent
          const sequenceFlows: Bpmn.SequenceFlow[] = this.getSequenceFlowElements();
          for (const sequenceFlow of sequenceFlows) {
            if (sequenceFlow.sourceRef && sequenceFlow.sourceRef.outgoing == null) {
              sequenceFlow.sourceRef.outgoing = [];
            }
            if (sequenceFlow.sourceRef && !sequenceFlow.sourceRef.outgoing.includes(sequenceFlow)) {
              sequenceFlow.sourceRef.outgoing.push(sequenceFlow);
            }

            if (sequenceFlow.targetRef && sequenceFlow.targetRef.incoming == null) {
              sequenceFlow.targetRef.incoming = [];
            }
            if (sequenceFlow.targetRef && !sequenceFlow.targetRef.incoming.includes(sequenceFlow)) {
              sequenceFlow.targetRef.incoming.push(sequenceFlow);
            }
          }

          // Fixes für boundary events
          const boundaryEvents: Bpmn.BoundaryEvent[] = this.getFlowElementsOfType<Bpmn.BoundaryEvent>("bpmn:BoundaryEvent");

          // Console.log(boundaryEvents);

          for (const t of boundaryEvents) {
            // Console.log(this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs);

            if (this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs == null)
              this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs = [];

            if (!this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs.find(e => e.id === t.id))
              this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs.push(t);
          }

          // Console.log(boundaryEvents);

          // fixes ende

          this.processDiagram = new BpmnProcessDiagram(this);

          resolve();
        });
      } else {
        console.log("XML string of process should not be null/undefined!");

        const stack = new Error().stack;
        console.log("PRINTING CALL STACK");
        console.log(stack);

        isTrue(processXmlStr != null, "XML string of process should not be null/undefined!");
        reject();
      }
    });
  }

  public isOneOfNextActivityOfType(currentTaskId: string, type: Bpmn.bpmnType): boolean {
    const elem = this.getNextActivities(currentTaskId);
    for (const el of elem) {
      if (el.$type === type) {
        return true;
      }
    }
    return false;
  }

  public getNextActivities(currentTaskId: string): Bpmn.FlowNode[] {
    const currentTask = this.getExistingActivityObject(currentTaskId);

    const tmpList: Bpmn.FlowNode[] = [];

    if (currentTask == null) {
      console.error("getNextActivities: currentTask may not be null");
      return tmpList;
    }
    if (currentTask.outgoing == null) {
      if (currentTask.$type !== "bpmn:EndEvent") {
        console.warn("getNextActivities: currentTask.outgoing should not be null");
      }
      return tmpList;
    }

    for (const task of currentTask.outgoing) {
      tmpList.push(task.targetRef);
    }
    return tmpList;
  }

  private getTaskIdsAfterGateway(currentGatewayId: string): Todo.DecisionTask[] {
    const currentObject: Bpmn.Gateway = this.getExistingActivityObject(currentGatewayId);
    let exclusiveGateway: Bpmn.ExclusiveGateway = null;
    if (currentObject.$type === "bpmn:ExclusiveGateway")
      exclusiveGateway = currentObject as Bpmn.ExclusiveGateway;
    else
      return null;
    // A -> X -> B & C | A -> X1 -> (X2 -> C) & B

    return this.getDecisionTasksAfterGateway(exclusiveGateway);
  }

  public getDecisionTasksAfterGateway(gat: Bpmn.ExclusiveGateway, rootTaskId: string = null): Todo.DecisionTask[] {
    let decisionTasks: Todo.DecisionTask[] = [];
    if (gat.outgoing) {
      for (const processObject of gat.outgoing) {
        let tmpRes = null;
        // Let tmpRouteStack = routeStack == null ? [] : _.cloneDeep(routeStack);
        if (processObject.targetRef.$type === "bpmn:ExclusiveGateway" && processObject.targetRef.outgoing.length === 1) {
          // If (processObject.targetRef.outgoing.length == 1)
          tmpRes = this.getDecisionTasksAfterGateway(processObject.targetRef as Bpmn.ExclusiveGateway, processObject.targetRef.id);
          //   TmpRouteStack.push(processObject.targetRef.id);
          //   tmpRes = getDecisionTasksAfterGateway(processObject.targetRef as Bpmn.ExclusiveGateway, tmpRouteStack);
        }

        // Wenn es kein gateway ist dann füge zusammen
        if (tmpRes != null) {
          decisionTasks = decisionTasks.concat(tmpRes);
        } else {
          let taskId: string = processObject.targetRef.id;
          if (rootTaskId != null)
            taskId = rootTaskId;

          let nameValue: string = processObject.targetRef.name;
          if (nameValue == null) {
            switch (processObject.targetRef.$type) {
              case "bpmn:EndEvent":
                nameValue = tl("Ende");
                break;
              case "bpmn:ExclusiveGateway":
                nameValue = tl("Gateway");
                break;
              default:
                nameValue = processObject.targetRef.$type;
            }
          }

          decisionTasks.push({
            bpmnTaskId: taskId,
            name: nameValue,
            type: Todo.DecisionTaskTypes.Normal,
            isBoundaryEvent: false,
            // RequiredFieldsNeeded: processObject.
            // routeStack: tmpRouteStack
          } as Todo.DecisionTask);
        }
      }
    }
    return decisionTasks;
  }

  public async loadFromTemplate(): Promise<LoadTemplateReply> {
    const result: LoadTemplateReply = await BpmnModdleHelper.createBpmnTemplate();

    this.bpmnXml = result.bpmnXml;

    // Add extensions

    // add default fields to start element
    const startElement = this.getStartEvents(this.processId())[0];
    const fieldDefinitions: FieldDefinition[] = [
      {
        name: tl("Titel"),
        type: "ProcessHubTextInput",
        isRequired: false,
        config: {}
      },
      {
        name: tl("Feld_1"),
        type: "ProcessHubTextInput",
        isRequired: false,
        config: {}
      },
      {
        name: tl("Feld_2"),
        type: "ProcessHubTextArea",
        isRequired: false,
        config: {}
      },
      {
        name: tl("Anlagen"),
        type: "ProcessHubFileUpload",
        isRequired: false,
        config: {}
      }
    ];

    addOrUpdateExtension(
      startElement,
      "processhub-userform",
      JSON.stringify(fieldDefinitions),
      "Text");

    addOrUpdateExtension(
      startElement,
      "roleowners-editable",
      true,
      "Boolean");

    const sortedTasks = this.getSortedTasks(this.processId(), false);
    let counter = -1;
    const rows: RowDetails[] = sortedTasks.map(task => {
      counter++;
      const lane = this.getLaneOfFlowNode(task.id);
      return {
        taskId: task.id,
        rowNumber: counter,
        selectedRole: lane.id,
        task: task.name,
        laneId: lane.id,
        taskType: "bpmn:UserTask",
        jumpsTo: task.outgoing.map(out => out.targetRef.id)
      } as RowDetails;
    });
    this.processDiagram.generateBPMNDiagram(this.processId(), rows);


    return result;
  }

  public setParticipantsName(name: string): void {
    this.getCollaboration().participants[0].name = name;
  }

  private getCollaboration(): Bpmn.Collaboration {
    return this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Collaboration") as Bpmn.Collaboration;
  }

  // Suchfunktionen, siehe
  // https://github.com/paed01/bpmn-engine/blob/master/lib/context-helper.js
  public static getBpmnId(type: Bpmn.ElementType = undefined, createdId = ""): string {
    let newId = "";

    // Am Doppelpunkt wird nur gesplittet wenn auch einer vorhanden ist
    if (type && type.includes(":")) {
      const splittedType: string[] = type.split(":");
      newId = splittedType[splittedType.length - 1] + "_";
    }

    if (createdId !== "") {
      newId += createdId;
      return newId;
    }

    newId += createId();
    return newId;
  }

  public getProcesses(): Bpmn.RootElement[] {
    return this.bpmnXml.rootElements.filter((e) => e.$type === "bpmn:Process");
  }

  public getProcess(processId: string): Bpmn.Process {
    return this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.Process;
  }

  // Get the StartEvents of the process
  public getStartEvents(processId: string): Bpmn.StartEvent[] {
    return this.getEvents(processId, "bpmn:StartEvent") as Bpmn.StartEvent[];
  }

  // Get the text that should be displayed on the start button
  public getStartButtonMap(): StartButtonMap {
    const startEvents = this.getStartEvents(this.processId());
    if (startEvents && startEvents.length > 0) {
      const map = {} as StartButtonMap;
      startEvents.forEach(startEvent => {
        if (startEvent.eventDefinitions == null) {
          // Check if start event has only one roxfilefield
          let onlyRoxFileField = false;
          const extVals: TaskExtensions = getExtensionValues(startEvent);
          if (extVals.fieldDefinitions != null && extVals.fieldDefinitions.length === 1) {
            if (extVals.fieldDefinitions[0].type === "ProcessHubRoxFile") {
              onlyRoxFileField = true;
            }
          }
          map[startEvent.id] = {
            startEventName: (startEvent.name && startEvent.name.trim() !== "") ? startEvent.name : undefined,
            laneId: this.getLaneOfFlowNode(startEvent.id).id,
            onlyRoxFileField,
          };
        }
      });
      return map;
    } else {
      return undefined; // Undefined means no member gets created - null would explicitly be stored
    }
  }

  public getEndEvents(processId: string): Bpmn.EndEvent[] {
    return this.getEvents(processId, "bpmn:EndEvent") as Bpmn.EndEvent[];
  }

  private getEvents(processId: string, eventType: string): Bpmn.FlowElement[] {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.Process;
    const flowElements: Bpmn.FlowElement[] = process.flowElements.filter((e: Bpmn.FlowElement) => e.$type === eventType);

    return flowElements;
  }

  public getProcessDiagram(): BpmnProcessDiagram {
    return this.processDiagram;
  }

  public getExistingTask(processId: string, taskId: string): Bpmn.Task {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.Process;
    const flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === "bpmn:StartEvent" || e.$type === "bpmn:EndEvent" || e.$type === "bpmn:UserTask" || e.$type === "bpmn:SendTask" || e.$type === "bpmn:ServiceTask" || e.$type === "bpmn:ScriptTask"));
    const task = flowElements.find(element => element.id === taskId);

    return task as Bpmn.Task;
  }

  public changeTaskName(taskId: string, newName: string): void {
    const task = this.getExistingTask(this.processId(), taskId);
    task.name = newName;
  }

  public changeRole(rowDetails: RowDetails[], taskId: string, laneId: string): void {
    const task = this.getExistingActivityObject(taskId);
    if (task.$type as string === "bpmn:StartEvent") {
      this.getStartEvents(this.processId()).forEach(start => {
        this.setRoleForTask(this.processId(), laneId, start);
      });
    } else {
      this.setRoleForTask(this.processId(), laneId, task);
    }

    if (taskId === rowDetails.last().taskId) {
      const endEvent = this.getEndEvents(this.processId())[0];
      this.setRoleForTask(this.processId(), laneId, endEvent);
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public getAllTimers(): Bpmn.CatchEvent[] {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.Process;
    const flowElements: Bpmn.CatchEvent[] = process.flowElements.filter((e: Bpmn.CatchEvent) => (e.eventDefinitions != null && e.eventDefinitions.find(ed => ed.$type === "bpmn:TimerEventDefinition")));
    return flowElements;
  }

  public getAllExclusiveGateways(): Bpmn.FlowNode[] {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.Process;
    const flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === "bpmn:ExclusiveGateway"));
    return flowElements;
  }

  public getAllParallelGateways(): Bpmn.FlowNode[] {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.Process;
    const flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === "bpmn:ParallelGateway"));
    return flowElements;
  }

  public getExistingActivityObject(objectId: string): Bpmn.Activity {
    const process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.Process;
    const flowElement: Bpmn.Activity = process.flowElements.find((e: Bpmn.Activity) => (e.id === objectId));
    return flowElement;
  }

  private getProcessLanes(processId: string): Bpmn.Lane[] {
    const processContext: Bpmn.Process = this.getProcess(processId);
    return processContext.laneSets[0].lanes;
  }

  public getTaskToLaneMap(): TaskToLaneMapEntry[] {
    let resultMap: TaskToLaneMapEntry[] = [];
    const lanes = this.getProcessLanes(this.processId());

    for (const lane of lanes) {
      const mapForLane = lane.flowNodeRef ? lane.flowNodeRef.filter(node => (node.$type === "bpmn:UserTask" || node.$type === "bpmn:SendTask" || node.$type === "bpmn:ExclusiveGateway")) : null;
      let mapForLaneNodes = null;
      if (mapForLane != null) {
        mapForLaneNodes = mapForLane.map(taskNode => {
          return { taskId: taskNode.id, laneId: lane.id };
        });
      }

      if (mapForLaneNodes != null) {
        resultMap = resultMap.concat(mapForLaneNodes);
      }
    }
    return resultMap;
  }

  public getProcessLane(processId: string, laneId: string): Bpmn.Lane {
    const processLanes: Bpmn.Lane[] = this.getProcessLanes(processId);
    if (processLanes) {
      return processLanes.find((lane) => lane.id === laneId);
    } else {
      return null;
    }
  }

  private removeSequenceFlow(processId: string, sequenceFlowObject: Bpmn.SequenceFlow): void {
    const process: Bpmn.Process = this.getProcess(processId);
    const index: number = process.flowElements.indexOf(sequenceFlowObject);

    if (index > -1) {
      const sf: Bpmn.SequenceFlow = process.flowElements.find(e => e.id === process.flowElements[index].id) as Bpmn.SequenceFlow;
      sf.sourceRef.outgoing = sf.sourceRef.outgoing.filter(out => out.id !== sf.id);
      sf.targetRef.incoming = sf.targetRef.incoming.filter(inc => inc.id !== sf.id);
      process.flowElements.splice(index, 1);
    } else {
      console.log("Error: cannot find SequenceFlow to remove.");
    }
  }

  public addLane(processId: string, id: string, name: string): string {
    // Add an additional lane (=role)
    const lane = bpmnModdleInstance.create("bpmn:Lane", { id: id, name: name, flowNodeRef: [] });

    const processContext: Bpmn.Process = this.getProcess(processId);
    if (processContext.laneSets[0].lanes == null) {
      processContext.laneSets[0].lanes = [];
    }

    processContext.laneSets[0].lanes.push(lane);
    return id;
  }

  public removeTaskObjectFromLanes(processId: string, taskObject: Bpmn.BaseElement): void {
    let lanes: Bpmn.Lane[] = this.getProcessLanes(processId);

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const laneObject = lanes[laneIndex];
      if (laneObject.flowNodeRef != null) {
        laneObject.flowNodeRef = laneObject.flowNodeRef.filter((flowObj) => flowObj.id !== taskObject.id);
      }
    }
    lanes = lanes.filter(lane => {
      if (lane.flowNodeRef != null) {
        return lane.flowNodeRef.length > 0;
      } else {
        // Wenn flowNodeRef == null, dann ist die Lane erst hinzugefügt worden und darf nicht gelöscht werden, da im nächsten Schritt die Tasks hinzugefügt werden
        return false;
      }
    });
  }

  private addTaskToLane(processId: string, laneId: string, taskObject: Bpmn.BaseElement): void {
    // Task objekt wieder zur neuen rolle hinzufügen
    // process in lane einfügen // ID von selected Role in der UI entspricht der LaneID
    if (laneId != null) {
      const laneObject = this.getProcessLane(processId, laneId);
      if (laneObject.flowNodeRef == null) {
        laneObject.flowNodeRef = [];
      }

      if (!laneObject.flowNodeRef.includes(taskObject)) {
        laneObject.flowNodeRef.push(taskObject);
      }
    }
  }

  private setRoleForTask(processId: string, laneId: string, taskObject: Bpmn.BaseElement): void {
    // LaneId wird mitgegeben, dass eine leere Lane nicht gelöscht wird
    this.removeTaskObjectFromLanes(processId, taskObject);
    this.addTaskToLane(processId, laneId, taskObject);
  }

  private removeTaskFromContext(taskId: string): void {
    const processContext = this.getProcess(this.processId());

    for (let index = 0; index < processContext.flowElements.length; index++) {
      const element = processContext.flowElements[index];
      if (element.id === taskId) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }
  }

  private removeElementWithAllReferences(objectId: string): { objectIdsWithMissingSource: string[]; objectIdsWithMissingTarget: string[] } {
    const objectIdsWithMissingTarget: string[] = [];
    const objectIdsWithMissingSource: string[] = [];
    this.getSequenceFlowElements().forEach(sf => {
      // Remove SF's where target is delete Object
      if (sf.targetRef.id === objectId) {
        this.removeSequenceFlow(this.processId(), sf);
        objectIdsWithMissingTarget.push(sf.sourceRef.id);
      }

      // Remove SF's where source is delete Object
      if (sf.sourceRef.id === objectId) {
        this.removeSequenceFlow(this.processId(), sf);
        objectIdsWithMissingSource.push(sf.targetRef.id);
      }
    });

    return { objectIdsWithMissingTarget: objectIdsWithMissingTarget, objectIdsWithMissingSource: objectIdsWithMissingSource };
  }

  // Löscht einen Task aus dem XML und dem Diagramm
  public deleteTask(processId: string, rowDetails: RowDetails[], rowNumber: number): void {
    // Let allgateways = this.removeAllGateways(rowDetails, true);

    // Auch hier wird nach folgendem Beispiel vorgegangen
    // A -[AB]-> B -[BC]-> C
    // B wird gelöscht und dann soll folgendes übrig bleiben: A -[A(B)C]-> C
    // Hierbei wird die ausgehende Verbindung modifiziert und die eingehende ebenfalls gelöscht
    // 1. [AB] löschen
    // 2. B löschen
    // 3. [BC] bekommt als sourceRef A
    // 4. A bekommt als outgoing [BC]
    const delTaskId = rowDetails[rowNumber].taskId;

    const res = this.removeElementWithAllReferences(delTaskId);

    const objToDelete = this.getExistingTask(this.processId(), delTaskId);
    if (objToDelete != null) {
      this.removeTaskObjectFromLanes(this.processId(), objToDelete);
    }

    this.removeTaskFromContext(delTaskId);

    for (const sourceId of res.objectIdsWithMissingTarget) {
      const sourceObj = this.getExistingActivityObject(sourceId);

      for (const targetId of res.objectIdsWithMissingSource) {
        let targetObj = this.getExistingActivityObject(targetId);

        // Special case for start events on the left
        if (rowNumber === 1 && targetObj.$type === "bpmn:ExclusiveGateway") {
          // Remove gateway and all sfs
          this.removeElementWithAllReferences(targetObj.id);
          // Next or end element
          const newTargetId = rowDetails[(rowNumber + 1)] != null ? rowDetails[(rowNumber + 1)].taskId : this.getEndEvents(this.processId())[0].id;
          targetObj = this.getExistingActivityObject(newTargetId);

          res.objectIdsWithMissingSource = res.objectIdsWithMissingSource.filter(obj => obj !== targetId);
          res.objectIdsWithMissingSource.push(targetObj.id);
          this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);

        } else {
          this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);
        }
      }
    }


    /* NextObjects.forEach(nextObject => {
      this.addSequenceFlow(this.processId(), this.getExistingActivityObject(rowDetails[(rowNumber - 1)].taskId), nextObject, false);
    });*/

    /*
        isTrue(rowNumber > 0, "called rownumber have to be bigger than 0");
        let objectToDelete_A: Bpmn.FlowNode  = this.getExistingTask(processId, rowDetails[(rowNumber - 1)].taskId);

        if (rowDetails.length > (rowNumber + 1)) {
          nextObject = this.getExistingTask(processId, rowDetails[(rowNumber + 1)].taskId);
        } else {
          nextObject = this.getEndEvents(processId)[0];
        }

        let objectToDelete_B = this.getExistingTask(processId, rowDetails[rowNumber].taskId);
        // isTrue(objectToDelete_B.incoming.length == 1, "SequenceFlow Länge muss hier 1 sein!");
        let sequenceFlows_AB: Bpmn.SequenceFlow[] = objectToDelete_B.incoming; // .find(inc => inc.sourceRef.id === objectToDelete_A.id && inc.targetRef.id === objectToDelete_B.id); // [0];
        // isTrue(objectToDelete_B.outgoing.length == 1, "SequenceFlow Länge muss hier 1 sein!");
        let sequenceFlow_BC: Bpmn.SequenceFlow = objectToDelete_B.outgoing.find(out => out.sourceRef.id === objectToDelete_B.id && out.targetRef.id === nextObject.id); // [0];

        let sequenceFlows_BC_to_delete: Bpmn.SequenceFlow[] = objectToDelete_B.outgoing.filter(out => out.targetRef.id !== nextObject.id); // [0];

        objectToDelete_B.outgoing.forEach(out => {
          if (out.targetRef.id !== nextObject.id) {
            out.targetRef.incoming = out.targetRef.incoming.filter(inc => inc.sourceRef.id !== objectToDelete_B.id);
          }
        });
        objectToDelete_B.incoming.forEach(inc => inc.sourceRef.outgoing = inc.sourceRef.outgoing.filter(out => out.targetRef.id !== objectToDelete_B.id));

        // 1. & 2. Elemente aus flowElements löschen
        for (let index = 0; index < processContext.flowElements.length; index++) {
          let element = processContext.flowElements[index];
          if (sequenceFlows_AB.find(sf => sf.id === element.id) != null
            || sequenceFlows_BC_to_delete.find(sf => sf.id === element.id) != null
            || element.id === objectToDelete_B.id) {
            processContext.flowElements.splice(index, 1);
            index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
          }
        }
        // 3.
        isTrue(objectToDelete_A != null);
        sequenceFlow_BC.sourceRef = objectToDelete_A;

        // 4.
        // Array zuerst leeren! Da hier nur ein Element im Array sein darf!
        // objectToDelete_A.outgoing = [];
        objectToDelete_A.outgoing = objectToDelete_A.outgoing.filter(out => out.sourceRef.id !== objectToDelete_A.id && out.targetRef.id !== objectToDelete_B.id);
        objectToDelete_A.outgoing.push(sequenceFlow_BC);

        // isTrue(objectToDelete_A.outgoing.length === 1, "A darf hier nur einen outgoing Flow haben!");

        // Task aus lane entfernen
        let processLanes: Bpmn.Lane[] = this.getProcessLanes(processId);
        for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
          let processLane: Bpmn.Lane = processLanes[laneIndex];
          if (processLane.flowNodeRef != null) {
            for (let index = 0; index < processLane.flowNodeRef.length; index++) {
              let flowNode: Bpmn.FlowNode = processLane.flowNodeRef[index];
              if (flowNode.id === rowDetails[rowNumber].taskId) {
                processLane.flowNodeRef.splice(index, 1);
                index--; // Wegen splicen
              }
            }
          }
        }
        this.putGatewaysBack(allgateways);

        let tmpRowDetails: RowDetails[] = JSON.parse(JSON.stringify(rowDetails));
        tmpRowDetails.splice(rowNumber, 1);
    */
    const tmpRowDetails: RowDetails[] = JSON.parse(JSON.stringify(rowDetails));
    tmpRowDetails.splice(rowNumber, 1);
    this.processDiagram.generateBPMNDiagram(processId, tmpRowDetails);
  }

  public convertTaskType(rows: RowDetails[], changedTaskIdx: number): string {

    const oldTaskId: string = rows[changedTaskIdx].taskId;
    const oldTask: Bpmn.Task = this.getExistingTask(this.processId(), oldTaskId);
    const savedIncoming = oldTask.incoming;
    const savedOutgoing = oldTask.outgoing;

    const processContext: Bpmn.Process = this.getProcess(this.processId());

    // Delete old task from flowelements
    for (let index = 0; index < processContext.flowElements.length; index++) {
      const element = processContext.flowElements[index];
      if (element.id === oldTask.id) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }

    // Task aus lane entfernen
    const processLanes: Bpmn.Lane[] = this.getProcessLanes(this.processId());

    for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
      const processLane: Bpmn.Lane = processLanes[laneIndex];
      if (processLane.flowNodeRef != null) {
        for (let index = 0; index < processLane.flowNodeRef.length; index++) {
          const flowNode: Bpmn.FlowNode = processLane.flowNodeRef[index];
          if (flowNode.id === oldTask.id) {
            processLane.flowNodeRef.splice(index, 1);
            index--; // Wegen splicen
          }
        }
      }
    }

    // Standard convert to send task change on switch back
    const convertToType: "bpmn:SendTask" | "bpmn:UserTask" = rows[changedTaskIdx].taskType as "bpmn:SendTask" | "bpmn:UserTask";

    let focusedTask = null;

    rows[changedTaskIdx].taskId = BpmnProcess.getBpmnId(convertToType);

    if (convertToType === "bpmn:SendTask") {
      focusedTask = bpmnModdleInstance.create("bpmn:SendTask", { id: rows[changedTaskIdx].taskId, name: rows[changedTaskIdx].task, incoming: [], outgoing: [] });
    } else if (convertToType === "bpmn:UserTask") {
      focusedTask = bpmnModdleInstance.create("bpmn:UserTask", { id: rows[changedTaskIdx].taskId, name: rows[changedTaskIdx].task, incoming: [], outgoing: [] });
    }

    if (focusedTask == null) {
      throw new Error("Error on converting task to different type.");
    }


    for (const inc of savedIncoming) {
      inc.targetRef = focusedTask;
    }
    for (const out of savedOutgoing) {
      out.sourceRef = focusedTask;
    }


    focusedTask.outgoing = savedOutgoing;
    focusedTask.incoming = savedIncoming;

    processContext.flowElements.push(focusedTask);

    this.addTaskToLane(this.processId(), rows[changedTaskIdx].laneId, focusedTask);

    // This.setRoleForTask(this.processId(), rowDetails.laneId, focusedTask);

    this.processDiagram.generateBPMNDiagram(this.processId(), rows);

    // Replace all jumpsTo with the id of the new task
    for (const row of rows) {
      if (row.jumpsTo.find(j => j === oldTaskId)) {
        row.jumpsTo = row.jumpsTo.filter(j => j !== oldTaskId);
        row.jumpsTo.push(rows[changedTaskIdx].taskId);
      }
    }

    return rows[changedTaskIdx].taskId;
  }

  public addFlowToNode(taskFromObject: RowDetails, targetBpmnTaskId: string, rowDetails: RowDetails[], renderDiagram = true): void {

    const focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), taskFromObject.taskId);
    const targetTask: Bpmn.Task = this.getExistingTask(this.processId(), targetBpmnTaskId);

    // Add gateway
    if (focusedTask.outgoing.length > 0) {
      const existingOutgoings = focusedTask.outgoing;
      if (existingOutgoings.length === 1 && existingOutgoings.last().targetRef.$type === "bpmn:ExclusiveGateway") {
        this.addSequenceFlow(this.processId(), existingOutgoings.last().targetRef, targetTask, false);

      } else {
        focusedTask.outgoing = [];
        const processContext: Bpmn.Process = this.getProcess(this.processId());
        const newGateway = bpmnModdleInstance.create("bpmn:ExclusiveGateway", { id: "ExclusiveGateway_" + createId(), name: "", incoming: [], outgoing: [] });
        processContext.flowElements.push(newGateway);

        this.addSequenceFlow(this.processId(), focusedTask, newGateway, false);

        for (const out of existingOutgoings) {
          this.addSequenceFlow(this.processId(), newGateway, out.targetRef, false);
          this.removeSequenceFlow(this.processId(), out);
        }
        if (newGateway.outgoing.find(out => out.targetRef.id === targetTask.id) == null) {
          this.addSequenceFlow(this.processId(), newGateway, targetTask, false);
        }

        this.setRoleForTask(this.processId(), taskFromObject.laneId, newGateway);
      }

    } else {
      this.addSequenceFlow(this.processId(), focusedTask, targetTask, false);
    }
    if (renderDiagram) {
      this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
    }
  }

  public removeSequenceFlowFromJumpsTo(rowDetails: RowDetails[], rowNumber: number, targetBpmnTaskId: string): void {
    const focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), rowDetails[rowNumber].taskId);

    const sfObj = focusedTask.outgoing.find(out => out.targetRef.id === targetBpmnTaskId || out.targetRef.$type === "bpmn:ExclusiveGateway");
    if (sfObj.targetRef.$type === "bpmn:ExclusiveGateway") {
      const process: Bpmn.Process = this.getProcess(this.processId());
      const gateway = sfObj.targetRef;

      const gatSequenceFlows: Bpmn.FlowElement[] = process.flowElements.filter(el => gateway.outgoing.find(e => e.id === el.id) != null);

      const allSequenceFlows = this.getSequenceFlowElements();
      gatSequenceFlows.forEach(sf => {
        const sfElem = allSequenceFlows.find(s => s.id === sf.id);
        sfElem.targetRef.incoming = sfElem.targetRef.incoming.filter(fil => gateway.outgoing.find(out => out.id === fil.id) == null);
      });
      focusedTask.outgoing = focusedTask.outgoing.filter(out => out.targetRef.id !== gateway.id);
      // Process.flowElements = process.flowElements.filter(el =>  .find(e => e.id === el.id) == null);

      // del gate from flowElements

      process.flowElements = process.flowElements.filter(el => el.id !== gateway.id);
      process.laneSets.forEach(lane => lane.lanes.forEach(l => l.flowNodeRef = l.flowNodeRef.filter(fil => fil.id !== gateway.id)));
      process.flowElements = process.flowElements.filter(el => gateway.outgoing.find(e => e.id === el.id) == null);

      if (rowDetails[rowNumber].jumpsTo.length > 0) {
        let firstProcess = true;
        rowDetails[rowNumber].jumpsTo.forEach(jumpToId => {
          if (targetBpmnTaskId !== jumpToId) {
            const nextTask = this.getExistingActivityObject(jumpToId);

            if (firstProcess) {
              this.addSequenceFlow(this.processId(), focusedTask, nextTask, false);
              firstProcess = false;
            } else {
              this.addFlowToNode(rowDetails[rowNumber], jumpToId, rowDetails, false);
            }
          }
        });
        // Process.flowElements.forEach(el => console.log(el.id + " in " + (el as Bpmn.FlowNode).incoming.length + " ____  out " + (el as Bpmn.FlowNode).outgoing.length));

        // let nextTask: Bpmn.FlowNode = (rowNumber + 1) == rowDetails.length ? this.getEndEvents(this.processId())[0] : this.getExistingTask(this.processId(), rowDetails[rowNumber + 1].taskId) as Bpmn.Task;


      }
    }
    isTrue(sfObj != null, "removing object is missing.");
    this.removeSequenceFlow(this.processId(), sfObj);

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public addTimerStartEvent(rowDetails: RowDetails[]): void {
    this.addStartEventOfType(rowDetails, "bpmn:TimerEventDefinition");
  }

  public removeTimerStartEvent(rowDetails: RowDetails[]): void {
    this.removeStartEventOfType(rowDetails, "bpmn:TimerEventDefinition");
  }

  public addMailStartEvent(rowDetails: RowDetails[]): void {
    this.addStartEventOfType(rowDetails, "bpmn:MessageEventDefinition");
  }

  public removeMailStartEvent(rowDetails: RowDetails[]): void {
    this.removeStartEventOfType(rowDetails, "bpmn:MessageEventDefinition");
  }

  private addStartEventOfType(rowDetails: RowDetails[], type: ("bpmn:TimerEventDefinition" | "bpmn:MessageEventDefinition")): void {
    if (this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === type) != null) == null) {
      const start = this.getStartEvents(this.processId()).last();
      const targetTask = start.outgoing.last().targetRef;
      const processContext: Bpmn.Process = this.getProcess(this.processId());
      const startEventObject = bpmnModdleInstance.create("bpmn:StartEvent", { id: BpmnProcess.getBpmnId("bpmn:StartEvent"), outgoing: [], incoming: [] });
      const eventDef = type === "bpmn:TimerEventDefinition" ? bpmnModdleInstance.create(type as "bpmn:TimerEventDefinition", { timeDuration: bpmnModdleInstance.create("bpmn:FormalExpression", { body: "PT0S" }) }) : bpmnModdleInstance.create(type as "bpmn:MessageEventDefinition", {});

      startEventObject.eventDefinitions = [eventDef];
      this.addSequenceFlow(this.processId(), startEventObject, targetTask, false);
      processContext.flowElements.push(startEventObject);

      const lane = this.getLaneOfFlowNode(start.id);
      this.addTaskToLane(this.processId(), lane.id, startEventObject);
      this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
    }
  }

  private removeStartEventOfType(rowDetails: RowDetails[], type: ("bpmn:TimerEventDefinition" | "bpmn:MessageEventDefinition")): void {
    const processContext = this.getProcess(this.processId());

    const messageStartEvent = this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(event => event.$type === type) != null);
    this.removeSequenceFlow(this.processId(), messageStartEvent.outgoing.last());

    const row = rowDetails.find(row => row.taskId === messageStartEvent.id);
    if (row != null) {
      const otherStart = this.getStartEvents(this.processId()).last();
      row.taskId = otherStart.id;
    }

    processContext.flowElements = processContext.flowElements.filter(elem => elem.id !== messageStartEvent.id);

    this.removeTaskObjectFromLanes(this.processId(), messageStartEvent);
    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public addTaskBetween(rowDetails: RowDetails[], focusedRowNumber: number): void {
    // Important to refresh rowdetails with new TaskId
    const newTaskRowDetails = rowDetails[focusedRowNumber];
    let id: string;
    if (newTaskRowDetails.taskId == null) {
      id = BpmnProcess.getBpmnId("bpmn:UserTask");
      newTaskRowDetails.taskId = id;
    }

    let focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), newTaskRowDetails.taskId);
    const processContext: Bpmn.Process = this.getProcess(this.processId());

    if (focusedTask == null) {
      focusedTask = bpmnModdleInstance.create(newTaskRowDetails.taskType as "bpmn:UserTask", { id: newTaskRowDetails.taskId, name: newTaskRowDetails.task, incoming: [], outgoing: [] });
      processContext.flowElements.push(focusedTask);
    }

    this.setRoleForTask(this.processId(), newTaskRowDetails.laneId, focusedTask);

    // PREV object
    let previousElements: Bpmn.Activity[] = [];

    if (focusedRowNumber === 1) {
      previousElements = this.getStartEvents(this.processId());
    } else {
      previousElements = [this.getExistingActivityObject(rowDetails[focusedRowNumber - 1].taskId)];
    }

    // TARGET object
    const targetElement = this.getExistingActivityObject(rowDetails[focusedRowNumber].taskId);

    // NEXT object
    let nextElement: Bpmn.Activity = null;
    if (rowDetails[focusedRowNumber + 1] == null) {
      nextElement = this.getEndEvents(this.processId()).last();
    } else {
      nextElement = this.getExistingActivityObject(rowDetails[focusedRowNumber + 1].taskId);
    }

    let targetRefsOfPrev: string[] = [];
    previousElements != null ? previousElements.forEach(start => {
      targetRefsOfPrev = targetRefsOfPrev.concat(start.outgoing.map(out => out.targetRef.id));
    }) : null;
    const targetRefsOfPrevUnique: any = [];
    targetRefsOfPrev.forEach(item => {
      if (targetRefsOfPrevUnique.indexOf(item) === -1) {
        targetRefsOfPrevUnique.push(item);
      }
    });


    // Remove all outgoings from previous
    if (previousElements != null) {
      previousElements.forEach(previousElement => {
        previousElement.outgoing.forEach(out => {
          this.removeSequenceFlow(this.processId(), out);
        });

        const sfObj = this.getSequenceFlowElements().find(sf => sf.sourceRef.id === previousElement.id && sf.targetRef.id === nextElement.id);
        this.removeSequenceFlow(this.processId(), sfObj);
        this.addSequenceFlow(this.processId(), previousElement, targetElement, true);
      });
    }

    for (const targetRefId of targetRefsOfPrevUnique) {
      const tmpTargetElement = this.getExistingActivityObject(targetRefId);
      this.addSequenceFlow(this.processId(), targetElement, tmpTargetElement, false);
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  private addSequenceFlow(processId: string, sourceReference: Bpmn.FlowNode, targetReference: Bpmn.FlowNode, deleteExistingRefs = true): Bpmn.SequenceFlow {
    const processContext = this.getProcess(processId);
    // Weiteren Sequenzfluss einfügen
    const id = BpmnProcess.getBpmnId("bpmn:SequenceFlow");
    const sequenceFlow = bpmnModdleInstance.create("bpmn:SequenceFlow", { id: id, targetRef: targetReference, sourceRef: sourceReference });

    processContext.flowElements.push(sequenceFlow);

    if (sourceReference.$type === "bpmn:StartEvent") {
      // IsTrue(sourceReference.outgoing.length == 1, "Das Start EVENT darf nur 1 Verbindung (outgoing) haben!" + sourceReference.outgoing.length);
    }
    if (deleteExistingRefs)
      sourceReference.outgoing.splice(0, 1);
    if (targetReference.$type === "bpmn:EndEvent") {
      // IsTrue(targetReference.incoming.length == 1, "Das End EVENT darf nur 1 Verbindung (incoming) haben! " + targetReference.incoming.length);
    }
    if (deleteExistingRefs)
      targetReference.incoming.splice(0, 1);

    targetReference.incoming.push(sequenceFlow);
    sourceReference.outgoing.push(sequenceFlow);

    return sequenceFlow;
  }

  public async toXmlString(): Promise<string> {

    this.removeLanesWithoutShape();

    return await new Promise<string>((resolve, reject): void => {
      bpmnModdleInstance.toXML(this.bpmnXml, { format: true }, function (err: any, xmlStr: string) {
        if (err) reject(err);
        resolve(xmlStr);
      });
    }).catch((reason) => {
      console.log(reason);
      return null;
    });
  }

  //  Diagramm Komponente
  // Gibt die notwendigen Elemente für die Erstellung des Diagram-Pars im XML zurück
  public getCollaborationElements(): Bpmn.Collaboration[] {
    const elements = this.bpmnXml.rootElements.filter((e: any) => e.$type === "bpmn:Collaboration") as Bpmn.Collaboration[];
    return elements;
  }

  public getSortedLanesWithTasks(processId: string): Bpmn.Lane[] {
    const laneElementsList: Bpmn.Lane[] = this.getLanes(true);

    const sortedLaneElementsList: Bpmn.Lane[] = [];

    // Include start element
    const sortedTaskIds: string[] = [this.getStartEvents(processId)[0].id];
    this.getSortedTasks(processId).map(t => sortedTaskIds.push(t.id));

    let laneOfLastTask: any;

    for (const taskId of sortedTaskIds) {
      for (const laneElement of laneElementsList) {
        for (const flowNodeRefObject of laneElement.flowNodeRef) {
          if (taskId === flowNodeRefObject.id) {
            // Wird hier zwischen gespeichert, dass das end event hinter dem letzten element kommt
            laneOfLastTask = laneElement;
            if (sortedLaneElementsList.includes(laneElement)) {
              // Console.log("Already in sorted Lanelist.");
            } else {
              sortedLaneElementsList.push(laneElement);
            }
          }
        }
      }
    }

    // Start und Ende aus Lanes entfernen und dann neu hinzufügen
    this.removeTaskObjectFromLanes(processId, this.getStartEvents(processId)[0]);
    this.removeTaskObjectFromLanes(processId, this.getEndEvents(processId)[0]);

    let laneOfStartEvent: Bpmn.Lane = null;
    let laneOfEndEvent: Bpmn.Lane = null;

    if (sortedLaneElementsList.length === 0) {
      const allLanes: Bpmn.Lane[] = this.getLanes(false);
      if (allLanes.length > 0) {
        laneOfStartEvent = allLanes[0];
        laneOfEndEvent = allLanes[0];
      }
    } else {
      laneOfStartEvent = sortedLaneElementsList[0];
      laneOfEndEvent = laneOfLastTask;
    }

    if (laneOfStartEvent != null)
      this.addTaskToLane(processId, laneOfStartEvent.id, this.getStartEvents(processId)[0]);
    if (laneOfEndEvent != null)
      this.addTaskToLane(processId, laneOfEndEvent.id, this.getEndEvents(processId)[0]);

    return sortedLaneElementsList;
  }

  /**
   * Gets the lane
   * @param laneId lane id
   * @return {Bpmn.Lane} the lane or undefined, if not found
   */
  public getLane(laneId: string): Bpmn.Lane {
    const lanes: Bpmn.Lane[] = this.getLanes(false);
    return lanes.find(l => l.id === laneId);
  }

  /**
   * Gets the lanes of the process
   * @param onlyLanesWithTasks if true, only lanes containing a task are returned
   * @return {Bpmn.Lane[]} the lanes of the process - if onlyLanesWithTasks is true, only the lanes containing a task are returned
   */
  public getLanes(onlyLanesWithTasks: boolean): Bpmn.Lane[] {
    let laneElementsList: Bpmn.Lane[] = [];
    const processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e: any) => e.$type === "bpmn:Process") as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      const laneSetElements: Bpmn.LaneSet[] = processes[i].laneSets.filter((e: any) => e.$type === "bpmn:LaneSet");
      for (let t = 0; t < laneSetElements.length; t++) {

        if (laneSetElements[t].lanes != null) {
          laneElementsList = laneSetElements[t].lanes.filter(lane => {
            if (onlyLanesWithTasks) {
              if (lane.flowNodeRef != null && lane.flowNodeRef.length > 0) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          });
        }
      }
    }

    return laneElementsList;
  }

  public getLaneOfFlowNode(flowNodeId: string): Bpmn.Lane {
    let laneElement: Bpmn.Lane = null;
    const processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e: any) => e.$type === "bpmn:Process") as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      const laneSetElements: Bpmn.LaneSet[] = processes[i].laneSets.filter((e: any) => e.$type === "bpmn:LaneSet");
      for (let t = 0; t < laneSetElements.length; t++) {

        if (laneSetElements[t].lanes != null) {
          laneElement = laneSetElements[t].lanes.find(lane => {
            if (lane.flowNodeRef != null) {
              const flowObj = lane.flowNodeRef.find(fo => fo.id === flowNodeId);
              if (flowObj != null)
                return true;
            }
            return false;
          });
        }
      }
    }
    return laneElement;
  }

  /**
   * Gets the lane ids containing a start event
   * @return {string[]} the ids of the lanes containig a start event
   */
  public getStartLaneIds(): string[] {
    const laneIds: string[] = [];

    const startEvents: Bpmn.StartEvent[] = this.getStartEvents(this.processId());
    if (startEvents) {
      for (const startEvent of startEvents) {
        const startLane: Bpmn.Lane = this.getLaneOfFlowNode(startEvent.id);
        if (startLane != null) {
          laneIds.push(startLane.id);
        }
      }
    }

    return laneIds;
  }

  public getSortedTasks(processId: string, ignoreSendTasks = false): Bpmn.Task[] {
    const types: Bpmn.ElementType[] = ["bpmn:UserTask", "bpmn:ServiceTask", "bpmn:ScriptTask"];
    if (!ignoreSendTasks) {
      types.push("bpmn:SendTask");
    }
    return this.getSortedActivities(processId, types) as Bpmn.Task[];
  }

  public getSortedActivities(processId: string, types: Bpmn.ElementType[]): Bpmn.Activity[] {
    const startEvents: Bpmn.StartEvent[] = this.getStartEvents(processId);
    if (startEvents == null || startEvents.length === 0) {
      return [];  // Process definition is not correct, but function should be fault tolerant
    }

    const sortedTasks: Bpmn.Task[] = [];

    const flowNodeQueue: Bpmn.FlowNode[] = [];
    startEvents.forEach(s => flowNodeQueue.push(s));

    const checkedFlowNodes: Bpmn.FlowNode[] = [];

    while (flowNodeQueue.length) {
      const curElem: Bpmn.FlowNode = flowNodeQueue.shift();

      if (checkedFlowNodes.find(s => s.id === curElem.id) == null) {
        if (types.includes(curElem.$type)) {
          sortedTasks.push(curElem as Bpmn.Task);
        }

        if (curElem.outgoing && curElem.outgoing.length) {
          curElem.outgoing.forEach(o => {
            if (o) {
              flowNodeQueue.push(o.targetRef);
            }
          });
        }
        checkedFlowNodes.push(curElem);
      }
    }

    // Nochmals alle Activities iterieren und fehlende anfügen
    for (const type of types) {
      const tasks = this.getEvents(processId, type);
      if (tasks != null) {
        tasks.map(task => {
          if (sortedTasks.find(e => e.id === task.id) == null) {
            sortedTasks.push(task as Bpmn.Task);
          }
        });
      }
    }

    return sortedTasks;
  }

  private getFlowElementsOfTypes<T extends Bpmn.BaseElement>(types: Bpmn.bpmnType[]): T[] {
    let res: T[] = [];
    for (const type of types) {
      res = res.concat(this.getFlowElementsOfType<T>(type));
    }
    return res;
  }

  private getFlowElementsOfType<T extends Bpmn.BaseElement>(type: Bpmn.bpmnType): T[] {
    const elements: T[] = [];
    const processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e) => e.$type === "bpmn:Process") as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      if (processes[i].flowElements) {
        const flowElements: Bpmn.FlowElement[] = processes[i].flowElements.filter((e) => {
          return e.$type === type;
        });
        // Jeder SeqenceFlow soll direkt in der Liste sein
        for (let i = 0; i < flowElements.length; i++) {
          const element = flowElements[i] as T;
          elements.push(element);
        }
      }
    }

    return elements;
  }

  public getAllSubprocesses(): Bpmn.FlowElement[] {
    return this.getFlowElementsOfType<Bpmn.FlowElement>("bpmn:SubProcess");
  }

  public getAllBpmnObjects(): Bpmn.FlowElement[] {
    return this.getFlowElementsOfTypes<Bpmn.FlowElement>(["bpmn:StartEvent", "bpmn:UserTask", "bpmn:SendTask", "bpmn:IntermediateCatchEvent", "bpmn:SubProcess", "bpmn:ExclusiveGateway", "bpmn:ParallelGateway", "bpmn:SequenceFlow", "bpmn:EndEvent"]);
  }

  public getSequenceFlowElements(): Bpmn.SequenceFlow[] {
    return this.getFlowElementsOfType<Bpmn.SequenceFlow>("bpmn:SequenceFlow");
  }

  public getFollowingSequenceFlowName(bpmnTaskId: string): string {
    const taskObj = this.getExistingActivityObject(bpmnTaskId);
    // Fix for multiple outgoings at the moment or no outgoings
    if (taskObj == null || taskObj.outgoing == null || taskObj.outgoing.length > 1) {
      return null;
    }
    // Sure that taskObj has only 1 outgoing
    const seqFlow = taskObj.outgoing[taskObj.outgoing.length - 1];
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) // Ignore empty flow names
      return seqFlow.name;
    else
      return null;
  }

  public getPreviousSequenceFlowName(bpmnTaskId: string, sharedSourceElementId: string): string {
    const taskObj = this.getExistingActivityObject(bpmnTaskId);
    // Sure that taskObj has only 1 outgoing
    const seqFlow = taskObj.incoming.find(sf => sf.sourceRef.id === sharedSourceElementId);
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) // Ignore empty flow names
      return seqFlow.name;
    else
      return null;
  }

  public getSharedOutgoingElementId(taskIds: string[]): string {
    const map: any = {};
    taskIds.forEach(taskId => {
      const obj = this.getExistingActivityObject(taskId);
      obj.incoming.forEach(inc => {
        if (map[inc.sourceRef.id] != null) {
          map[inc.sourceRef.id]++;
        } else {
          map[inc.sourceRef.id] = 1;
        }
      });
    });

    let biggestKey = null;
    let biggestLength = 0;
    for (const key in map) {
      if (biggestLength < map[key]) {
        biggestKey = key;
        biggestLength = map[key];
      }
    }

    return biggestKey;
  }

  public getLaneNumberOfElement(element: Bpmn.FlowNode, laneDictionaries: LaneDictionary[]): number {
    for (const laneDictionary of laneDictionaries) {
      const index: number = laneDictionary.ObjectIdsInLane.indexOf(element.id);
      if (index > -1) {
        return laneDictionary.rowNumber;
      }
    }
    return null;
  }

  public checkCompatibilityOfChangedProcess(runningInstances: InstanceDetails[], userInstances: InstanceDetails[]): boolean {

    let actualRunningTasks: RunningTaskLane[] = [];
    for (const runInstance of runningInstances) {
      const todos = filterTodosForInstance(userInstances, runInstance.instanceId);
      const value = todos.map((t): RunningTaskLane => {
        return { bpmnLaneId: t.bpmnLaneId, bpmnTaskId: t.bpmnTaskId } as RunningTaskLane;
      });
      actualRunningTasks = actualRunningTasks.concat(value);
    }

    let allTasksAndLanesAreThere = true;

    for (const runningTask of actualRunningTasks) {
      const taskOrGateway = this.getExistingActivityObject(runningTask.bpmnTaskId);
      const tmpLaneObj = this.getLaneOfFlowNode(runningTask.bpmnTaskId);
      if (taskOrGateway == null || tmpLaneObj == null || runningTask.bpmnLaneId !== tmpLaneObj.id) {
        allTasksAndLanesAreThere = false;
        break;
      }
    }

    return allTasksAndLanesAreThere;
  }


  public getDecisionTasksForTask(bpmnTaskId: string): DecisionTask[] {
    let decisionTasks: DecisionTask[] = [];

    const processObject = this.getExistingActivityObject(bpmnTaskId);

    if (processObject != null && processObject.$type === "bpmn:ExclusiveGateway") {
      return this.getTaskIdsAfterGateway(bpmnTaskId);
    }

    if (this.isOneOfNextActivityOfType(bpmnTaskId, "bpmn:ExclusiveGateway")) {
      // TaskTitle = todo != null ? todo.displayName : tl("Entscheidung");
      const nextActivites = this.getNextActivities(bpmnTaskId);

      for (const tmp of nextActivites) {
        if (tmp.$type === "bpmn:ExclusiveGateway") {
          const list = this.getTaskIdsAfterGateway(tmp.id);
          decisionTasks = decisionTasks.concat(list);
        }
      }
    }

    return decisionTasks;
  }

  public hasMessageBoundaryEvent(bpmnTaskId: string): boolean {
    return this.hasBoundaryEventOfType(bpmnTaskId, "bpmn:MessageEventDefinition");
  }

  public hasTimerBoundaryEvent(bpmnTaskId: string): boolean {
    return this.hasBoundaryEventOfType(bpmnTaskId, "bpmn:TimerEventDefinition");
  }

  private hasBoundaryEventOfType(bpmnTaskId: string, type: string): boolean {
    const taskObject = this.getExistingActivityObject(bpmnTaskId);
    if (taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      const obj = taskObject.boundaryEventRefs.find(b => b.eventDefinitions.find(ed => ed.$type === type) != null);
      return obj != null;
    }
    return false;
  }

  public hasMessageEventDefinition(bpmnTaskId: string): boolean {
    return this.hasEventDefinitionOfType(bpmnTaskId, "bpmn:MessageEventDefinition");
  }

  public hasTimerEventDefinition(bpmnTaskId: string): boolean {
    return this.hasEventDefinitionOfType(bpmnTaskId, "bpmn:TimerEventDefinition");
  }

  private hasEventDefinitionOfType(bpmnTaskId: string, type: string): boolean {
    const flowElements = this.getEvents(this.processId(), "bpmn:IntermediateCatchEvent");
    const obj = flowElements.find(f => f.id === bpmnTaskId);
    if (obj != null) {
      const event = (obj as Bpmn.IntermediateCatchEvent);
      if (event.eventDefinitions != null && event.eventDefinitions.length > 0) {
        const def = event.eventDefinitions.find(def => def.$type === type);
        return def != null;
      }
    }
    return false;
  }

  public getIntermediateCatchEvent(bpmnTaskId: string, type: string): Bpmn.BaseElement {
    const flowElements = this.getEvents(this.processId(), "bpmn:IntermediateCatchEvent");
    const obj = flowElements.find(f => f.id === bpmnTaskId);
    if (obj != null) {
      const event = (obj as Bpmn.IntermediateCatchEvent);
      if (event.eventDefinitions != null && event.eventDefinitions.length > 0) {
        const def = event.eventDefinitions.find(def => def.$type === type);
        return def;
      }
    }
    return null;
  }

  public getBoundaryDecisionTasksForTask(bpmnTaskId: string): DecisionTask[] {
    const boundaryDecisionTask: DecisionTask[] = [];
    const taskObject = this.getExistingActivityObject(bpmnTaskId);

    if (taskObject != null && taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      for (const tmpBoundary of taskObject.boundaryEventRefs) {
        boundaryDecisionTask.push({
          bpmnTaskId: tmpBoundary.id,
          name: tmpBoundary.name,
          isBoundaryEvent: true,
          type: DecisionTaskTypes.Boundary,
          boundaryEventType: tmpBoundary.eventDefinitions[tmpBoundary.eventDefinitions.length - 1].$type
        } as DecisionTask);
      }
    }

    return boundaryDecisionTask;
  }

  private removeLanesWithoutShape(): void {
    const process: Bpmn.Process = this.getProcess(this.processId());
    const diagram = this.bpmnXml.diagrams[0];
    const laneSet = process.laneSets[0];

    laneSet.lanes = laneSet.lanes.filter(lane => {
      for (const planeElement of diagram.plane.planeElement) {
        if (planeElement.$type === "bpmndi:BPMNShape") {
          const bpmndiBPMNShape: Bpmndi.BPMNShape = planeElement as Bpmndi.BPMNShape;
          if (bpmndiBPMNShape.bpmnElement && bpmndiBPMNShape.bpmnElement.id === lane.id) {
            return true;
          }
        }
      }
      return false;
    });
  }

  public setFlowName(sourceTaskId: string, targetTaskId: string, name: string): void {
    const obj = this.getFlowObject(sourceTaskId, targetTaskId);
    obj.name = name;
  }

  public getFlowName(sourceTaskId: string, targetTaskId: string): string {
    const flowObj = this.getFlowObject(sourceTaskId, targetTaskId);
    if (flowObj != null) {
      return flowObj.name;
    }
    return null;
  }

  private getFlowObject(sourceTaskId: string, targetTaskId: string): Bpmn.FlowElement {
    const sourceTask = this.getExistingActivityObject(sourceTaskId);
    let targetObj = null;
    if (sourceTask == null) {
      return null;
    }

    if (sourceTask.outgoing.length === 1 && sourceTask.outgoing.last().targetRef.$type === "bpmn:ExclusiveGateway") {
      const gateway = sourceTask.outgoing.last().targetRef;
      targetObj = gateway.outgoing.find(out => out.targetRef.id === targetTaskId);
    } else {
      targetObj = sourceTask.outgoing.find(out => out.targetRef.id === targetTaskId);
    }
    return targetObj;
  }

  public hasTimerStartEvent(): boolean {
    return this.getTimerStartEvent() != null;
  }

  public hasMailStartEvent(): boolean {
    return this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === "bpmn:MessageEventDefinition") != null) != null;
  }

  public hasStandardStartEvent(): boolean {
    return this.getStartEvents(this.processId()).find(start => start.eventDefinitions == null) != null;
  }

  public addStartEvent(rowDetails: RowDetails[]): void {
    if (this.getStartEvents(this.processId()).find(start => start.eventDefinitions == null) == null) {
      const start = this.getStartEvents(this.processId()).last();
      const targetTask = start.outgoing.last().targetRef;
      const processContext: Bpmn.Process = this.getProcess(this.processId());
      const startEventObject = bpmnModdleInstance.create("bpmn:StartEvent", { id: BpmnProcess.getBpmnId("bpmn:StartEvent"), outgoing: [], incoming: [] });

      this.addSequenceFlow(this.processId(), startEventObject, targetTask, false);
      processContext.flowElements.push(startEventObject);

      const lane = this.getLaneOfFlowNode(start.id);
      this.addTaskToLane(this.processId(), lane.id, startEventObject);
      this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
    }
  }

  public removeStartEvent(rowDetails: RowDetails[]): void {
    const processContext = this.getProcess(this.processId());
    const startEvent = this.getStartEvents(this.processId()).find(start => start.eventDefinitions == null);
    this.removeSequenceFlow(this.processId(), startEvent.outgoing.last());

    processContext.flowElements = processContext.flowElements.filter(elem => elem.id !== startEvent.id);

    this.removeTaskObjectFromLanes(this.processId(), startEvent);

    const row = rowDetails.find(row => row.taskId === startEvent.id);
    if (row) {
      const otherStart = this.getStartEvents(this.processId()).last();
      row.taskId = otherStart.id;
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public getTimerStartEvent(): Bpmn.StartEvent {
    return this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === "bpmn:TimerEventDefinition") != null);
  }

  public getDiagramSize(): ProcessDiagramSize {
    const allShapes = this.processDiagram.getAllShapes();
    let minX: number = null;
    let maxX: number = null;
    let minY: number = null;
    let maxY: number = null;

    for (const shape of allShapes) {
      if (shape.bounds != null) {
        if (minX == null || minX > shape.bounds.x) {
          minX = shape.bounds.x;
        }
        if (minY == null || minY > shape.bounds.y) {
          minY = shape.bounds.y;
        }

        if (maxX == null || maxX < (+shape.bounds.x + +shape.bounds.width)) {
          maxX = (+shape.bounds.x + +shape.bounds.width);
        }

        if (maxY == null || maxY < (+shape.bounds.y + +shape.bounds.height)) {
          maxY = (+shape.bounds.y + +shape.bounds.height);
        }
      }
    }

    return {
      width: maxX - minX,
      height: maxY - minY
    };
  }

  public getShapeIdAndTypeFromBpmnElementId(bpmnTaskId: string): { type: Bpmn.ElementType; id: string } {
    const shape = this.processDiagram.getShapeFromDiagram(bpmnTaskId);
    if (shape != null) {
      const obj = this.getExistingActivityObject(bpmnTaskId);
      return { type: obj.$type, id: shape.id };
    }
    return null;
  }

}