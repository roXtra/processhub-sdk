import * as BpmnProcess from "./bpmnprocess.js";
import { Bpmn, Bpmndi } from "../bpmn/index.js";
import { bpmnModdleInstance } from "./bpmnmoddlehelper.js";
import { Dc } from "modeler/bpmn/dc";
import { IRowDetails } from "../phclient.js";
import { getLastArrayEntry } from "../../tools/array.js";

export class Waypoint {
  x: number;
  y: number;

  constructor(xParam: number, yParam: number) {
    this.x = xParam;
    this.y = yParam;
  }
}

export interface ILaneDictionary {
  rowNumber: number;
  laneId: string;
  ObjectIdsInLane: string[];
}

export class BpmnProcessDiagram {
  public static readonly SPACE_BETWEEN_TASKS: number = 60;
  public static readonly TASK_WIDTH: number = 100;
  public static readonly GATEWAY_Y_POS: number = 42;

  public static readonly SPACE_TO_LOWER_JUMP_SF: number = 20;

  private bpmnProcess: BpmnProcess.BpmnProcess;

  constructor(process: BpmnProcess.BpmnProcess) {
    this.bpmnProcess = process;
  }

  // Diagram properties
  private diagramLaneHeight = 120;
  private diagramXStartParam = 400;
  private diagramYStartParam = 0;

  // Gibt erstes Diagram Element aus XML zurück
  private getDiagramElement(): Bpmndi.IBPMNDiagram {
    return this.bpmnProcess.getBpmnDefinitions().diagrams[0];
  }

  public getShapeFromDiagram(shapeId: string): Bpmndi.IBPMNShape | undefined {
    const diagram = this.getDiagramElement();
    for (const planeElement of diagram.plane.planeElement) {
      if (planeElement.$type === "bpmndi:BPMNShape" && (planeElement as Bpmndi.IBPMNShape).bpmnElement.id === shapeId) {
        return planeElement as Bpmndi.IBPMNShape;
      }
    }
    return undefined;
  }

  public getAllShapes(): Bpmndi.IBPMNShape[] {
    const res: Bpmndi.IBPMNShape[] = [];
    const diagram = this.getDiagramElement();
    for (const planeElement of diagram.plane.planeElement) {
      res.push(planeElement as Bpmndi.IBPMNShape);
    }
    return res;
  }

  public getEndEventShapes(): Bpmndi.IBPMNShape[] {
    const res: Bpmndi.IBPMNShape[] = [];
    const diagram = this.getDiagramElement();
    for (const planeElement of diagram.plane.planeElement) {
      if (planeElement.$type === "bpmndi:BPMNShape" && (planeElement as Bpmndi.IBPMNShape).bpmnElement.$type === "bpmn:EndEvent") {
        res.push(planeElement as Bpmndi.IBPMNShape);
      }
    }
    return res;
  }

