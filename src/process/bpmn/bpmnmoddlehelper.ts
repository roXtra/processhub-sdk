import BpmnModdle from "bpmn-moddle";
import { BpmnProcess } from "./bpmnprocess";
import { ProcessResult } from "../processinterfaces";
import { ILoadTemplateReply } from "../legacyapi";
import { createId } from "../../tools/guid";
import { tl } from "../../tl";

export const bpmnModdleInstance: BpmnModdle = new BpmnModdle([], {});

// Basis-Bpmn-Prozess erzeugen
export async function createBpmnTemplate(userLanguage: string): Promise<ILoadTemplateReply> {
  const xmlStr =
    "<?xml version='1.0' encoding='UTF-8'?>" +
    "<bpmn:definitions xmlns:bpmn='http://www.omg.org/spec/BPMN/20100524/MODEL' id='Definition_" +
    createId() +
    "'>" +
    "</bpmn:definitions>";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromXmlRes = await bpmnModdleInstance.fromXML(xmlStr);
  if (Array.isArray(fromXmlRes)) {
    throw fromXmlRes[0];
  }
  // Basisknoten anlegen - gleichzeitig ein gutes Beispiel für den Umgang mit moddle

  // Beispiele für Zugriffe auf Xml siehe
  // https://github.com/bpmn-io/bpmn-moddle/tree/master/test/spec/xml

  // 1 Prozessknoten mit 1 unbenannten Teilnehmer (=Lane)
  const processId = BpmnProcess.getBpmnId("bpmn:Process");
  const startEventObject = bpmnModdleInstance.create("bpmn:StartEvent", { id: BpmnProcess.getBpmnId("bpmn:StartEvent"), incoming: [] });
  startEventObject.outgoing = [];
  const endEventObject = bpmnModdleInstance.create("bpmn:EndEvent", { id: BpmnProcess.getBpmnId("bpmn:EndEvent"), outgoing: [] });
  endEventObject.incoming = [];
  const task = bpmnModdleInstance.create("bpmn:UserTask", { id: BpmnProcess.getBpmnId("bpmn:UserTask"), name: tl("Aufgabe 1", userLanguage), extensionElements: undefined });
  task.incoming = [];
  task.outgoing = [];
  const task2 = bpmnModdleInstance.create("bpmn:UserTask", { id: BpmnProcess.getBpmnId("bpmn:UserTask"), name: tl("Aufgabe 2", userLanguage), extensionElements: undefined });
  task2.incoming = [];
  task2.outgoing = [];

  const initSequenceFlow = bpmnModdleInstance.create("bpmn:SequenceFlow", {
    id: BpmnProcess.getBpmnId("bpmn:SequenceFlow"),
    sourceRef: startEventObject,
    targetRef: task,
  });
  task.incoming.push(initSequenceFlow);
  startEventObject.outgoing.push(initSequenceFlow);

  const initSequenceFlow2 = bpmnModdleInstance.create("bpmn:SequenceFlow", {
    id: BpmnProcess.getBpmnId("bpmn:SequenceFlow"),
    sourceRef: task,
    targetRef: task2,
  });
  task2.incoming.push(initSequenceFlow2);
  task.outgoing.push(initSequenceFlow2);

  const initSequenceFlow3 = bpmnModdleInstance.create("bpmn:SequenceFlow", {
    id: BpmnProcess.getBpmnId("bpmn:SequenceFlow"),
    sourceRef: task2,
    targetRef: endEventObject,
  });
  endEventObject.incoming.push(initSequenceFlow3);
  task2.outgoing.push(initSequenceFlow3);

  const lane = bpmnModdleInstance.create("bpmn:Lane", { id: "Lane_7A0DD19E05A33282", name: tl("Ersteller", userLanguage), flowNodeRef: [startEventObject, task] });

  const lane2 = bpmnModdleInstance.create("bpmn:Lane", { id: "Lane_8EE2836B993DE74A", name: tl("Bearbeiter", userLanguage), flowNodeRef: [task2, endEventObject] });

  // ACHTUNG! Wenn hier einmal standardmäßig der "Teilnehmer 1" nicht mehr steht, dann müssen Tests angepasst werden
  const laneSet = bpmnModdleInstance.create("bpmn:LaneSet", {
    id: BpmnProcess.getBpmnId("bpmn:LaneSet"),
    lanes: [lane, lane2],
  });

  const bpmnProcessElement = bpmnModdleInstance.create("bpmn:Process", {
    id: processId,
    laneSets: [laneSet],
    isExecutable: true,
    flowElements: [startEventObject, task, task2, endEventObject, initSequenceFlow, initSequenceFlow2, initSequenceFlow3],
  });

  const bpmnParticipant = bpmnModdleInstance.create("bpmn:Participant", {
    id: BpmnProcess.getBpmnId("bpmn:Participant"),
    processRef: bpmnProcessElement,
    name: tl("Prozess", userLanguage, "processes"),
  });

  const bpmnCollaboration = bpmnModdleInstance.create("bpmn:Collaboration", {
    id: BpmnProcess.getBpmnId("bpmn:Collaboration"),
    participants: [bpmnParticipant],
  });

  const bpmnDiagram = bpmnModdleInstance.create("bpmndi:BPMNDiagram", {
    name: BpmnProcess.getBpmnId("bpmndi:BPMNDiagram"),
    plane: bpmnModdleInstance.create("bpmndi:BPMNPlane", {
      bpmnElement: bpmnCollaboration,
      planeElement: [],
    }),
  });
  // Moddle erzeugt 2 Objekte: Erstens ein Xml-Objekt, das vermutlich auf der Sax Xml Engine basiert.
  // Außerdem einen Context, der sich verhält wie ein Json-Objekt. Beide Objekte werden beim Ändern
  // synchronisiert, wie und warum das so ist, weiß ich nicht.
  // Scheinbar ist der Context besser (einfacher) geeignet für Zugriffe, während das Xml-Objekt
  // auf alle Fälle für die spätere Rückkonvertierung in einen Xml-String benötigt wird??

  // Variante 1: Knoten an Xml anhängen
  // bpmnXml.get("rootElements").push(bpmnCollaboration);
  // bpmnXml.get("rootElements").push(bpmnProcessElement);

  // Variante 2: Erzeugte Knoten in Context einhängen
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  fromXmlRes.rootElement.rootElements = [bpmnCollaboration, bpmnProcessElement];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  fromXmlRes.rootElement.diagrams = [bpmnDiagram];

  return {
    result: ProcessResult.Ok,
    bpmnContext: fromXmlRes,
    bpmnXml: fromXmlRes.rootElement,
  } as ILoadTemplateReply;
}
