declare module "bpmn-moddle/lib/bpmn-moddle.js" {
  export default BpmnModdle;

  import Factory from "moddle/lib/factory";
  import Moddle from "moddle/lib/moddle";

  import { Context } from "moddle-xml/lib/reader";
  import { Bpmn } from "modeler/bpmn/bpmn";
  import { Bpmndi } from "modeler/bpmn/bpmndi";
  import { Dc } from "modeler/bpmn/dc";
  import { Processhub } from "modeler/bpmn/processhub";

  type ModdleElement = Factory.ModddleElement;

  type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  /**
   * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
   *
   * @class BpmnModdle
   * @extends Moddle
   */
  class BpmnModdle extends Moddle {
    /**
     * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
     *
     * @class BpmnModdle
     * @extends Moddle
     *
     * @param {Object|Array} packages to use for instantiating the model
     * @param {Object} [options] additional options to pass over
     */
    constructor(packages?: {}[], options?: {});

    /**
     * Create an instance of the specified type.
     *
     * @method Moddle#create
     *
     * @example
     *
     * var foo = moddle.create('my:Foo');
     * var bar = moddle.create('my:Bar', { id: 'BAR_1' });
     *
     * @param  {String|Object} descriptor the type descriptor or name know to the model
     * @param  {Object} attrs   a number of attributes to initialize the model instance with
     * @return {Object}         model instance
     */
    public create(descriptor: Bpmn.ElementType, attrs: Partial<Bpmn.IBaseElement>): Bpmn.IBaseElement;

    public create(descriptor: "bpmn:DataOutputAssociation", attrs: Partial<Bpmn.IDataOutputAssociation>): Bpmn.IDataOutputAssociation;
    public create(descriptor: "bpmn:DataInputAssociation", attrs: Partial<Bpmn.IDataInputAssociation>): Bpmn.IDataInputAssociation;
    public create(descriptor: "bpmn:DataObjectReference", attrs: Partial<Bpmn.IDataObjectReference>): Bpmn.IDataObjectReference;
    public create(descriptor: "bpmn:DataStoreReference", attrs: Partial<Bpmn.IDataStoreReference>): Bpmn.IDataStoreReference;
    public create(descriptor: "bpmn:Collaboration", attrs: Partial<Bpmn.ICollaboration>): Bpmn.ICollaboration;
    public create(descriptor: "bpmn:BoundaryEvent", attrs: Partial<Bpmn.IBoundaryEvent>): Bpmn.IBoundaryEvent;
    public create(descriptor: "bpmn:Definitions", attrs: Partial<Bpmn.IDefinitions>): Bpmn.IDefinitions;
    public create(descriptor: "bpmn:EndEvent", attrs: Partial<Bpmn.IEndEvent>): Bpmn.IEndEvent;
    public create(descriptor: "bpmn:Error", attrs: Partial<Bpmn.IError>): Bpmn.IError;
    public create(descriptor: "bpmn:ErrorEventDefinition", attrs: Partial<Bpmn.IErrorEventDefinition>): Bpmn.IErrorEventDefinition;
    public create(descriptor: "bpmn:ExclusiveGateway", attrs: Partial<Bpmn.IExclusiveGateway>): Bpmn.IExclusiveGateway;
    public create(descriptor: "bpmn:ExtensionElements", attrs: Partial<Bpmn.IExtensionElements>): Bpmn.IExtensionElements;
    public create(descriptor: "bpmn:FormalExpression", attrs: Partial<Bpmn.IFormalExpression>): Bpmn.IFormalExpression;
    public create(descriptor: "bpmn:IntermediateCatchEvent", attrs: Partial<Bpmn.IIntermediateCatchEvent>): Bpmn.IIntermediateCatchEvent;
    public create(descriptor: "bpmn:Lane", attrs: Partial<Bpmn.ILane>): Bpmn.ILane;
    public create(descriptor: "bpmn:LaneSet", attrs: Partial<Bpmn.ILaneSet>): Bpmn.ILaneSet;
    public create(descriptor: "bpmn:MessageEventDefinition", attrs: Partial<Bpmn.IMessageEventDefinition>): Bpmn.IMessageEventDefinition;
    public create(descriptor: "bpmn:LinkEventDefinition", attrs: Partial<Bpmn.ILinkEventDefinition>): Bpmn.ILinkEventDefinition;
    public create(descriptor: "bpmn:Participant", attrs: Partial<Bpmn.IParticipant>): Bpmn.IParticipant;
    public create(descriptor: "bpmn:ParallelGateway", attrs: Partial<Bpmn.IParallelGateway>): Bpmn.IParallelGateway;
    public create(descriptor: "bpmn:Process", attrs: Partial<Bpmn.IProcess>): Bpmn.IProcess;
    public create(descriptor: "bpmn:ScriptTask", attrs: Partial<Bpmn.IScriptTask>): Bpmn.IScriptTask;
    public create(descriptor: "bpmn:SendTask", attrs: Partial<Bpmn.ISendTask>): Bpmn.ISendTask;
    public create(descriptor: "bpmn:ServiceTask", attrs: Partial<Bpmn.IServiceTask>): Bpmn.IServiceTask;
    public create(descriptor: "bpmn:SequenceFlow", attrs: Partial<Bpmn.ISequenceFlow>): Bpmn.ISequenceFlow;
    public create(descriptor: "bpmn:SignalEventDefinition", attrs: Partial<Bpmn.ISignalEventDefinition>): Bpmn.ISignalEventDefinition;
    public create(descriptor: "bpmn:StartEvent", attrs: Partial<Bpmn.IStartEvent>): Bpmn.IStartEvent;
    public create(descriptor: "bpmn:SubProcess", attrs: Partial<Bpmn.ISubProcess>): Bpmn.ISubProcess;
    public create(descriptor: "bpmn:TimerEventDefinition", attrs: Partial<Bpmn.ITimerEventDefinition>): Bpmn.ITimerEventDefinition;
    public create(descriptor: "bpmn:TerminateEventDefinition", attrs: Partial<Bpmn.ITerminateEventDefinition>): Bpmn.ITerminateEventDefinition;
    public create(descriptor: "bpmn:UserTask", attrs: Partial<Bpmn.IUserTask>): Bpmn.IUserTask;
    public create(descriptor: "bpmn:TextAnnotation", attrs: Partial<Bpmn.ITextAnnotation>): Bpmn.ITextAnnotation;
    public create(descriptor: "bpmn:Association", attrs: Partial<Bpmn.IAssociation>): Bpmn.IAssociation;

