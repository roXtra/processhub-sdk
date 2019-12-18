declare module "modeler/bpmn/dc" {
  namespace Dc {

    export interface IFont {
      readonly $type: "dc:Font";
      name: string;
      size: number;
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isStrikeThrough: boolean;
    }

    export interface IPoint {
      readonly $type: "dc:Point";
      x: number;
      y: number;
    }

    export interface IBounds {
      readonly $type: "dc:Bounds";
      x: number;
      y: number;
      width: number;
      height: number;
    }

    export type dcType = "dc:Font" | "dc:Point" | "dc:Bounds";
  }
}
