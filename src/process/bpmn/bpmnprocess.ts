/// <reference path="../types/index.d.ts" />
import * as BpmnModdleHelper from "./bpmnmoddlehelper";
import { ILaneDictionary } from "./bpmnprocessdiagram";
import { BpmnProcessDiagram } from "./bpmnprocessdiagram";
import { Bpmn, Bpmndi } from "../bpmn";
import { IRunningTaskLane, ITaskToLaneMapEntry, IStartButtonMap, TaskSettingsValueType, BpmnExtensionName, ITaskExtensions } from "../processinterfaces";
import { isTrue } from "../../tools/assert";
import { tl } from "../../tl";
import { createId } from "../../tools/guid";
import { ILoadTemplateReply } from "../legacyapi";
import { IRowDetails } from "../phclient";
import { getExtensionValues, addOrUpdateExtension, getExtensionBody } from "./bpmnextensions";
import { bpmnModdleInstance } from "./bpmnmoddlehelper";
import { IParseResult } from "bpmn-moddle/lib/simple";
import { IFieldDefinition, IFieldDefinitionItem } from "../../data/ifielddefinition";
import { filterTodosForInstance } from "../../todo/todofilters";
import { IDecisionTask, DecisionTaskTypes } from "../../todo/todointerfaces";
import { getLastArrayEntry } from "../../tools/array";
import { IInstanceDetails } from "../../instance/instanceinterfaces";
import { convertFieldConfig } from "../../data/datainterfaces";

export class BpmnProcess {
  private moddleContext?: IParseResult;
  private bpmnXml?: Bpmn.IDefinitions;
  private processDiagram: BpmnProcessDiagram;

  constructor(bpmnXml?: Bpmn.IDefinitions) {
    this.bpmnXml = bpmnXml;
    this.processDiagram = new BpmnProcessDiagram(this);
  }

  public getModdleContext(): IParseResult {
    if (this.moddleContext === undefined) {
      throw new Error("moddleContext is undefined, please load bpmn XML first!");
    }

    return this.moddleContext;
  }

  public static addOrUpdateExtension(baseElement: Bpmn.IBaseElement, key: BpmnExtensionName, value: string | boolean | {}[], extensionValueType: TaskSettingsValueType): void {
    addOrUpdateExtension(baseElement, key, value, extensionValueType);
  }

  public static getExtensionValues(baseElement: Bpmn.IBaseElement | undefined): ITaskExtensions {
    return getExtensionValues(baseElement);
  }

  public static getFieldDefinitionsForElement(baseElement: Bpmn.IBaseElement): IFieldDefinition[] | undefined {
    return getExtensionValues(baseElement)?.fieldDefinitions;
  }

  public static getFlowNodeDescription(flowNode: Bpmn.IFlowNode): string | undefined {
    return getExtensionBody(flowNode, "description");
  }

  public static setSetSenderAsRoleOwner(startEvent: Bpmn.IStartEvent, setSetSenderAsRoleOwner: boolean): void {
    addOrUpdateExtension(startEvent, "set-sender-as-role-owner", setSetSenderAsRoleOwner, "Boolean");
  }

  public static getSetSenderAsRoleOwner(startEvent: Bpmn.IStartEvent): boolean {
    const valueAsString = getExtensionBody(startEvent, "set-sender-as-role-owner");
    if (valueAsString) {
      return valueAsString === "true";
    } else {
      // Default value is true
      return true;
    }
  }

  public static isMessageStartEvent(startEvent: Bpmn.IStartEvent): boolean {
    return startEvent.eventDefinitions != null && startEvent.eventDefinitions.find((e) => e.$type === "bpmn:MessageEventDefinition") != null;
  }

  public getBpmnDefinitions(): Bpmn.IDefinitions {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    return this.bpmnXml;
  }

  public setBpmnDefinitions(definitions: Bpmn.IDefinitions): void {
    this.bpmnXml = definitions;
  }

  public definitionId(): string {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    return this.bpmnXml.id;
  }

  public processId(): string {
    return this.getProcesses()[0].id;
  }

  public fixExclusiveGateway(): void {
    const exclusiveGateways: Bpmn.IExclusiveGateway[] = this.getFlowElementsOfType<Bpmn.IExclusiveGateway>("bpmn:ExclusiveGateway");

    for (const exGat of exclusiveGateways) {
      // Wenn nur 1 outgoing von einem xor ist, dann braucht dies keine Bedingung
      if (exGat.outgoing != null && exGat.outgoing.length > 1) {
        for (const seqFlow of exGat.outgoing) {
          // This.variables.choosenTaskId
          seqFlow.conditionExpression = bpmnModdleInstance.create("bpmn:FormalExpression", {
            body: "this.variables.taskInput." + exGat.id + ".userInput.choosenTaskId == '" + seqFlow.targetRef.id + "'",
            language: "JavaScript",
          });
        }
      } else if (exGat.outgoing != null && exGat.outgoing.length === 1) {
        exGat.outgoing[exGat.outgoing.length - 1].conditionExpression = undefined;
      }
    }
  }

