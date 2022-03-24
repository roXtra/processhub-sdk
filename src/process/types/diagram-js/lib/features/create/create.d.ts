declare module "diagram-js/lib/features/create/Create.js" {
  import EventBus from "diagram-js/lib/core/EventBus.js";
  import { Base } from "diagram-js/lib/model/index.js";
  import Canvas from "diagram-js/lib/core/Canvas.js";

  export default class Create {
    constructor(eventBus: EventBus, dragging: {}, rules: {}, modeling: {}, canvas: Canvas, styles: {}, graphicsFactory: {});

    public start(event: Event, shape: Base, context: { source?: Base }): void;
  }
}