  public generateBPMNDiagram(processId: string, rowDetails: IRowDetails[]): void {
    const copyTaskIdsOrderFromTable: IRowDetails[] = JSON.parse(JSON.stringify(rowDetails));
    const diagram = this.getDiagramElement();
    // Für die Berechnung der gesamt Breite
    const process = this.bpmnProcess.getProcess(processId);
    const amountOfProcesses = process.flowElements.filter((e) => e.$type === "bpmn:UserTask" || e.$type === "bpmn:SendTask").length;
    const amountOfSequences = process.flowElements.filter((e) => e.$type === "bpmn:SequenceFlow").length;

    const allGateways = this.bpmnProcess.getAllExclusiveGateways();

    const amountOfOutgoingsOnGateways = 0;
    let amountOfOutgoingsOnTasksUnderpass = 0;

    let sortedTasks: Bpmn.IFlowNode[] = [];
    if (copyTaskIdsOrderFromTable.length > 0) {
      const tmp = this.bpmnProcess.getExistingActivityObject(copyTaskIdsOrderFromTable[0].taskId);
      if (tmp != null && tmp.$type === "bpmn:StartEvent") {
        copyTaskIdsOrderFromTable.splice(0, 1);
      }
    }

    sortedTasks = copyTaskIdsOrderFromTable.map((row) => this.bpmnProcess.getExistingTask(this.bpmnProcess.processId(), row.taskId));

    copyTaskIdsOrderFromTable.forEach((row) => {
      if (row.jumpsTo.length > 0) {
        amountOfOutgoingsOnTasksUnderpass += row.jumpsTo.length - 1;
      }
    });

    // Anzahl der Prozesse + anzahl der seuqenzen + feste werte für anfang und ende
    const poolWidth: number =
      amountOfProcesses * BpmnProcessDiagram.TASK_WIDTH +
      (amountOfSequences - amountOfOutgoingsOnGateways) * BpmnProcessDiagram.SPACE_BETWEEN_TASKS +
      allGateways.length * 36 +
      // - (amountOfProcessesWithMultipleOutgoing * BpmnProcessDiagram.SPACE_BETWEEN_TASKS)
      200;
    // Die lane ist genau 30 pixel kürzer wie der Pool wegen der Beschriftung!
    const laneWidth: number = poolWidth - 30;
    // Diagramm Elements entfernen bevor man sie erneut hinzufügt
    diagram.plane.planeElement = [];

    // Lanesets vom Prozess ins Diagramm
    const lanes = this.bpmnProcess.getSortedLanesWithTasks(processId);

    const laneDictionaries: ILaneDictionary[] = [];
    // 20 => buffer and 10 is multiply factor for each extra flow
    const extraFlowFactor: number =
      allGateways.length === 0 && amountOfOutgoingsOnTasksUnderpass === 0
        ? 0
        : BpmnProcessDiagram.SPACE_TO_LOWER_JUMP_SF + amountOfOutgoingsOnGateways * 10 + amountOfOutgoingsOnTasksUnderpass * 10;
    const lastLaneHeight: number = this.diagramLaneHeight + extraFlowFactor;
    if (lanes.length > 0) {
      // Zeichnen der Lanes
      let tmpYParam: number = this.diagramYStartParam;
      for (let i = 0; i < lanes.length; i++) {
        const laneObject = lanes[i];

        // 30 weniger breit und 30 weiter nach rechts, da lange nicht so breit wie der Pool!
        const tmpLaneObj = this.createShape(laneObject, this.diagramXStartParam + 30, tmpYParam, laneWidth, i + 1 === lanes.length ? lastLaneHeight : this.diagramLaneHeight);
        diagram.plane.planeElement.push(tmpLaneObj);
        tmpYParam += this.diagramLaneHeight;

        // Von Jedem Objekt in einer Lane wird die ID hier gespeichert
        const objectsForLane: string[] = [];
        for (const object of laneObject.flowNodeRef) {
          objectsForLane.push(object.id);
        }

        const laneDictionary: ILaneDictionary = {
          laneId: laneObject.id,
          rowNumber: i,
          ObjectIdsInLane: objectsForLane,
        };

        laneDictionaries.push(laneDictionary);
      }

      // Zeichnen des Pools
      for (const object of this.bpmnProcess.getCollaborationElements()) {
        const participants = object.participants;

        // Mit der Anzahl der Lanes kann die Gesamtpool Höhe berechnet werden
        const lanes = this.bpmnProcess.getSortedLanesWithTasks(processId);

        for (let t = 0; t < participants.length; t++) {
          let poolHeight: number = this.diagramLaneHeight * lanes.length;
          poolHeight += extraFlowFactor;
          const shape = this.createShape(participants[t], this.diagramXStartParam, this.diagramYStartParam, poolWidth, poolHeight);
          diagram.plane.planeElement.push(shape);
        }
      }

      // Zechnen aller Objekte im Diagramm
      const process = this.bpmnProcess.getProcess(processId);

      const flowElements = process.flowElements;
      let drawObjectList: Bpmn.IFlowNode[] = [];
      let startElementObject = flowElements.filter((e) => e.$type === "bpmn:StartEvent");
      startElementObject = startElementObject.sort((a, b) => {
        if ((a as Bpmn.IStartEvent).eventDefinitions == null) return -1;

        if ((b as Bpmn.IStartEvent).eventDefinitions == null) return 1;
        return 0;
      });
      drawObjectList = drawObjectList.concat(startElementObject);

      drawObjectList = drawObjectList.concat(sortedTasks);

      const gates: Bpmn.IFlowNode[] = this.bpmnProcess.getAllExclusiveGateways();
      // DrawObjectList = drawObjectList.concat(gats);

      // this.recursiveGenerateDiagramTasks(diagram, laneDictionaries, startElementObject[0], (this.diagramXStartParam + 100));
      const ends = this.bpmnProcess.getEndEvents(this.bpmnProcess.processId());
      drawObjectList = drawObjectList.concat(ends);

      for (let i = 0; i < drawObjectList.length; i++) {
        const task = drawObjectList[i];
        if (task.$type !== "bpmn:EndEvent" && task.outgoing != null && task.outgoing.find((out) => out.targetRef.$type === "bpmn:ExclusiveGateway")) {
          const gate = gates.find((g) => g.incoming && g.incoming.find((inc) => inc.sourceRef.id === task.id) != null);
          if (gate) {
            if (drawObjectList.find((obj) => obj.id === gate.id) == null) {
              drawObjectList.splice(i + 1, 0, gate);
            }
          }
        }
      }

      this.drawAllTasks(diagram, laneDictionaries, drawObjectList, this.diagramXStartParam + 100);

      // SequenceFlows vom Prozess ins Diagramm
      const sequenceFlows: Bpmn.ISequenceFlow[] = this.bpmnProcess.getSequenceFlowElements();

      // Get all "normal" sf's
      const normalSequenceFlows: Bpmn.ISequenceFlow[] = [];

      for (let i = 0; i < drawObjectList.length; i++) {
        const thisObj = drawObjectList[i];
        const nextObj = drawObjectList[i + 1];
        let tmpSf = sequenceFlows.find((sf) => sf.sourceRef.id === thisObj.id && sf.targetRef.id === nextObj.id);
        if (tmpSf != null || thisObj.$type === "bpmn:StartEvent") {
          if (thisObj.$type === "bpmn:StartEvent") {
            tmpSf = sequenceFlows.find((sf) => sf.sourceRef.id === thisObj.id);
          }
          if (tmpSf != null) {
            normalSequenceFlows.push(tmpSf);
          }
        }
      }

      const jumpSequenceFlows = sequenceFlows.filter((sf) => !normalSequenceFlows.includes(sf));

      for (const flowObject of normalSequenceFlows) {
        this.generateSequenceFlow(diagram, flowObject, false);
      }

      let numberOfJumpEdge = 0;
      for (const flowObject of jumpSequenceFlows) {
        this.generateSequenceFlow(diagram, flowObject, true, numberOfJumpEdge, laneDictionaries);
        numberOfJumpEdge++;
      }
    }
  }

