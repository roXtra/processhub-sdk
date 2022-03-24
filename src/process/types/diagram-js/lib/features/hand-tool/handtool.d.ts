declare module "diagram-js/lib/features/hand-tool/HandTool" {
  import EventBus from "diagram-js/lib/core/EventBus.js";
  import Canvas from "diagram-js/lib/core/Canvas.js";

  export default class HandTool {
    constructor(eventBus: EventBus, canvas: Canvas, dragging: {}, toolManager: {});
    public toggle(): void;
    public isActive(): boolean;
    public activateHand(event: Event): void;
  }
}
