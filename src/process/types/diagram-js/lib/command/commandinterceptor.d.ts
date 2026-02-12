declare module "diagram-js/lib/command/CommandInterceptor" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import { IBounds, IPoint } from "diagram-js";
  import { Shape, Base } from "diagram-js/lib/model";

  /**
   * A utility that can be used to plug-in into the command execution for
   * extension and/or validation.
   *
   * @param {EventBus} eventBus
   *
   * @example
   *
   * var inherits = require('inherits');
   *
   * var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
   *
   * function CommandLogger(eventBus) {
   *   CommandInterceptor.call(this, eventBus);
   *
   *   this.preExecute(function(event) {
   *     console.log('command pre-execute', event);
   *   });
   * }
   *
   * inherits(CommandLogger, CommandInterceptor);
   *
   */
  export default class CommandInterceptor {
    /**
     * A utility that can be used to plug-in into the command execution for
     * extension and/or validation.
     *
     * @param {EventBus} eventBus
     *
     * @example
     *
     * var inherits = require('inherits');
     *
     * var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
     *
     * function CommandLogger(eventBus) {
     *   CommandInterceptor.call(this, eventBus);
     *
     *   this.preExecute(function(event) {
     *     console.log('command pre-execute', event);
     *   });
     * }
     *
     * inherits(CommandLogger, CommandInterceptor);
     *
     */
    constructor(eventBus: EventBus);

    /**
     * Register an interceptor for a command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {String} [hook] command hook, i.e. preExecute, executed to listen on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} unwrap if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public on(
      events: string | string[],
      hook: "canExecute" | "preExecute" | "preExecuted" | "execute" | "executed" | "postExecute" | "postExecuted" | "revert" | "reverted",
      priority: number,
      handlerFn: Function,
      unwrap: boolean,
      that: {},
    ): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public canExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public preExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;
    public preExecute(events: "shape.delete", callback: (event: IShapeDeletePreExecuteEvent) => void, unwrap: boolean): void;
    public preExecute(events: "shape.create", callback: (event: IShapeCreateEvent) => void, unwrap: boolean): void;
    public preExecute(events: "elements.move", callback: (event: IElementsMoveEvent) => void, unwrap: boolean): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public preExecuted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public execute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public executed(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public postExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;
    public postExecute(events: "shape.resize", callback: (event: IShapeResizeEvent) => void): void;
    public postExecute(events: "shape.delete", callback: (event: IShapeDeleteEvent) => void, unwrap?: boolean): void;
    public postExecute(events: "shape.resize", callback: (event: IShapeResizeEvent) => void, unwrap: boolean): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public postExecuted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;
    public postExecuted(events: "shape.resize", callback: (event: IShapeResizeEvent) => void): void;
    public postExecuted(event: "elements.move", callback: (event: IElementsMoveEvent) => void, unwrap: boolean): void;
    public postExecuted(event: "shape.create", callback: (event: IShapeCreateEvent) => void, unwrap: boolean): void;
    public postExecuted(events: "shape.delete", callback: (event: IShapeDeleteEvent) => void, unwrap: boolean): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public revert(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public reverted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: {}): void;
  }

  export interface IShapeResizeEvent {
    minBounds: IBounds;
    newBounds: IBounds;
    oldBounds: IBounds;
    shape: Shape;
  }

  export interface IShapeDeleteEvent {
    context: {
      hints: {};
      oldParent: Shape;
      oldParentIndex: number;
      shape: Shape;
    };
    hints: {};
    shape: Shape;
  }

  export interface IShapeDeletePreExecuteEvent {
    hints: {};
    shape: Shape;
  }

  export interface IElementsMoveEvent {
    closure: {};
    delta: IPoint;
    hints: {};
    newParent?: Base;
    shapes: Shape[];
  }

  export interface IShapeCreateEvent {
    hints: {};
    parent?: Base;
    parentIndex: {};
    position: IPoint;
    shape: Shape;
  }
}
