/// <reference path="./bpmn.d.ts" preserve="true" />
/// <reference path="./dc.d.ts" preserve="true" />
/// <reference path="./di.d.ts" preserve="true" />

declare module "modeler/bpmn/bpmndi" {
  import { Bpmn } from "modeler/bpmn/bpmn";
  import { Dc } from "modeler/bpmn/dc";
  import { Di } from "modeler/bpmn/di";

  namespace Bpmndi {
    enum ParticipantBandKind {}
    enum MessageVisibleKind {}

    export interface IBPMNDiagram extends Di.IDiagram {
      readonly $type: "bpmndi:BPMNDiagram";
      plane: IBPMNPlane;
      labelStyle?: IBPMNLabelStyle[];
    }

    export interface IBPMNPlane extends Di.IPlane {
      readonly $type: "bpmndi:BPMNPlane";
      bpmnElement: Bpmn.IBaseElement;
    }

    export interface IBPMNShape extends Di.ILabeledShape {
      readonly $type: "bpmndi:BPMNShape";
      bpmnElement: Bpmn.IBaseElement;
      isHorizontal: boolean;
      isExpanded: boolean;
      isMarkerVisible: boolean;
      label: IBPMNLabel;
      isMessageVisible: boolean;
      participantBandKind: ParticipantBandKind;
      choreographyActivityShape: IBPMNShape;
    }

    export interface IBPMNEdge extends Di.ILabeledEdge {
      readonly $type: "bpmndi:BPMNEdge";
      label?: IBPMNLabel;
      bpmnElement: Bpmn.IBaseElement;
      sourceElement?: Di.IDiagramElement;
      targetElement?: Di.IDiagramElement;
      messageVisibleKind: MessageVisibleKind;
    }

    export interface IBPMNLabel extends Di.ILabel {
      readonly $type: "bpmndi:BPMNLabel";
      labelStyle: IBPMNLabelStyle;
    }

    export interface IBPMNLabelStyle extends Di.IStyle {
      readonly $type: "bpmndi:BPMNLabelStyle";
      font: Dc.IFont;
    }

    export type bpmndiType = "bpmndi:BPMNDiagram" | "bpmndi:BPMNPlane" | "bpmndi:BPMNShape" | "bpmndi:BPMNEdge" | "bpmndi:BPMNLabel" | "bpmndi:BPMNLabelStyle";
  }
}