  private drawAllTasks(diagram: Bpmndi.IBPMNDiagram, laneDictionaries: ILaneDictionary[], taskList: Bpmn.IFlowNode[], xParam: number): void {
    for (const workingObject of taskList) {
      let iconWidth = BpmnProcessDiagram.TASK_WIDTH;
      const sizeStartAndEndEvent = 36;
      let iconHeight = 80;
      // Jedes element MUSS in einer Lane sein! Wenn hier null returned wird, dann ist das ein FEHLER
      const laneNumber = this.bpmnProcess.getLaneNumberOfElement(workingObject, laneDictionaries);
      if (laneNumber === undefined) {
        throw new Error("Error: Element has no lane assignment.");
      }

      // Berechnung der Y-Koordinate für jedes Element (Task)
      // 30 ist hier der optimal eingerückte wert für die LaneHöhe
      let yParam = this.diagramYStartParam + 20 + laneNumber * this.diagramLaneHeight;

      // Weil größe des icons anders
      if (workingObject.$type === "bpmn:StartEvent" || workingObject.$type === "bpmn:EndEvent" || workingObject.$type === "bpmn:ExclusiveGateway") {
        // Let amountOfStartEvents = taskList.filter(obj => obj.$type === "bpmn:StartEvent");

        // let startEventHeightShift = amountOfStartEvents.length == 2 ? 20 : 40;
        iconWidth = sizeStartAndEndEvent;
        iconHeight = sizeStartAndEndEvent;

        yParam = this.diagramYStartParam + BpmnProcessDiagram.GATEWAY_Y_POS + laneNumber * this.diagramLaneHeight;

        const standardStartEvent = taskList.filter((t) => t.$type === "bpmn:StartEvent" && (t as Bpmn.IStartEvent).eventDefinitions == null);
        const startEvents = taskList.filter((t) => t.$type === "bpmn:StartEvent");

        const startEvent = workingObject as Bpmn.IStartEvent;
        if (startEvent.eventDefinitions != null && startEvent.eventDefinitions.length > 0) {
          if (standardStartEvent.length > 0 || (startEvents.length > 1 && getLastArrayEntry(startEvents)?.id === workingObject.id)) {
            xParam -= iconWidth + BpmnProcessDiagram.SPACE_BETWEEN_TASKS;
          }

          const isMessageStartEvent = getLastArrayEntry(startEvent.eventDefinitions)?.$type === "bpmn:MessageEventDefinition";
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          isMessageStartEvent ? (yParam -= 40) : (yParam += 40);
        }
      }

      const shape = this.createShape(workingObject, xParam, yParam, iconWidth, iconHeight);

      diagram.plane.planeElement.push(shape);

      // Über den xParam wird gesteuert wie viel weiter rechts das der nächste Task Liegt
      // Sollte sich ergeben aus der Taskbreite + einem gewissen Raum für den Pfeil (optimal sind 30px)
      xParam += iconWidth + BpmnProcessDiagram.SPACE_BETWEEN_TASKS;
    }
  }