  public getRoxFileFields(): IFieldDefinitionItem[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const fieldDefinitionsList: IFieldDefinitionItem[] = [];

    const process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process") as Bpmn.IProcess;
    const elements = process.flowElements;
    elements.push(process);
    elements.map((element) => {
      const extVals = getExtensionValues(element);
      if (extVals) {
        const taskFields = getExtensionValues(element).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // Currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map((taskField) => {
            if (taskField.type === "ProcessHubRoxFile") {
              fieldDefinitionsList.push({
                bpmnTaskId: element.id,
                isStartEvent: element.$type === "bpmn:StartEvent" ? true : false,
                fieldDefinition: taskField,
              });
            }
          });
        }
      }
    });
    return fieldDefinitionsList;
  }

  public getFieldDefinitions(): IFieldDefinition[] {
    const fieldDefinitions: IFieldDefinition[] = [];

    const elements = this.getSortedActivities(this.processId(), ["bpmn:StartEvent", "bpmn:UserTask", "bpmn:BoundaryEvent"]);
    elements.push(...this.getProcesses());
    elements.forEach((element) => {
      const extVals = getExtensionValues(element);
      if (extVals) {
        const taskFields = getExtensionValues(element).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // Currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map((taskField) => {
            if (fieldDefinitions.find((fieldDefinition) => fieldDefinition.name === taskField.name) == null) {
              taskField.config = convertFieldConfig(taskField.config);
              fieldDefinitions.push(taskField);
            }
          });
        }
      }
    });

    return fieldDefinitions;
  }

  public getFieldDefinitionsOfSpecificType(fieldType: string): IFieldDefinition[] {
    return this.getFieldDefinitions().filter((d) => d.type === fieldType);
  }

  /**
   * @deprecated use {@link BpmnProcess#getFieldDefinitionsForElement}
   */
  public getFieldDefinitionsForTask(taskObject: Bpmn.ITask | Bpmn.IActivity): IFieldDefinition[] | undefined {
    const extVals = getExtensionValues(taskObject);
    if (extVals) {
      const { fieldDefinitions } = extVals;

      for (const fieldDef of fieldDefinitions || []) {
        fieldDef.config = convertFieldConfig(fieldDef.config);
      }

      return fieldDefinitions;
    } else {
      return undefined;
    }
  }

  public async loadXml(processXmlStr: string): Promise<void> {
    if (processXmlStr == null) {
      console.log("XML string of process should not be null/undefined!");

      const stack = new Error().stack;
      console.log("PRINTING CALL STACK");
      console.log(stack);

      isTrue(processXmlStr != null, "XML string of process should not be null/undefined!");
    }

    const fromXmlRes = await bpmnModdleInstance.fromXML(processXmlStr);
    if (Array.isArray(fromXmlRes)) {
      throw fromXmlRes[0];
    }
    this.moddleContext = fromXmlRes;
    this.bpmnXml = fromXmlRes.rootElement;

    // Fix für startevent
    const sequenceFlows: Bpmn.ISequenceFlow[] = this.getSequenceFlowElements();
    for (const sequenceFlow of sequenceFlows) {
      if (sequenceFlow.sourceRef && sequenceFlow.sourceRef.outgoing == null) {
        sequenceFlow.sourceRef.outgoing = [];
      }
      if (sequenceFlow.sourceRef && !sequenceFlow.sourceRef.outgoing?.includes(sequenceFlow)) {
        sequenceFlow.sourceRef.outgoing?.push(sequenceFlow);
      }

      if (sequenceFlow.targetRef && sequenceFlow.targetRef.incoming == null) {
        sequenceFlow.targetRef.incoming = [];
      }
      if (sequenceFlow.targetRef && !sequenceFlow.targetRef.incoming?.includes(sequenceFlow)) {
        sequenceFlow.targetRef.incoming?.push(sequenceFlow);
      }
    }

    // Fixes für boundary events
    const boundaryEvents: Bpmn.IBoundaryEvent[] = this.getFlowElementsOfType<Bpmn.IBoundaryEvent>("bpmn:BoundaryEvent");
    for (const t of boundaryEvents) {
      // Console.log(this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs);

      if (this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs == null) {
        this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs = [];
      }

      if (!this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs?.find((e) => e.id === t.id)) {
        this.getExistingTask(this.processId(), t.attachedToRef.id)?.boundaryEventRefs?.push(t);
      }
    }

    this.processDiagram = new BpmnProcessDiagram(this);
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

  public getNextActivities(currentTaskId: string): Bpmn.IFlowNode[] {
    const currentTask = this.getExistingActivityObject(currentTaskId);

    const tmpList: Bpmn.IFlowNode[] = [];

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

  private getTaskIdsAfterGateway(currentGatewayId: string, userLanguage: string): IDecisionTask[] {
    const currentObject = this.getExistingActivityObject(currentGatewayId);
    let exclusiveGateway: Bpmn.IExclusiveGateway;
    if (currentObject?.$type === "bpmn:ExclusiveGateway") {
      exclusiveGateway = currentObject as Bpmn.IExclusiveGateway;
    } else {
      return [];
    }
    // A -> X -> B & C | A -> X1 -> (X2 -> C) & B

    return this.getDecisionTasksAfterGateway(exclusiveGateway, userLanguage);
  }

  public getDecisionTasksAfterGateway(gat: Bpmn.IExclusiveGateway, userLanguage: string): IDecisionTask[] {
    const decisionTasks: IDecisionTask[] = [];
    if (gat.outgoing) {
      for (const outgoing of gat.outgoing) {
        const target = outgoing.targetRef;
        const taskId = target.id;

        let nameValue = target.name;
        // If the current target is an unnamed ExclusiveGateway with exactly one outgoing SequenceFlow, use the name of the SequenceFlows target
        if (!nameValue && target.$type === "bpmn:ExclusiveGateway" && target.outgoing && target.outgoing.length === 1 && target.outgoing[0].targetRef) {
          nameValue = target.outgoing[0].targetRef.name;
        }

        if (!nameValue) {
          switch (target.$type) {
            case "bpmn:EndEvent":
              nameValue = tl("Ende", userLanguage, "processes");
              break;
            case "bpmn:ExclusiveGateway":
              nameValue = "Gateway";
              break;
            default:
              nameValue = target.$type;
          }
        }

        decisionTasks.push({
          bpmnTaskId: taskId,
          name: nameValue,
          type: DecisionTaskTypes.Normal,
          isBoundaryEvent: false,
        } as IDecisionTask);
      }
    }
    return decisionTasks;
  }

  public async loadFromTemplate(userLanguage: string): Promise<ILoadTemplateReply> {
    const result: ILoadTemplateReply = await BpmnModdleHelper.createBpmnTemplate(userLanguage);

    this.bpmnXml = result.bpmnXml;
    this.moddleContext = result.bpmnContext;

    // Add extensions

    // add default fields to start element
    const startElement = this.getStartEvents(this.processId())[0];
    const fieldDefinitions: IFieldDefinition[] = [
      {
        name: tl("Titel", userLanguage, "processes"),
        type: "ProcessHubTextInput",
        isRequired: false,
        config: { conditionExpression: "", conditionBuilderMode: true, validationExpression: "" },
        inlineEditingActive: false,
      },
      {
        name: tl("Feld", userLanguage, "processes") + "_1",
        type: "ProcessHubTextInput",
        isRequired: false,
        config: { conditionExpression: "", conditionBuilderMode: true, validationExpression: "" },
        inlineEditingActive: false,
      },
      {
        name: tl("Feld", userLanguage, "processes") + "_2",
        type: "ProcessHubTextArea",
        isRequired: false,
        config: { conditionExpression: "", conditionBuilderMode: true, validationExpression: "" },
        inlineEditingActive: false,
      },
      {
        name: tl("Anlagen", userLanguage, "processes"),
        type: "ProcessHubFileUpload",
        isRequired: false,
        config: { conditionExpression: "", conditionBuilderMode: true, validationExpression: "" },
        inlineEditingActive: false,
      },
    ];

    addOrUpdateExtension(startElement, "processhub-userform", JSON.stringify(fieldDefinitions), "Text");

    addOrUpdateExtension(startElement, "roleowners-editable", true, "Boolean");

    const sortedTasks = this.getSortedTasks(this.processId(), false);
    let counter = -1;
    const rows: IRowDetails[] = sortedTasks.map((task) => {
      counter++;
      const lane = this.getLaneOfFlowNode(task.id);
      return {
        taskId: task.id,
        rowNumber: counter,
        selectedRole: lane?.id,
        task: task.name,
        laneId: lane?.id,
        taskType: "bpmn:UserTask",
        jumpsTo: task.outgoing?.map((out) => out.targetRef.id),
      } as IRowDetails;
    });
    this.processDiagram.generateBPMNDiagram(this.processId(), rows);

    return result;
  }

  public setParticipantsName(name: string): void {
    this.getCollaboration().participants[0].name = name;
  }

  private getCollaboration(): Bpmn.ICollaboration {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    return this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Collaboration") as Bpmn.ICollaboration;
  }

  // Suchfunktionen, siehe
  // https://github.com/paed01/bpmn-engine/blob/master/lib/context-helper.js
  public static getBpmnId(type?: Bpmn.ElementType, createdId = ""): string {
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

  public getProcesses(): Bpmn.IRootElement[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    return this.bpmnXml.rootElements.filter((e) => e.$type === "bpmn:Process");
  }

  public getProcess(processId: string): Bpmn.IProcess {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    return this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.IProcess;
  }

  // Get the StartEvents of the process
  public getStartEvents(processId: string): Bpmn.IStartEvent[] {
    return this.getEvents(processId, "bpmn:StartEvent") as Bpmn.IStartEvent[];
  }

  /**
   * Returns all StartEvents with MessageEventDefinition from type "mail"
   */
  public getMailMessageStartEvents(): Bpmn.IStartEvent[] {
    const startEvents = this.getStartEvents(this.processId());
    const messageStartEvents = startEvents.filter((e) => e.eventDefinitions?.find((d) => d.$type === "bpmn:MessageEventDefinition") != null);
    const mailMessageStartEvents = messageStartEvents.filter((e) => {
      const extensions = BpmnProcess.getExtensionValues(e);
      return extensions.messageEventType == null || extensions.messageEventType === "mail";
    });
    return mailMessageStartEvents;
  }

  // Get the text that should be displayed on the start button
  public getStartButtonMap(): IStartButtonMap {
    const startEvents = this.getStartEvents(this.processId());
    if (startEvents && startEvents.length > 0) {
      const map = {} as IStartButtonMap;
      startEvents.forEach((startEvent) => {
        if (startEvent.eventDefinitions == null || startEvent.eventDefinitions.find((d) => d.$type === "bpmn:LinkEventDefinition")) {
          // Check if start event has only one roxfilefield
          let onlyRoxFileField = false;
          const extVals: ITaskExtensions = getExtensionValues(startEvent);
          if (extVals.fieldDefinitions != null && extVals.fieldDefinitions.length === 1) {
            if (extVals.fieldDefinitions[0].type === "ProcessHubRoxFile") {
              onlyRoxFileField = true;
            }
          }
          const lane = this.getLaneOfFlowNode(startEvent.id);
          if (lane) {
            map[startEvent.id] = {
              startEventName: startEvent.name && startEvent.name.trim() !== "" ? startEvent.name : undefined,
              laneId: lane.id,
              onlyRoxFileField,
              anonymousStart: extVals ? extVals.anonymousStart : false,
            };
          }
        }
      });
      return map;
    } else {
      return {};
    }
  }

  public getEndEvents(processId: string): Bpmn.IEndEvent[] {
    return this.getEvents(processId, "bpmn:EndEvent") as Bpmn.IEndEvent[];
  }

  private getEvents(processId: string, eventType: string): Bpmn.IFlowElement[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process: Bpmn.IProcess = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.IProcess;
    const flowElements: Bpmn.IFlowElement[] = process.flowElements.filter((e: Bpmn.IFlowElement) => e.$type === eventType);

    return flowElements;
  }

  public getProcessDiagram(): BpmnProcessDiagram {
    return this.processDiagram;
  }

  public getExistingTask(processId: string, taskId: string): Bpmn.ITask {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === processId) as Bpmn.IProcess;
    const flowElements: Bpmn.IFlowNode[] = process.flowElements.filter(
      (e: Bpmn.IFlowNode) =>
        e.$type === "bpmn:StartEvent" ||
        e.$type === "bpmn:EndEvent" ||
        e.$type === "bpmn:UserTask" ||
        e.$type === "bpmn:SendTask" ||
        e.$type === "bpmn:ServiceTask" ||
        e.$type === "bpmn:ScriptTask",
    );
    const task = flowElements.find((element) => element.id === taskId);

    return task as Bpmn.ITask;
  }

  public changeTaskName(taskId: string, newName: string): void {
    const task = this.getExistingTask(this.processId(), taskId);
    task.name = newName;
  }

  public changeRole(rowDetails: IRowDetails[], taskId: string, laneId: string): void {
    const task = this.getExistingActivityObject(taskId);
    if (task) {
      if ((task.$type as string) === "bpmn:StartEvent") {
        this.getStartEvents(this.processId()).forEach((start) => {
          this.setRoleForTask(this.processId(), laneId, start);
        });
      } else {
        this.setRoleForTask(this.processId(), laneId, task);
      }
    }

    if (taskId === getLastArrayEntry(rowDetails)?.taskId) {
      const endEvent = this.getEndEvents(this.processId())[0];
      this.setRoleForTask(this.processId(), laneId, endEvent);
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public getAllTimers(): Bpmn.ICatchEvent[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process: Bpmn.IProcess = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.IProcess;
    const flowElements: Bpmn.ICatchEvent[] = process.flowElements.filter(
      (e: Bpmn.ICatchEvent) => e.eventDefinitions != null && e.eventDefinitions.find((ed) => ed.$type === "bpmn:TimerEventDefinition"),
    );
    return flowElements;
  }

  public getAllExclusiveGateways(): Bpmn.IFlowNode[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process: Bpmn.IProcess = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.IProcess;
    const flowElements: Bpmn.IFlowNode[] = process.flowElements.filter((e: Bpmn.IFlowNode) => e.$type === "bpmn:ExclusiveGateway");
    return flowElements;
  }

  public getAllParallelGateways(): Bpmn.IFlowNode[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process: Bpmn.IProcess = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.IProcess;
    const flowElements: Bpmn.IFlowNode[] = process.flowElements.filter((e: Bpmn.IFlowNode) => e.$type === "bpmn:ParallelGateway");
    return flowElements;
  }

  public getExistingActivityObject(objectId: string): Bpmn.IActivity | undefined {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process: Bpmn.IProcess = this.bpmnXml.rootElements.find((e) => e.$type === "bpmn:Process" && e.id === this.processId()) as Bpmn.IProcess;
    const flowElement = process.flowElements.find((e: Bpmn.IActivity) => e.id === objectId);
    return flowElement;
  }

  private getProcessLanes(processId: string): Bpmn.ILane[] {
    const processContext: Bpmn.IProcess = this.getProcess(processId);
    if (processContext.laneSets) {
      return processContext.laneSets[0].lanes;
    } else {
      return [];
    }
  }

  public getTaskToLaneMap(): ITaskToLaneMapEntry[] {
    let resultMap: ITaskToLaneMapEntry[] = [];
    const lanes = this.getProcessLanes(this.processId());

    for (const lane of lanes) {
      const mapForLane = lane.flowNodeRef
        ? lane.flowNodeRef.filter((node) => node.$type === "bpmn:UserTask" || node.$type === "bpmn:SendTask" || node.$type === "bpmn:ExclusiveGateway")
        : null;
      let mapForLaneNodes = null;
      if (mapForLane != null) {
        mapForLaneNodes = mapForLane.map((taskNode) => {
          return { taskId: taskNode.id, laneId: lane.id };
        });
      }

      if (mapForLaneNodes != null) {
        resultMap = resultMap.concat(mapForLaneNodes);
      }
    }
    return resultMap;
  }

  public getProcessLane(processId: string, laneId: string): Bpmn.ILane | undefined {
    const processLanes: Bpmn.ILane[] = this.getProcessLanes(processId);
    if (processLanes) {
      return processLanes.find((lane) => lane.id === laneId);
    } else {
      return undefined;
    }
  }

  private removeSequenceFlow(processId: string, sequenceFlowObject: Bpmn.ISequenceFlow): void {
    const process: Bpmn.IProcess = this.getProcess(processId);
    const index: number = process.flowElements.indexOf(sequenceFlowObject);

    if (index > -1) {
      const sf: Bpmn.ISequenceFlow = process.flowElements.find((e) => e.id === process.flowElements[index].id) as Bpmn.ISequenceFlow;
      sf.sourceRef.outgoing = sf.sourceRef.outgoing?.filter((out) => out.id !== sf.id);
      sf.targetRef.incoming = sf.targetRef.incoming?.filter((inc) => inc.id !== sf.id);
      process.flowElements.splice(index, 1);
    } else {
      console.log("Error: cannot find SequenceFlow to remove.");
    }
  }

  public addLane(processId: string, id: string, name: string): string {
    // Add an additional lane (=role)
    const lane = bpmnModdleInstance.create("bpmn:Lane", { id: id, name: name, flowNodeRef: [] });

    const processContext: Bpmn.IProcess = this.getProcess(processId);
    processContext.laneSets = processContext.laneSets || [];
    if (processContext.laneSets[0].lanes == null) {
      processContext.laneSets[0].lanes = [];
    }

    processContext.laneSets[0].lanes.push(lane);
    return id;
  }

  public removeTaskObjectFromLanes(processId: string, taskObject: Bpmn.IBaseElement): void {
    let lanes: Bpmn.ILane[] = this.getProcessLanes(processId);

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const laneObject = lanes[laneIndex];
      if (laneObject.flowNodeRef != null) {
        laneObject.flowNodeRef = laneObject.flowNodeRef.filter((flowObj) => flowObj.id !== taskObject.id);
      }
    }
    lanes = lanes.filter((lane) => {
      if (lane.flowNodeRef != null) {
        return lane.flowNodeRef.length > 0;
      } else {
        // Wenn flowNodeRef == null, dann ist die Lane erst hinzugefügt worden und darf nicht gelöscht werden, da im nächsten Schritt die Tasks hinzugefügt werden
        return false;
      }
    });
  }

  private addTaskToLane(processId: string, laneId: string, taskObject: Bpmn.IBaseElement): void {
    // Task objekt wieder zur neuen rolle hinzufügen
    // process in lane einfügen // ID von selected Role in der UI entspricht der LaneID
    if (laneId != null) {
      const laneObject = this.getProcessLane(processId, laneId);
      if (laneObject) {
        if (laneObject.flowNodeRef == null) {
          laneObject.flowNodeRef = [];
        }

        if (!laneObject.flowNodeRef.includes(taskObject)) {
          laneObject.flowNodeRef.push(taskObject);
        }
      }
    }
  }

  private setRoleForTask(processId: string, laneId: string, taskObject: Bpmn.IBaseElement): void {
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
    this.getSequenceFlowElements().forEach((sf) => {
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
  public deleteTask(processId: string, rowDetails: IRowDetails[], rowNumber: number): void {
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
        if (rowNumber === 1 && targetObj && targetObj.$type === "bpmn:ExclusiveGateway") {
          // Remove gateway and all sfs
          this.removeElementWithAllReferences(targetObj.id);
          // Next or end element
          const newTargetId = rowDetails[rowNumber + 1] != null ? rowDetails[rowNumber + 1].taskId : this.getEndEvents(this.processId())[0].id;
          targetObj = this.getExistingActivityObject(newTargetId);

          res.objectIdsWithMissingSource = res.objectIdsWithMissingSource.filter((obj) => obj !== targetId);
          if (targetObj) {
            res.objectIdsWithMissingSource.push(targetObj.id);
            if (sourceObj) {
              this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);
            }
          }
        } else {
          if (sourceObj && targetObj) {
            this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);
          }
        }
      }
    }

    const tmpRowDetails: IRowDetails[] = JSON.parse(JSON.stringify(rowDetails));
    tmpRowDetails.splice(rowNumber, 1);
    this.processDiagram.generateBPMNDiagram(processId, tmpRowDetails);
  }

  public convertTaskType(rows: IRowDetails[], changedTaskIdx: number): string {
    const oldTaskId: string = rows[changedTaskIdx].taskId;
    const oldTask: Bpmn.ITask = this.getExistingTask(this.processId(), oldTaskId);
    const savedIncoming = oldTask.incoming;
    const savedOutgoing = oldTask.outgoing;

    const processContext: Bpmn.IProcess = this.getProcess(this.processId());

    // Delete old task from flowelements
    for (let index = 0; index < processContext.flowElements.length; index++) {
      const element = processContext.flowElements[index];
      if (element.id === oldTask.id) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }

    // Task aus lane entfernen
    const processLanes: Bpmn.ILane[] = this.getProcessLanes(this.processId());

    for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
      const processLane: Bpmn.ILane = processLanes[laneIndex];
      if (processLane.flowNodeRef != null) {
        for (let index = 0; index < processLane.flowNodeRef.length; index++) {
          const flowNode: Bpmn.IFlowNode = processLane.flowNodeRef[index];
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

    if (savedIncoming) {
      for (const inc of savedIncoming) {
        inc.targetRef = focusedTask;
      }
    }
    if (savedOutgoing) {
      for (const out of savedOutgoing) {
        out.sourceRef = focusedTask;
      }
    }

    focusedTask.outgoing = savedOutgoing;
    focusedTask.incoming = savedIncoming;

    processContext.flowElements.push(focusedTask);

    this.addTaskToLane(this.processId(), rows[changedTaskIdx].laneId, focusedTask);

    // This.setRoleForTask(this.processId(), rowDetails.laneId, focusedTask);

    this.processDiagram.generateBPMNDiagram(this.processId(), rows);

    // Replace all jumpsTo with the id of the new task
    for (const row of rows) {
      if (row.jumpsTo.find((j) => j === oldTaskId)) {
        row.jumpsTo = row.jumpsTo.filter((j) => j !== oldTaskId);
        row.jumpsTo.push(rows[changedTaskIdx].taskId);
      }
    }

    return rows[changedTaskIdx].taskId;
  }

  public addFlowToNode(taskFromObject: IRowDetails, targetBpmnTaskId: string, rowDetails: IRowDetails[], renderDiagram = true): void {
    const focusedTask: Bpmn.ITask = this.getExistingTask(this.processId(), taskFromObject.taskId);
    const targetTask: Bpmn.ITask = this.getExistingTask(this.processId(), targetBpmnTaskId);

    // Add gateway
    if (focusedTask.outgoing && focusedTask.outgoing.length > 0) {
      const existingOutgoings = focusedTask.outgoing;
      if (existingOutgoings.length === 1 && existingOutgoings[0].targetRef.$type === "bpmn:ExclusiveGateway") {
        this.addSequenceFlow(this.processId(), existingOutgoings[0].targetRef, targetTask, false);
      } else {
        focusedTask.outgoing = [];
        const processContext: Bpmn.IProcess = this.getProcess(this.processId());
        const newGateway = bpmnModdleInstance.create("bpmn:ExclusiveGateway", { id: "ExclusiveGateway_" + createId(), name: "", incoming: [], outgoing: [] });
        processContext.flowElements.push(newGateway);

        this.addSequenceFlow(this.processId(), focusedTask, newGateway, false);

        for (const out of existingOutgoings) {
          this.addSequenceFlow(this.processId(), newGateway, out.targetRef, false);
          this.removeSequenceFlow(this.processId(), out);
        }
        if (newGateway.outgoing?.find((out) => out.targetRef.id === targetTask.id) == null) {
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

  public removeSequenceFlowFromJumpsTo(rowDetails: IRowDetails[], rowNumber: number, targetBpmnTaskId: string): void {
    const focusedTask: Bpmn.ITask = this.getExistingTask(this.processId(), rowDetails[rowNumber].taskId);

    const sfObj = focusedTask.outgoing?.find((out) => out.targetRef.id === targetBpmnTaskId || out.targetRef.$type === "bpmn:ExclusiveGateway");
    if (sfObj && sfObj.targetRef.$type === "bpmn:ExclusiveGateway") {
      const process: Bpmn.IProcess = this.getProcess(this.processId());
      const gateway = sfObj.targetRef;

      const gatSequenceFlows: Bpmn.IFlowElement[] = process.flowElements.filter((el) => gateway.outgoing?.find((e) => e.id === el.id) != null);

      const allSequenceFlows = this.getSequenceFlowElements();
      gatSequenceFlows.forEach((sf) => {
        const sfElem = allSequenceFlows.find((s) => s.id === sf.id);
        if (sfElem) {
          sfElem.targetRef.incoming = sfElem.targetRef.incoming?.filter((fil) => gateway.outgoing?.find((out) => out.id === fil.id) == null);
        }
      });
      focusedTask.outgoing = focusedTask.outgoing?.filter((out) => out.targetRef.id !== gateway.id);
      // Process.flowElements = process.flowElements.filter(el =>  .find(e => e.id === el.id) == null);

      // del gate from flowElements

      process.flowElements = process.flowElements.filter((el) => el.id !== gateway.id);
      process.laneSets?.forEach((lane) => lane.lanes.forEach((l) => (l.flowNodeRef = l.flowNodeRef.filter((fil) => fil.id !== gateway.id))));
      process.flowElements = process.flowElements.filter((el) => gateway.outgoing?.find((e) => e.id === el.id) == null);

      if (rowDetails[rowNumber].jumpsTo.length > 0) {
        let firstProcess = true;
        rowDetails[rowNumber].jumpsTo.forEach((jumpToId) => {
          if (targetBpmnTaskId !== jumpToId) {
            const nextTask = this.getExistingActivityObject(jumpToId);

            if (firstProcess) {
              if (nextTask) {
                this.addSequenceFlow(this.processId(), focusedTask, nextTask, false);
              }
              firstProcess = false;
            } else {
              this.addFlowToNode(rowDetails[rowNumber], jumpToId, rowDetails, false);
            }
          }
        });
        // Process.flowElements.forEach(el => console.log(el.id + " in " + (el as Bpmn.FlowNode).incoming.length + " ____  out " + (el as Bpmn.FlowNode).outgoing.length));

        // let nextTask: Bpmn.FlowNode = (rowNumber + 1) == rowDetails.length ? this.getEndEvents(this.processId())[0] : this.getExistingTask(this.processId(), rowDetails[rowNumber + 1].taskId) as
        // Bpmn.Task;
      }
    }
    if (!sfObj) {
      throw new Error("removing object is missing.");
    }
    this.removeSequenceFlow(this.processId(), sfObj);

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  public addTaskBetween(rowDetails: IRowDetails[], focusedRowNumber: number): void {
    // Important to refresh rowdetails with new TaskId
    const newTaskRowDetails = rowDetails[focusedRowNumber];
    let id: string;
    if (!newTaskRowDetails.taskId) {
      id = BpmnProcess.getBpmnId("bpmn:UserTask");
      newTaskRowDetails.taskId = id;
    }

    let focusedTask: Bpmn.ITask = this.getExistingTask(this.processId(), newTaskRowDetails.taskId);
    const processContext: Bpmn.IProcess = this.getProcess(this.processId());

    if (focusedTask == null) {
      focusedTask = bpmnModdleInstance.create(newTaskRowDetails.taskType as "bpmn:UserTask", {
        id: newTaskRowDetails.taskId,
        name: newTaskRowDetails.task,
        incoming: [],
        outgoing: [],
      });
      processContext.flowElements.push(focusedTask);
    }

    this.setRoleForTask(this.processId(), newTaskRowDetails.laneId, focusedTask);

    // PREV object
    let previousElements: Bpmn.IActivity[] = [];

    if (focusedRowNumber === 1) {
      previousElements = this.getStartEvents(this.processId());
    } else {
      const previousElement = this.getExistingActivityObject(rowDetails[focusedRowNumber - 1].taskId);
      if (previousElement) {
        previousElements = [previousElement];
      }
    }

    // TARGET object
    const targetElement = this.getExistingActivityObject(rowDetails[focusedRowNumber].taskId);

    // NEXT object
    let nextElement: Bpmn.IActivity | undefined;
    if (rowDetails[focusedRowNumber + 1] == null) {
      nextElement = getLastArrayEntry(this.getEndEvents(this.processId()));
    } else {
      nextElement = this.getExistingActivityObject(rowDetails[focusedRowNumber + 1].taskId);
    }

    let targetRefsOfPrev: string[] = [];
    if (previousElements != null) {
      previousElements.forEach((start) => {
        if (start.outgoing) {
          targetRefsOfPrev = targetRefsOfPrev.concat(start.outgoing.map((out) => out.targetRef.id));
        }
      });
    }
    const targetRefsOfPrevUnique: string[] = [];
    targetRefsOfPrev.forEach((item) => {
      if (!targetRefsOfPrevUnique.includes(item)) {
        targetRefsOfPrevUnique.push(item);
      }
    });

    // Remove all outgoings from previous
    if (previousElements != null) {
      previousElements.forEach((previousElement) => {
        previousElement.outgoing?.forEach((out) => {
          this.removeSequenceFlow(this.processId(), out);
        });

        const sfObj = this.getSequenceFlowElements().find((sf) => sf.sourceRef.id === previousElement.id && sf.targetRef.id === nextElement?.id);
        if (sfObj) {
          this.removeSequenceFlow(this.processId(), sfObj);
        }
        if (targetElement) {
          this.addSequenceFlow(this.processId(), previousElement, targetElement, true);
        }
      });
    }

    for (const targetRefId of targetRefsOfPrevUnique) {
      const tmpTargetElement = this.getExistingActivityObject(targetRefId);
      if (targetElement && tmpTargetElement) {
        this.addSequenceFlow(this.processId(), targetElement, tmpTargetElement, false);
      }
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  private addSequenceFlow(processId: string, sourceReference: Bpmn.IFlowNode, targetReference: Bpmn.IFlowNode, deleteExistingRefs = true): Bpmn.ISequenceFlow {
    const processContext = this.getProcess(processId);
    // Weiteren Sequenzfluss einfügen
    const id = BpmnProcess.getBpmnId("bpmn:SequenceFlow");
    const sequenceFlow = bpmnModdleInstance.create("bpmn:SequenceFlow", { id: id, targetRef: targetReference, sourceRef: sourceReference });

    processContext.flowElements.push(sequenceFlow);

    if (sourceReference.$type === "bpmn:StartEvent") {
      // IsTrue(sourceReference.outgoing.length == 1, "Das Start EVENT darf nur 1 Verbindung (outgoing) haben!" + sourceReference.outgoing.length);
    }
    sourceReference.outgoing = sourceReference.outgoing || [];
    targetReference.incoming = targetReference.incoming || [];

    if (deleteExistingRefs) {
      sourceReference.outgoing.splice(0, 1);
    }
    if (targetReference.$type === "bpmn:EndEvent") {
      // IsTrue(targetReference.incoming.length == 1, "Das End EVENT darf nur 1 Verbindung (incoming) haben! " + targetReference.incoming.length);
    }
    if (deleteExistingRefs) {
      targetReference.incoming.splice(0, 1);
    }

    targetReference.incoming.push(sequenceFlow);

    sourceReference.outgoing.push(sequenceFlow);

    return sequenceFlow;
  }

  public async toXmlString(): Promise<string> {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    this.removeLanesWithoutShape();

    const res = await bpmnModdleInstance.toXML(this.bpmnXml, { format: true });
    if (res instanceof Error) {
      throw res;
    } else {
      return res.xml;
    }
  }

  //  Diagramm Komponente
  // Gibt die notwendigen Elemente für die Erstellung des Diagram-Pars im XML zurück
  public getCollaborationElements(): Bpmn.ICollaboration[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const elements = this.bpmnXml.rootElements.filter((e: Bpmn.IBaseElement) => e.$type === "bpmn:Collaboration") as Bpmn.ICollaboration[];
    return elements;
  }

  public getSortedLanesWithTasks(processId: string): Bpmn.ILane[] {
    const laneElementsList: Bpmn.ILane[] = this.getLanes(true);

    const sortedLaneElementsList: Bpmn.ILane[] = [];

    // Include start element
    const sortedTaskIds: string[] = [this.getStartEvents(processId)[0].id];
    this.getSortedTasks(processId).map((t) => sortedTaskIds.push(t.id));

    let laneOfLastTask: Bpmn.ILane | undefined = undefined;

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

    let laneOfStartEvent: Bpmn.ILane | undefined = undefined;
    let laneOfEndEvent: Bpmn.ILane | undefined = undefined;

    if (sortedLaneElementsList.length === 0) {
      const allLanes: Bpmn.ILane[] = this.getLanes(false);
      if (allLanes.length > 0) {
        laneOfStartEvent = allLanes[0];
        laneOfEndEvent = allLanes[0];
      }
    } else {
      laneOfStartEvent = sortedLaneElementsList[0];
      laneOfEndEvent = laneOfLastTask;
    }

    if (laneOfStartEvent != null) {
      this.addTaskToLane(processId, laneOfStartEvent.id, this.getStartEvents(processId)[0]);
    }
    if (laneOfEndEvent != null) {
      this.addTaskToLane(processId, laneOfEndEvent.id, this.getEndEvents(processId)[0]);
    }

    return sortedLaneElementsList;
  }

  /**
   * Gets the lane
   * @param laneId lane id
   * @return {Bpmn.ILane} the lane or undefined, if not found
   */
  public getLane(laneId: string): Bpmn.ILane | undefined {
    const lanes: Bpmn.ILane[] = this.getLanes(false);
    return lanes.find((l) => l.id === laneId);
  }

  /**
   * Gets the lanes of the process
   * @param onlyLanesWithTasks if true, only lanes containing a task are returned
   * @return {Bpmn.ILane[]} the lanes of the process - if onlyLanesWithTasks is true, only the lanes containing a task are returned
   */
  public getLanes(onlyLanesWithTasks: boolean): Bpmn.ILane[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    let laneElementsList: Bpmn.ILane[] = [];
    const processes: Bpmn.IProcess[] = this.bpmnXml.rootElements.filter((e: Bpmn.IRootElement) => e.$type === "bpmn:Process") as Bpmn.IProcess[];

    for (let i = 0; i < processes.length; i++) {
      const laneSetElements = processes[i].laneSets?.filter((e: Bpmn.ILaneSet) => e.$type === "bpmn:LaneSet");
      if (laneSetElements) {
        for (let t = 0; t < laneSetElements.length; t++) {
          if (laneSetElements[t].lanes != null) {
            laneElementsList = laneSetElements[t].lanes.filter((lane) => {
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
    }

    return laneElementsList;
  }

  public getLaneOfFlowNode(flowNodeId: string): Bpmn.ILane | undefined {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    let laneElement: Bpmn.ILane | undefined = undefined;
    const processes: Bpmn.IProcess[] = this.bpmnXml.rootElements.filter((e: Bpmn.IRootElement) => e.$type === "bpmn:Process") as Bpmn.IProcess[];

    for (let i = 0; i < processes.length; i++) {
      const laneSetElements = processes[i].laneSets?.filter((e: Bpmn.ILaneSet) => e.$type === "bpmn:LaneSet");
      if (laneSetElements) {
        for (let t = 0; t < laneSetElements.length; t++) {
          if (laneSetElements[t].lanes != null) {
            laneElement = laneSetElements[t].lanes.find((lane) => {
              if (lane.flowNodeRef != null) {
                const flowObj = lane.flowNodeRef.find((fo) => fo.id === flowNodeId);
                if (flowObj != null) {
                  return true;
                }
              }
              return false;
            });
          }
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

    const startEvents: Bpmn.IStartEvent[] = this.getStartEvents(this.processId());
    if (startEvents) {
      for (const startEvent of startEvents) {
        const startLane = this.getLaneOfFlowNode(startEvent.id);
        if (startLane != null) {
          laneIds.push(startLane.id);
        }
      }
    }

    return laneIds;
  }

  public getSortedTasks(processId: string, ignoreSendTasks = false): Bpmn.ITask[] {
    const types: Bpmn.ElementType[] = ["bpmn:UserTask", "bpmn:ServiceTask", "bpmn:ScriptTask"];
    if (!ignoreSendTasks) {
      types.push("bpmn:SendTask");
    }
    return this.getSortedActivities(processId, types) as Bpmn.ITask[];
  }

  public getSortedActivities(processId: string, types: Bpmn.ElementType[]): Bpmn.IActivity[] {
    const startEvents: Bpmn.IStartEvent[] = this.getStartEvents(processId);
    if (startEvents == null || startEvents.length === 0) {
      return []; // Process definition is not correct, but function should be fault tolerant
    }

    const sortedTasks: Bpmn.ITask[] = [];

    const flowNodeQueue: Bpmn.IFlowNode[] = [];
    startEvents.forEach((s) => flowNodeQueue.push(s));

    const checkedFlowNodes: Bpmn.IFlowNode[] = [];

    while (flowNodeQueue.length) {
      const curElem = flowNodeQueue.shift();
      if (curElem) {
        if (checkedFlowNodes.find((s) => s.id === curElem.id) == null) {
          if (types.includes(curElem.$type)) {
            sortedTasks.push(curElem as Bpmn.ITask);
          }

          if (curElem.outgoing && curElem.outgoing.length) {
            curElem.outgoing.forEach((o) => {
              if (o && o.targetRef) {
                flowNodeQueue.push(o.targetRef);
              }
            });
          }
          if ((curElem as Bpmn.IActivity).boundaryEventRefs) {
            (curElem as Bpmn.IActivity).boundaryEventRefs?.forEach((b) => flowNodeQueue.push(b));
          }
          checkedFlowNodes.push(curElem);
        }
      }
    }

    // Nochmals alle Activities iterieren und fehlende anfügen
    for (const type of types) {
      const tasks = this.getEvents(processId, type);
      if (tasks != null) {
        tasks.map((task) => {
          if (sortedTasks.find((e) => e.id === task.id) == null) {
            sortedTasks.push(task as Bpmn.ITask);
          }
        });
      }
    }

    return sortedTasks;
  }

  private getFlowElementsOfTypes<T extends Bpmn.IBaseElement>(types: Bpmn.bpmnType[]): T[] {
    let res: T[] = [];
    for (const type of types) {
      res = res.concat(this.getFlowElementsOfType<T>(type));
    }
    return res;
  }

  private getFlowElementsOfType<T extends Bpmn.IBaseElement>(type: Bpmn.bpmnType): T[] {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const elements: T[] = [];
    const processes: Bpmn.IProcess[] = this.bpmnXml.rootElements.filter((e) => e.$type === "bpmn:Process") as Bpmn.IProcess[];

    for (let i = 0; i < processes.length; i++) {
      if (processes[i].flowElements) {
        const flowElements: Bpmn.IFlowElement[] = processes[i].flowElements.filter((e) => {
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

  public getAllSubprocesses(): Bpmn.IFlowElement[] {
    return this.getFlowElementsOfType<Bpmn.IFlowElement>("bpmn:SubProcess");
  }

  public getAllBpmnObjects(): Bpmn.IFlowElement[] {
    return this.getFlowElementsOfTypes<Bpmn.IFlowElement>([
      "bpmn:StartEvent",
      "bpmn:UserTask",
      "bpmn:SendTask",
      "bpmn:IntermediateCatchEvent",
      "bpmn:SubProcess",
      "bpmn:ExclusiveGateway",
      "bpmn:ParallelGateway",
      "bpmn:SequenceFlow",
      "bpmn:EndEvent",
    ]);
  }

  public getSequenceFlowElements(): Bpmn.ISequenceFlow[] {
    return this.getFlowElementsOfType<Bpmn.ISequenceFlow>("bpmn:SequenceFlow");
  }

  public getFollowingSequenceFlowName(bpmnTaskId: string): string | undefined {
    const taskObj = this.getExistingActivityObject(bpmnTaskId);
    // Fix for multiple outgoings at the moment or no outgoings
    if (taskObj == null || taskObj.outgoing == null || taskObj.outgoing.length > 1) {
      return undefined;
    }
    // Sure that taskObj has only 1 outgoing
    const seqFlow = taskObj.outgoing[taskObj.outgoing.length - 1];
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) {
      // Ignore empty flow names
      return seqFlow.name;
    } else {
      return undefined;
    }
  }

  /**
   * Returns the name of the sequence flow that reaches the target element, from the source element
   * @param targetId the target element
   * @param sourceId the sequence flow whichs name is returned is an outgoing flow from this source element
   */
  public getPreviousSequenceFlowName(targetId: string, sourceId: string): string | undefined {
    const sourceObj = this.getExistingActivityObject(sourceId);

    if (sourceObj?.outgoing) {
      for (const outgoing of sourceObj.outgoing) {
        if (outgoing.targetRef) {
          const queue = [outgoing.targetRef];
          const visited: { [id: string]: boolean } = {
            [outgoing.targetRef.id]: true,
          };
          // Check all targets that are reachable directly or connected via ExclusiveGateways
          while (queue.length) {
            const curElem = queue.shift();
            if (curElem) {
              if (curElem.id === targetId) {
                if (outgoing.name != null && outgoing.name.trim().length > 0) {
                  // Ignore empty flow names
                  return outgoing.name;
                } else {
                  return undefined;
                }
              }
              if (curElem.$type === "bpmn:ExclusiveGateway") {
                if (curElem.outgoing) {
                  for (const gwOut of curElem.outgoing) {
                    if (gwOut.targetRef) {
                      if (!visited[gwOut.targetRef.id]) {
                        visited[gwOut.targetRef.id] = true;
                        queue.push(gwOut.targetRef);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return undefined;
  }

  public getSharedOutgoingElementId(taskIds: string[]): string | undefined {
    const map: { [key: string]: number } = {};
    taskIds.forEach((taskId) => {
      const obj = this.getExistingActivityObject(taskId);
      obj?.incoming?.forEach((inc) => {
        if (map[inc.sourceRef.id] != null) {
          map[inc.sourceRef.id]++;
        } else {
          map[inc.sourceRef.id] = 1;
        }
      });
    });

    let biggestKey = undefined;
    let biggestLength = 0;
    for (const key in map) {
      if (biggestLength < map[key]) {
        biggestKey = key;
        biggestLength = map[key];
      }
    }

    return biggestKey;
  }

  public getLaneNumberOfElement(element: Bpmn.IFlowNode, laneDictionaries: ILaneDictionary[]): number | undefined {
    for (const laneDictionary of laneDictionaries) {
      const index: number = laneDictionary.ObjectIdsInLane.indexOf(element.id);
      if (index > -1) {
        return laneDictionary.rowNumber;
      }
    }
    return undefined;
  }

  public checkCompatibilityOfChangedProcess(runningInstances: IInstanceDetails[], userInstances: IInstanceDetails[]): boolean {
    let actualRunningTasks: IRunningTaskLane[] = [];
    for (const runInstance of runningInstances) {
      const todos = filterTodosForInstance(userInstances, runInstance.instanceId);
      const value = todos.map((t): IRunningTaskLane => {
        return { bpmnLaneId: t.bpmnLaneId, bpmnTaskId: t.bpmnTaskId } as IRunningTaskLane;
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

  public getDecisionTasksForTask(bpmnTaskId: string, userLanguage: string): IDecisionTask[] {
    let decisionTasks: IDecisionTask[] = [];

    const processObject = this.getExistingActivityObject(bpmnTaskId);

    if (processObject != null && processObject.$type === "bpmn:ExclusiveGateway") {
      return this.getTaskIdsAfterGateway(bpmnTaskId, userLanguage);
    }

    if (this.isOneOfNextActivityOfType(bpmnTaskId, "bpmn:ExclusiveGateway")) {
      // TaskTitle = todo != null ? todo.displayName : tl("Entscheidung");
      const nextActivites = this.getNextActivities(bpmnTaskId);

      for (const tmp of nextActivites) {
        if (tmp.$type === "bpmn:ExclusiveGateway") {
          const list = this.getTaskIdsAfterGateway(tmp.id, userLanguage);
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
    if (taskObject?.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      const obj = taskObject.boundaryEventRefs.find((b) => b.eventDefinitions && b.eventDefinitions.find((ed) => ed.$type === type) != null);
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
    const obj = flowElements.find((f) => f.id === bpmnTaskId);
    if (obj != null) {
      const event = obj as Bpmn.IIntermediateCatchEvent;
      if (event.eventDefinitions != null && event.eventDefinitions.length > 0) {
        const def = event.eventDefinitions.find((def) => def.$type === type);
        return def != null;
      }
    }
    return false;
  }

  public getIntermediateCatchEvent(bpmnTaskId: string, type: string): Bpmn.IBaseElement | undefined {
    const flowElements = this.getEvents(this.processId(), "bpmn:IntermediateCatchEvent");
    const obj = flowElements.find((f) => f.id === bpmnTaskId);
    if (obj != null) {
      const event = obj as Bpmn.IIntermediateCatchEvent;
      if (event.eventDefinitions != null && event.eventDefinitions.length > 0) {
        const def = event.eventDefinitions.find((def) => def.$type === type);
        return def;
      }
    }
    return undefined;
  }

  public getBoundaryDecisionTasksForTask(bpmnTaskId: string): IDecisionTask[] {
    const boundaryDecisionTask: IDecisionTask[] = [];
    const taskObject = this.getExistingActivityObject(bpmnTaskId);

    if (taskObject != null && taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      for (const tmpBoundary of taskObject.boundaryEventRefs) {
        if (tmpBoundary.eventDefinitions) {
          boundaryDecisionTask.push({
            bpmnTaskId: tmpBoundary.id,
            name: tmpBoundary.name,
            isBoundaryEvent: true,
            type: DecisionTaskTypes.Boundary,
            boundaryEventType: tmpBoundary.eventDefinitions[tmpBoundary.eventDefinitions.length - 1].$type,
          } as IDecisionTask);
        }
      }
    }

    return boundaryDecisionTask;
  }

  private removeLanesWithoutShape(): void {
    if (this.bpmnXml === undefined) {
      throw new Error("bpmnXml is undefined, please load bpmn XML first!");
    }

    const process = this.getProcess(this.processId());
    const diagram = this.bpmnXml.diagrams[0];
    if (process.laneSets) {
      const laneSet = process.laneSets[0];

      laneSet.lanes = laneSet.lanes.filter((lane) => {
        for (const planeElement of diagram.plane.planeElement) {
          if (planeElement.$type === "bpmndi:BPMNShape") {
            const bpmndiBPMNShape: Bpmndi.IBPMNShape = planeElement as Bpmndi.IBPMNShape;
            if (bpmndiBPMNShape.bpmnElement && bpmndiBPMNShape.bpmnElement.id === lane.id) {
              return true;
            }
          }
        }
        return false;
      });
    }
  }

  public setFlowName(sourceTaskId: string, targetTaskId: string, name: string): void {
    const obj = this.getFlowObject(sourceTaskId, targetTaskId);
    if (obj) {
      obj.name = name;
    }
  }

  public getFlowName(sourceTaskId: string, targetTaskId: string): string | undefined {
    const flowObj = this.getFlowObject(sourceTaskId, targetTaskId);
    if (flowObj != null) {
      return flowObj.name;
    }
    return undefined;
  }

  private getFlowObject(sourceTaskId: string, targetTaskId: string): Bpmn.IFlowElement | undefined {
    const sourceTask = this.getExistingActivityObject(sourceTaskId);
    let targetObj = null;
    if (sourceTask == null) {
      return undefined;
    }

    if (sourceTask.outgoing?.length === 1 && getLastArrayEntry(sourceTask.outgoing)?.targetRef.$type === "bpmn:ExclusiveGateway") {
      const gateway = getLastArrayEntry(sourceTask.outgoing)?.targetRef;
      targetObj = gateway?.outgoing?.find((out) => out.targetRef.id === targetTaskId);
    } else {
      targetObj = sourceTask.outgoing?.find((out) => out.targetRef.id === targetTaskId);
    }
    return targetObj;
  }

  public hasTimerStartEvent(): boolean {
    return this.getTimerStartEvent() != null;
  }

  public hasMailStartEvent(): boolean {
    return (
      this.getStartEvents(this.processId()).find(
        (start) => start.eventDefinitions != null && start.eventDefinitions.find((ev) => ev.$type === "bpmn:MessageEventDefinition") != null,
      ) != null
    );
  }

  public hasStandardStartEvent(): boolean {
    return this.getStartEvents(this.processId()).find((start) => start.eventDefinitions == null) != null;
  }

  public getTimerStartEvent(): Bpmn.IStartEvent | undefined {
    return this.getStartEvents(this.processId()).find(
      (start) => start.eventDefinitions != null && start.eventDefinitions.find((ev) => ev.$type === "bpmn:TimerEventDefinition") != null,
    );
  }

  public getShapeIdAndTypeFromBpmnElementId(bpmnTaskId: string): { type: Bpmn.ElementType; id: string } | undefined {
    const shape = this.processDiagram.getShapeFromDiagram(bpmnTaskId);
    if (shape != null) {
      const obj = this.getExistingActivityObject(bpmnTaskId);
      if (obj) {
        return { type: obj.$type, id: shape.id };
      } else {
        return undefined;
      }
    }
    return undefined;
  }
}
