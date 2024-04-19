/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference path="./dc.d.ts" />

declare module "modeler/bpmn/di" {
  import { Dc } from "modeler/bpmn/dc";
  import Base from "moddle/lib/base";

  namespace Di {
    export interface IDiagramElement extends Base {
      readonly $type: "di:DiagramElement" | "bpmndi:BPMNPlane" | "bpmndi:BPMNShape" | "bpmndi:BPMNEdge" | "bpmndi:BPMNLabel";
      id: string;
      extension?: IExtension;
    }

    export interface IEdge extends IDiagramElement {
      waypoint: Dc.IPoint[];
    }

    export interface IDiagram {
      id: string;
      name: string;
      documentation?: string;
      resolution?: number;
    }

    export interface INode extends IDiagramElement {}

    export interface IShape extends INode {
      bounds: Dc.IBounds;
    }

    export interface IPlane extends INode {
      planeElement: IDiagramElement[];
    }

    export interface ILabeledEdge extends IEdge {}

    export interface ILabeledShape extends IShape {}

    export interface ILabel extends INode {
      bounds: Dc.IBounds;
    }

    export interface IStyle {
      id: string;
    }

    export interface IExtension {
      readonly $type: "di:Extension";
      values: Element[];
    }

    export type diType = "di:Extension";
  }
}
