declare module "diagram-js/lib/features/modeling/Modeling" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import CommandStack from "diagram-js/lib/command/CommandStack";
  import CommandHandler from "diagram-js/lib/command/CommandHandler";
  import ElementFactory from "diagram-js/lib/core/ElementFactory";
  import { IBounds, IPoint } from "diagram-js";
  import { Base, Connection, Shape, Label } from "diagram-js/lib/model";

  export default class Modeling {
    /**
     * The basic modeling entry point.
     *
     * @param {EventBus} eventBus
     * @param {ElementFactory} elementFactory
     * @param {CommandStack} commandStack
     */
    constructor(eventBus: EventBus, elementFactory: ElementFactory, commandStack: CommandStack);

    public getHandlers(): { [command: string]: Function };

    /**
     * Register handlers with the command stack
     *
     * @param {CommandStack} commandStack
     */
    public registerHandlers(commandStack: CommandStack): void;

    public moveShape(shape: Base, delta: {}, newParent: {}, newParentIndex: {}, hints: {}): void;

    /**
     * Update the attachment of the given shape.
     *
     * @param  {djs.mode.Base} shape
     * @param  {djs.model.Base} [newHost]
     */
    public updateAttachment(shape: Base, newHost: Base): void;

    /**
     * Move a number of shapes to a new target, either setting it as
     * the new parent or attaching it.
     *
     * @param {Array<djs.mode.Base>} shapes
     * @param {Point} delta
     * @param {djs.model.Base} [target]
     * @param {Boolean} [isAttach=false]
     * @param {Object} [hints]
     */
    public moveElements(shapes: Base[], delta: IPoint, target: Base, hints: { attach: boolean }): void;

    public moveConnection(connection: {}, delta: {}, newParent: {}, newParentIndex: {}, hints: {}): {};

    public layoutConnection(connection: {}, hints: {}): {};

    /**
     * Create connection.
     *
     * @param {djs.model.Base} source
     * @param {djs.model.Base} target
     * @param {Number} [targetIndex]
     * @param {Object|djs.model.Connection} attributs/connection
     * @param {djs.model.Base} parent
     * @param {Object} hints
     *
     * @return {djs.model.Connection} the created connection.
     */
    public createConnection(source: Base, target: Base, attrs: {}, parent: Base | undefined, hints: IConnectionHints): Connection;
    public createConnection(source: Base, target: Base, targetIndex: number, connection: Connection, parent: Base, hints: IConnectionHints): Connection;

    public createShape(shape: Base, position: {}, target: Base, targetIndex: number, hints: { attach: boolean }): {};

    public createLabel(labelTarget: Base, position: IPoint, options: ICreateLabelOptions, parent?: Base): Label;

    /**
     * Append shape to given source, drawing a connection
     * between source and the newly created shape.
     *
     * @param {djs.model.Shape} source
     * @param {djs.model.Shape|Object} shape
     * @param {Point} position
     * @param {djs.model.Shape} target
     * @param {Object} [hints]
     * @param {boolean} [hints.attach]
     * @param {djs.model.Connection|Object} [hints.connection]
     * @param {djs.model.Base} [hints.connectionParent]
     *
     * @return {djs.model.Shape} the newly created shape
     */
    public appendShape(source: Shape, shape: Shape, position: IPoint, target: Base, hints: { connection?: {}; connectionParent?: {}; attach?: boolean }): {};

    public removeElements(elements: Base[]): void;

    public distributeElements(groups: {}, axis: {}, dimension: {}): {};

    public removeShape(shape: Shape, hints: IRemoveShapeHints): void;

    public removeConnection(connection: Connection, hints?: {}): void;

    public replaceShape(oldshape: Base, newshape: Base, hints: {}): {};

    public pasteElements(tree: {}, topParent: {}, position: {}): {};
    public alignElements(elements: {}, alignment: {}): {};

    public resizeShape(shape: Base, newBounds: IBounds, minBounds?: IBounds): void;

    public createSpace(movingShapes: {}, resizingShapes: {}, delta: {}, direction: {}): {};
    public updateWaypoints(connection: {}, newWaypoints: {}, hints: {}): {};
    public reconnectStart(connection: {}, newSource: {}, dockingOrPoints: {}, hints: {}): {};
    public reconnectEnd(connection: Connection, newTarget: Shape, dockingOrPoints: IPoint | IPoint[], hints: {}): {};

    public connect(source: Shape, target: Shape, attrs: {}, hints: IConnectionHints): Connection;
    public _create(type: {}, attrs: {}): {};

    public toggleCollapse(shape: Base, hints: {}): {};
  }

  export interface IConnectionHints {
    connectionStart?: IPoint;
    connectionEnd?: IPoint;
  }

  export interface IRemoveShapeHints {
    nested: boolean;
  }

  export interface ICreateLabelOptions {
    id: string;
    hidden: boolean;
    businessObject?: {};
    width: number;
    height: number;
  }
}
