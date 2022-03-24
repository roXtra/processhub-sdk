declare module "diagram-js/lib/features/snapping/CreateMoveSnapping.js" {
  import ElementRegistry from "diagram-js/lib/core/ElementRegistry.js";
  import EventBus from "diagram-js/lib/core/EventBus.js";
  import { Base, Shape } from "diagram-js/lib/model/index.js";
  import SnapContext, { SnapPoints } from "diagram-js/lib/features/snapping/SnapContext";
  import Snapping from "diagram-js/lib/features/snapping/Snapping";
  import IInitSnapEvent from "diagram-js/lib/features/snapping/Snapping";

  /**
   * Snap during create and move.
   */
  export default class CreateMoveSnapping {
    /**
     * Snap during create and move.
     *
     * @param {EventBus} elementRegistry
     * @param {EventBus} eventBus
     * @param {Snapping} snapping
     */
    constructor(elementRegistry: ElementRegistry, eventBus: EventBus, snapping: Snapping);

    public initSnap(event: IInitSnapEvent): SnapContext;
    public addSnapTargetPoints(snapPoints: SnapPoints, shape: Shape, target: Base): SnapPoints;
    public getSnapTargets(shape: Shape, target: Base): SnapPoints;
  }
}
