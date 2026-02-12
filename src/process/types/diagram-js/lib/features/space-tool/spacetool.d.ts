declare module "diagram-js/lib/features/space-tool/SpaceTool" {
  import Canvas from "diagram-js/lib/core/Canvas";
  import EventBus from "diagram-js/lib/core/EventBus";
  import Dragging from "diagram-js/lib/features/dragging/Dragging";
  import Modeling from "diagram-js/lib/features/modeling/Modeling";
  import Rules from "diagram-js/lib/features/rules/Rules";
  import { IPoint } from "diagram-js";
  import { Base, Shape } from "diagram-js/lib/model";

  export default class SpaceTool {
    /**
     * Add or remove space by moving and resizing elements.
     *
     * @param {Canvas} canvas
     * @param {Dragging} dragging
     * @param {EventBus} eventBus
     * @param {Modeling} modeling
     * @param {Rules} rules
     * @param {ToolManager} toolManager
     * @param {Mouse} mouse
     */
    constructor(canvas: Canvas, dragging: Dragging, eventBus: EventBus, modeling: Modeling, rules: Rules, toolManager: unknown, mouse: unknown);

    /**
     * Activate space tool selection
     *
     * @param  {MouseEvent} event
     * @param  {Boolean} autoActivate
     */
    public activateSelection(event: Event, autoActivate?: boolean): void;

    /**
     * Activate make space
     *
     * @param  {MouseEvent} event
     */
    public activateMakeSpace(event: MouseEvent): void;

    /**
     * Make space.
     *
     * @param  {Array<djs.model.Shape>} movingShapes
     * @param  {Array<djs.model.Shape>} resizingShapes
     * @param  {Object} delta
     * @param  {number} delta.x
     * @param  {number} delta.y
     * @param  {string} direction
     * @param  {number} start - must match the value used in calculateAdjustments
     */
    public makeSpace(movingShapes: Shape[], resizingShapes: Shape[], delta: IPoint, direction: "s" | "n" | "e" | "w", start: number): void;

    /**
     * Initialize make space and return true if that was successful.
     *
     * @param {Event} event
     * @param {Object} context
     *
     * @return {Boolean} true, if successful
     */
    public init(event: Event, context: {}): boolean;

    /**
     * Get elements to be moved and resized.
     *
     * @param  {Array<djs.model.Shape>} elements
     * @param  {string} axis
     * @param  {number} delta
     * @param  {number} start - must match the value used in makeSpace
     *
     * @return {ICalculateAdjustmentsResult}
     */
    public calculateAdjustments(elements: Shape[], axis: "y" | "x", delta: number, start: number): ICalculateAdjustmentsResult;

    public toggle(): void;

    public isActive(): boolean;
  }

  export interface ICalculateAdjustmentsResult {
    movingShapes: Shape[];
    resizingShapes: Shape[];
  }
}