    public create(descriptor: "bpmndi:BPMNDiagram", attrs: Partial<Bpmndi.IBPMNDiagram>): Bpmndi.IBPMNDiagram;
    public create(descriptor: "bpmndi:BPMNEdge", attrs: Partial<Bpmndi.IBPMNEdge>): Bpmndi.IBPMNEdge;
    public create(descriptor: "bpmndi:BPMNPlane", attrs: Partial<Bpmndi.IBPMNPlane>): Bpmndi.IBPMNPlane;
    public create(descriptor: "bpmndi:BPMNShape", attrs: Partial<Bpmndi.IBPMNShape>): Bpmndi.IBPMNShape;
    public create(descriptor: "bpmndi:BPMNLabel", attrs: Partial<Bpmndi.IBPMNLabel>): Bpmndi.IBPMNLabel;

    public create(descriptor: "dc:Bounds", attrs: Partial<Dc.IBounds>): Dc.IBounds;
    public create(descriptor: "dc:Point", attrs: Partial<Dc.IPoint>): Dc.IPoint;

    /**
     * Creates an unknown-element type to be used within model instances.
     *
     * This can be used to create custom elements that lie outside the meta-model.
     * The created element contains all the meta-data required to serialize it
     * as part of meta-model elements.
     *
     * @method Moddle#createunknown
     *
     * @example
     *
     * var foo = moddle.createunknown('vendor:Foo', 'http://vendor', {
     *   value: 'bar'
     * });
     *
     * var container = moddle.create('my:Container', 'http://my', {
     *   unknown: [ foo ]
     * });
     *
     * // go ahead and serialize the stuff
     *
     *
     * @param  {String} name  the name of the element
     * @param  {String} nsUri the namespace uri of the element
     * @param  {Object} [properties] a map of properties to initialize the instance with
     * @return {Object} the unknown type instance
     */
    public createunknown(
      name: "processhub:inputOutput",
      nsUri: "http://processhub.com/schema/1.0/bpmn",
      properties: Partial<Processhub.IInputOutput>,
    ): Processhub.IInputOutput;
    public createunknown(
      name: "processhub:inputParameter",
      nsUri: "http://processhub.com/schema/1.0/bpmn",
      properties: Partial<Processhub.IInputParameter>,
    ): Processhub.IInputParameter;

    /**
     * Instantiates a BPMN model tree from a given xml string.
     *
     * @param {String}   xmlStr
     * @param {String}   [typeName='bpmn:Definitions'] name of the root element
     * @param {Object}   [options]  options to pass to the underlying reader
     *
     * @returns {Promise<ParseResult, ParseError>}
     */
    public fromXML(xmlStr: string, typeName?: Bpmn.ElementType, options?: {}): Promise<BpmnModdle.IParseResult | Error[]>;

    /**
     * The toXML result.
     *
     * @typedef {Object} SerializationResult
     *
     * @property {String} xml
     */

    /**
     * Serializes a BPMN 2.0 object tree to XML.
     *
     * @param {String}   element    the root element, typically an instance of `bpmn:Definitions`
     * @param {Object}   [options]  to pass to the underlying writer
     *
     * @returns {Promise<SerializationResult, Error>}
     */
    public toXML(
      element: Bpmn.IDefinitions,
      options: {},
    ): Promise<
      | {
          xml: string;
        }
      | Error
    >;
  }

  namespace BpmnModdle {
    export interface IElement {
      readonly $type: Bpmn.ElementType;
      $attrs?: {};
    }

    export interface IReference {
      property: string;
      element: Bpmn.IBaseElement;
      id: string;
    }

    /**
     * The fromXML result.
     *
     * @typedef {Object} ParseResult
     *
     * @property {ModdleElement} rootElement
     * @property {Array<Object>} references
     * @property {Array<Error>} warnings
     * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
     */
    export interface IParseResult {
      rootElement: Bpmn.IDefinitions;
      elementsById: { [id: string]: Bpmn.IBaseElement };
      references: IReference[];
      warnings: Error[];
    }
  }
}