  private generateSequenceFlow(
    diagram: Bpmndi.IBPMNDiagram,
    flowObject: Bpmn.ISequenceFlow,
    drawJumpFlow: boolean,
    numberOfJumpEdge = 0,
    laneDictionaries: ILaneDictionary[] = [],
  ): void {
    let waypoints: Waypoint[] = [];
    // Hole die beiden Diagramm Objekte von Quell und Ziel Objekt
    const sourceRef = flowObject.sourceRef;
    const sourceDiagramObject = this.getShapeFromDiagram(sourceRef.id);
    if (!sourceDiagramObject) {
      throw new Error("No diagram shape found for " + sourceRef.id);
    }
    const targetRef = flowObject.targetRef;
    const targetDiagramObject = this.getShapeFromDiagram(targetRef.id);
    if (!targetDiagramObject) {
      throw new Error("No diagram shape found for " + targetRef.id);
    }
    if (drawJumpFlow) {
      waypoints = this.getWaypointsBetweenObjectsUnderpass(sourceDiagramObject, targetDiagramObject, numberOfJumpEdge, laneDictionaries);
    } else {
      waypoints = this.getWaypointsBetweenObjects(sourceDiagramObject, targetDiagramObject);
    }

    const edgeObj = this.createEdge(flowObject, flowObject.sourceRef, flowObject.targetRef, waypoints);
    /*
        Let firstX = waypoints[0].x;
        let lastX  = waypoints.last().x;
        let firstY = waypoints[0].y;
        let lastY  = waypoints.last().y;

        let xDiff = firstX > lastX ? firstX - lastX : lastX - firstX;
        xDiff = xDiff / 2;
        let yDiff = firstY > lastY ? firstY - lastY : lastY - firstY;
        yDiff = yDiff / 2;

        let finalX = firstX > lastX ? lastX + xDiff : firstX + xDiff;
        let finalY = firstY > lastY ? lastY + yDiff : firstY + yDiff;

        if (drawJumpFlow) {
          finalX = firstX;
          finalY = firstY + yDiff;
        }

        let bounds = this.bpmnProcess.moddle.create("dc:Bounds", { x: finalX, y: finalY, width: 1, height: 1 });
        let label = this.bpmnProcess.moddle.create("bpmndi:BPMNLabel", {
          id: BpmnProcess.BpmnProcess.getBpmnId(DiagramShapeTypes.BPMNDI_EDGE),
          bounds: bounds
        });
        edgeObj.label = label;*/

    diagram.plane.planeElement.push(edgeObj);
  }

  private createShape(bpmnElement: Bpmn.IFlowNode, xParam: number, yParam: number, widthParam: number, heightParam: number): Bpmndi.IBPMNShape {
    const bounds = bpmnModdleInstance.create("dc:Bounds", { x: xParam, y: yParam, width: widthParam, height: heightParam });
    const shape = bpmnModdleInstance.create("bpmndi:BPMNShape", {
      id: BpmnProcess.BpmnProcess.getBpmnId("bpmndi:BPMNShape"),
      bounds: bounds,
      bpmnElement: bpmnElement,
    });
    return shape;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createEdge(bpmnElement: Bpmn.ISequenceFlow, sourceElement: any, targetElement: any, waypoints: Waypoint[]): Bpmndi.IBPMNEdge {
    const resultWaypoint: Dc.IPoint[] = [];
    // Waypoint einfügen
    for (const waypoint of waypoints) {
      const tmpWaypoint = bpmnModdleInstance.create("dc:Point", { x: waypoint.x, y: waypoint.y });
      resultWaypoint.push(tmpWaypoint);
    }

    const edge = bpmnModdleInstance.create("bpmndi:BPMNEdge", {
      id: BpmnProcess.BpmnProcess.getBpmnId("bpmndi:BPMNEdge"),
      bpmnElement: bpmnElement,
      sourceElement: sourceElement,
      targetElement: targetElement,
      waypoint: resultWaypoint,
    });
    return edge;
  }

  private getWaypointsBetweenObjects(sourceObject: Bpmndi.IBPMNShape, targetObject: Bpmndi.IBPMNShape): Waypoint[] {
    const result: Waypoint[] = [];

    const sourceBounds = sourceObject.bounds;
    const targetBounds = targetObject.bounds;

    // Der erste Waypoint (Start) startet immer auf der RECHTEN SEITE und in der MITTE des Shapes
    const sourceX: number = sourceBounds.x + sourceBounds.width;
    const sourceY: number = sourceBounds.y + sourceBounds.height / 2;
    const sourceWaypoint = new Waypoint(sourceX, sourceY);
    result.push(sourceWaypoint);

    // Der zweite Waypoint (Ziel) endet immer auf der LINKEN SEITE und in der MITTE des Shapes
    const targetX: number = targetBounds.x;
    const targetY: number = targetBounds.y + targetBounds.height / 2;
    const targetWaypoint = new Waypoint(targetX, targetY);

    const midBetweenObjects: number = sourceX + (targetX - sourceX) / 2;
    // 2 mittlere Waypoints für S-artige Kurve
    const upperWaypoint = new Waypoint(midBetweenObjects, sourceY);
    result.push(upperWaypoint);

    const lowerWaypoint = new Waypoint(midBetweenObjects, targetY);
    result.push(lowerWaypoint);

    // Letzter Waypoint darf erst hier in die Liste eingefügt werden, da die Waypoints nacheinander gezeichnet werden!
    result.push(targetWaypoint);

    return result;
  }

  private getWaypointsBetweenObjectsUnderpass(
    sourceObject: Bpmndi.IBPMNShape,
    targetObject: Bpmndi.IBPMNShape,
    numberOfJumpEdge: number,
    laneDictionaries: ILaneDictionary[],
  ): Waypoint[] {
    const result: Waypoint[] = [];

    const sourceBounds = sourceObject.bounds;
    const targetBounds = targetObject.bounds;

    // Der erste Waypoint (Start) startet immer auf der RECHTEN SEITE und in der MITTE des Shapes
    const sourceX: number = sourceBounds.x + sourceBounds.width / 2;
    const sourceY: number = sourceBounds.y + sourceBounds.height;
    const sourceWaypoint = new Waypoint(sourceX, sourceY);
    result.push(sourceWaypoint);

    // Der zweite Waypoint (Ziel) endet immer auf der LINKEN SEITE und in der MITTE des Shapes
    const targetX: number = targetBounds.x + targetBounds.width / 2;

    const targetY: number = targetBounds.y + targetBounds.height;
    const targetWaypoint = new Waypoint(targetX, targetY);

    let lowEdge = 10 + this.diagramLaneHeight * laneDictionaries.length; //  TargetY > sourceY ? targetY : sourceY;
    // lowEdge += BpmnProcessDiagram.SPACE_TO_LOWER_JUMP_SF;

    lowEdge += 10 * numberOfJumpEdge;

    // Let midBetweenObjects: number = sourceX + ((targetX - sourceX) / 2);
    // 2 mittlere Waypoints für S-artige Kurve
    // let upperWaypoint = new Waypoint(midBetweenObjects, sourceY);
    // result.push(upperWaypoint);

    const lowerWaypoint2 = new Waypoint(sourceX, lowEdge);
    result.push(lowerWaypoint2);

    const lowerWaypoint = new Waypoint(targetX, lowEdge);
    result.push(lowerWaypoint);

    // Letzter Waypoint darf erst hier in die Liste eingefügt werden, da die Waypoints nacheinander gezeichnet werden!
    result.push(targetWaypoint);

    return result;
  }
}
