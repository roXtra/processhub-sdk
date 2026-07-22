/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference path="./bpmndi.d.ts" preserve="true" />
/// <reference path="./dc.d.ts" preserve="true" />

declare module "modeler/bpmn/bpmn" {
  import { Bpmndi } from "modeler/bpmn/bpmndi";
  import { Dc } from "modeler/bpmn/dc";

  import Base from "moddle/lib/base";

  namespace Bpmn {
    export type ElementType = Bpmn.bpmnType | Bpmndi.bpmndiType | Dc.dcType;

    enum AdHocOrdering {}

    enum MultiInstanceBehavior {}

    enum AssociationDirection {}

    enum RelationshipDirection {}

    enum ProcessType {}

    enum GatewayDirection {}

    enum EventBasedGatewayType {}

    enum ItemKind {}

    enum ChoreographyLoopType {}

    export interface IBaseElement extends Base {
      $attrs?: {};
      $type: ElementType;

      id: string;
      documentation?: IDocumentation[];
      extensionDefinitions?: IExtensionDefinition[];
      extensionElements?: IExtensionElements;
    }

    export interface IRootElement extends IBaseElement {}

    export interface IInterface extends IRootElement {
      readonly $type: "bpmn:Interface";
      name: string;
      operations: IOperation[];
      implementationRef: string;
    }

    export interface IOperation extends IBaseElement {
      readonly $type: "bpmn:Operation";
      name: string;
      inMessageRef: IMessage;
      outMessageRef: IMessage;
      errorRef: IError[];
      implementationRef: string;
    }

    export interface IEndPoint extends IRootElement {
      readonly $type: "bpmn:EndPoint";
    }

    export interface IAuditing extends IBaseElement {
      readonly $type: "bpmn:Auditing";
    }

    export interface ICallableElement extends IRootElement {
      name?: string;
      ioSpecification?: IInputOutputSpecification;
      supportedInterfaceRef?: IInterface[];
      ioBinding?: IInputOutputBinding[];
    }

    export interface IGlobalTask extends ICallableElement {
      readonly $type: "bpmn:GlobalTask" | "bpmn:GlobalManualTask" | "bpmn:GlobalUserTask" | "bpmn:GlobalScriptTask" | "bpmn:GlobalBusinessRuleTask";
      resources: IResourceRole[];
    }

    export interface IMonitoring extends IBaseElement {
      readonly $type: "bpmn:Monitoring";
    }

    export interface IResourceRole extends IBaseElement {
      resourceRef: IResource;
      resourceParameterBindings: IResourceParameterBinding[];
      resourceAssignmentExpression: IResourceAssignmentExpression;
      name: string;
    }

    export interface IPerformer extends IResourceRole {
      readonly $type: "bpmn:Performer" | "bpmn:HumanPerformer" | "bpmn:PotentialOwner";
    }

    export interface IFlowElementsContainer extends IBaseElement {
      laneSets?: ILaneSet[];
      flowElements: IFlowElement[];
    }

    export interface IProcess extends IFlowElementsContainer, ICallableElement {
      readonly $type: "bpmn:Process";
      processType?: ProcessType;
      isClosed?: boolean;
      auditing?: IAuditing;
      monitoring?: IMonitoring;
      properties?: IProperty[];
      laneSets?: ILaneSet[];
      flowElements: IFlowElement[];
      artifacts?: IArtifact[];
      resources?: IResourceRole[];
      correlationSubscriptions?: ICorrelationSubscription[];
      supports?: IProcess[];
      definitionalCollaborationRef?: ICollaboration;
      isExecutable?: boolean;
    }

    export interface ILaneSet extends IBaseElement {
      readonly $type: "bpmn:LaneSet";
      lanes: ILane[];
      name: string;
    }

    export interface ILane extends IBaseElement {
      readonly $type: "bpmn:Lane";
      name: string;
      partitionElementRef?: IBaseElement;
      partitionElement?: IBaseElement;
      flowNodeRef: IFlowNode[];
      childLaneSet?: ILaneSet;
    }

    export interface IGlobalManualTask extends IGlobalTask {
      readonly $type: "bpmn:GlobalManualTask";
    }

    export interface IFlowElement extends IBaseElement {
      name?: string;
      auditing?: IAuditing;
      monitoring?: IMonitoring;
      categoryValueRef?: ICategoryValue[];
    }

    export interface IFlowNode extends IFlowElement {
      incoming?: ISequenceFlow[];
      outgoing?: ISequenceFlow[];
    }

    export interface IActivity extends IFlowNode {
      isForCompensation?: boolean;
      default?: ISequenceFlow;
      ioSpecification?: IInputOutputSpecification;
      boundaryEventRefs?: IBoundaryEvent[];
      properties?: IProperty[];
      dataInputAssociations?: IDataInputAssociation[];
      dataOutputAssociations?: IDataOutputAssociation[];
      startQuantity?: number;
      resources?: IResourceRole[];
      completionQuantity?: number;
      loopCharacteristics?: ILoopCharacteristics;
    }

    export interface IInteractionNode {}

    export interface ITask extends IActivity, IInteractionNode {
      readonly $type:
        | "bpmn:Task"
        | "bpmn:ManualTask"
        | "bpmn:UserTask"
        | "bpmn:ServiceTask"
        | "bpmn:SendTask"
        | "bpmn:ReceiveTask"
        | "bpmn:ScriptTask"
        | "bpmn:BusinessRuleTask";
    }

    export interface IManualTask extends ITask {
      readonly $type: "bpmn:ManualTask";
    }

    export interface IUserTask extends ITask {
      readonly $type: "bpmn:UserTask";
      renderings?: IRendering[];
      implementation?: string;
    }

    export interface IRendering extends IBaseElement {
      readonly $type: "bpmn:Rendering";
    }

    export interface IHumanPerformer extends IPerformer {
      readonly $type: "bpmn:HumanPerformer" | "bpmn:PotentialOwner";
    }

    export interface IPotentialOwner extends IHumanPerformer {
      readonly $type: "bpmn:PotentialOwner";
    }

    export interface IGlobalUserTask extends IGlobalTask {
      readonly $type: "bpmn:GlobalUserTask";
      implementation: string;
      renderings: IRendering[];
    }

    export interface IGateway extends IFlowNode {
      gatewayDirection?: GatewayDirection;
    }

    export interface IEventBasedGateway extends IGateway {
      readonly $type: "bpmn:EventBasedGateway";
      instantiate: boolean;
      eventGatewayType: EventBasedGatewayType;
    }

    export interface IComplexGateway extends IGateway {
      readonly $type: "bpmn:ComplexGateway";
      activationCondition: IExpression;
      default: ISequenceFlow;
    }

    export interface IExclusiveGateway extends IGateway {
      readonly $type: "bpmn:ExclusiveGateway";
      default?: ISequenceFlow;
    }

    export interface IInclusiveGateway extends IGateway {
      readonly $type: "bpmn:InclusiveGateway";
      default: ISequenceFlow;
    }

    export interface IParallelGateway extends IGateway {
      readonly $type: "bpmn:ParallelGateway";
    }

    export interface IRelationship extends IBaseElement {
      readonly $type: "bpmn:Relationship";
      type: string;
      direction: RelationshipDirection;
      source: Element[];
      target: Element[];
    }

    export interface IExtension {
      readonly $type: "bpmn:Extension";
      mustUnderstand: boolean;
      definition: IExtensionDefinition;
    }

    export interface IExtensionDefinition {
      readonly $type: "bpmn:ExtensionDefinition";
      name: string;
      extensionAttributeDefinitions: IExtensionAttributeDefinition[];
    }

    export interface IExtensionAttributeDefinition {
      readonly $type: "bpmn:ExtensionAttributeDefinition";
      name: string;
      type: string;
      isReference: boolean;
      extensionDefinition: IExtensionDefinition;
    }

    export interface IExtensionElements {
      readonly $type: "bpmn:ExtensionElements";
      valueRef: Element;
      values: Base[];
      extensionAttributeDefinition: IExtensionAttributeDefinition;
    }

    export interface IDocumentation extends IBaseElement {
      readonly $type: "bpmn:Documentation";
      text: string;
      textFormat: string;
    }

    export interface IEvent extends IFlowNode, IInteractionNode {
      properties?: IProperty[];
    }

    export interface ICatchEvent extends IEvent {
      parallelMultiple?: boolean;
      dataOutputs?: IDataOutput[];
      dataOutputAssociations?: IDataOutputAssociation[];
      outputSet?: IOutputSet;
      eventDefinitions?: IEventDefinition[];
      eventDefinitionRef?: IEventDefinition[];
    }

    export interface IIntermediateCatchEvent extends ICatchEvent {
      readonly $type: "bpmn:IntermediateCatchEvent";
    }

    export interface IThrowEvent extends IEvent {
      dataInputs?: IDataInput[];
      dataInputAssociations?: IDataInputAssociation[];
      inputSet?: IInputSet;
      eventDefinitions?: IEventDefinition[];
      eventDefinitionRef?: IEventDefinition[];
    }

    export interface IIntermediateThrowEvent extends IThrowEvent {
      readonly $type: "bpmn:IntermediateThrowEvent";
    }

    export interface IEndEvent extends IThrowEvent {
      readonly $type: "bpmn:EndEvent";
    }

    export interface IStartEvent extends ICatchEvent {
      readonly $type: "bpmn:StartEvent";
      isInterrupting: true;
    }

    export interface IBoundaryEvent extends ICatchEvent {
      readonly $type: "bpmn:BoundaryEvent";
      cancelActivity: boolean;
      attachedToRef: IActivity;
    }

    export interface IEventDefinition extends IRootElement {}

    export interface ICancelEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:CancelEventDefinition";
    }

    export interface IErrorEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:ErrorEventDefinition";
      errorRef: IError;
    }

    export interface ITerminateEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:TerminateEventDefinition";
    }

    export interface IEscalationEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:EscalationEventDefinition";
      escalationRef: IEscalation;
    }

    export interface IEscalation extends IRootElement {
      readonly $type: "bpmn:Escalation";
      structureRef: IItemDefinition;
      name: string;
      escalationCode: string;
    }

    export interface ICompensateEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:CompensateEventDefinition";
      waitForCompletion: boolean;
      activityRef: IActivity;
    }

    export interface ITimerEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:TimerEventDefinition";
      timeDate: IExpression;
      timeCycle: IExpression;
      timeDuration: IExpression;
    }

    export interface ILinkEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:LinkEventDefinition";
      name: string;
      target: ILinkEventDefinition;
      source: ILinkEventDefinition[];
    }

    export interface IMessageEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:MessageEventDefinition";
      messageRef: IMessage;
      operationRef: IOperation;
    }

    export interface IConditionalEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:ConditionalEventDefinition";
      condition: IExpression;
    }

    export interface ISignalEventDefinition extends IEventDefinition {
      readonly $type: "bpmn:SignalEventDefinition";
      signalRef: ISignal;
    }

    export interface ISignal extends IRootElement {
      readonly $type: "bpmn:Signal";
      structureRef: IItemDefinition;
      name: string;
    }

    export interface IImplicitThrowEvent extends IThrowEvent {
      readonly $type: "bpmn:ImplicitThrowEvent";
    }

    export interface IDataState extends IBaseElement {
      readonly $type: "bpmn:DataState";
      name: string;
    }

    export interface IItemAwareElement extends IBaseElement {
      readonly $type:
        | "bpmn:ItemAwareElement"
        | "bpmn:DataInput"
        | "bpmn:DataOutput"
        | "bpmn:Property"
        | "bpmn:DataObject"
        | "bpmn:DataStore"
        | "bpmn:DataStoreReference"
        | "bpmn:DataObjectReference";
      itemSubjectRef: IItemDefinition;
      dataState: IDataState;
    }

    export interface IDataAssociation extends IBaseElement {
      readonly $type: "bpmn:DataAssociation" | "bpmn:DataInputAssociation" | "bpmn:DataOutputAssociation";
      assignment: IAssignment[];
      sourceRef: IItemAwareElement[];
      targetRef: IItemAwareElement;
      transformation: IFormalExpression;
    }

    export interface IDataInput extends IItemAwareElement {
      readonly $type: "bpmn:DataInput";
      name: string;
      isCollection: boolean;
    }

    export interface IDataOutput extends IItemAwareElement {
      readonly $type: "bpmn:DataOutput";
      name: string;
      isCollection: boolean;
    }

    export interface IInputSet extends IBaseElement {
      readonly $type: "bpmn:InputSet";
      name: string;
      dataInputRefs: IDataInput[];
      optionalInputRefs: IDataInput[];
      whileExecutingInputRefs: IDataInput[];
      outputSetRefs: IOutputSet[];
    }

    export interface IOutputSet extends IBaseElement {
      readonly $type: "bpmn:OutputSet";
      dataOutputRefs: IDataOutput[];
      name: string;
      inputSetRefs: IInputSet[];
      optionalOutputRefs: IDataOutput[];
      whileExecutingOutputRefs: IDataOutput[];
    }

    export interface IProperty extends IItemAwareElement {
      readonly $type: "bpmn:Property";
      name: string;
    }

    export interface IDataInputAssociation extends IDataAssociation {
      readonly $type: "bpmn:DataInputAssociation";
    }

    export interface IDataOutputAssociation extends IDataAssociation {
      readonly $type: "bpmn:DataOutputAssociation";
    }

    export interface IInputOutputSpecification extends IBaseElement {
      readonly $type: "bpmn:InputOutputSpecification";
      dataInputs: IDataInput[];
      dataOutputs: IDataOutput[];
      inputSets: IInputSet[];
      outputSets: IOutputSet[];
    }

    export interface IDataObject extends IFlowElement, IItemAwareElement {
      readonly $type: "bpmn:DataObject";
      isCollection: boolean;
    }

    export interface IInputOutputBinding {
      readonly $type: "bpmn:InputOutputBinding";
      inputDataRef: IInputSet;
      outputDataRef: IOutputSet;
      operationRef: IOperation;
    }

    export interface IAssignment extends IBaseElement {
      readonly $type: "bpmn:Assignment";
      from: IExpression;
      to: IExpression;
    }

    export interface IDataStore extends IRootElement, IItemAwareElement {
      readonly $type: "bpmn:DataStore";
      name: string;
      capacity: number;
      isUnlimited: boolean;
    }

    export interface IDataStoreReference extends IItemAwareElement, IFlowElement {
      readonly $type: "bpmn:DataStoreReference";
      dataStoreRef: IDataStore;
    }

    export interface IDataObjectReference extends IItemAwareElement, IFlowElement {
      readonly $type: "bpmn:DataObjectReference";
      dataObjectRef: IDataObject;
    }

    export interface IConversationLink extends IBaseElement {
      readonly $type: "bpmn:ConversationLink";
      sourceRef: IInteractionNode;
      targetRef: IInteractionNode;
      name: string;
    }

    export interface IConversationAssociation extends IBaseElement {
      readonly $type: "bpmn:ConversationAssociation";
      innerConversationNodeRef: IConversationNode;
      outerConversationNodeRef: IConversationNode;
    }

    export interface IConversationNode extends IInteractionNode, IBaseElement {
      name: string;
      participantRefs: IParticipant[];
      messageFlowRefs: IMessageFlow[];
      correlationKeys: ICorrelationKey[];
    }

    export interface ICallConversation extends IConversationNode {
      readonly $type: "bpmn:CallConversation";
      calledCollaborationRef: ICollaboration;
      participantAssociations: IParticipantAssociation[];
    }

    export interface IConversation extends IConversationNode {
      readonly $type: "bpmn:Conversation";
    }

    export interface ISubConversation extends IConversationNode {
      readonly $type: "bpmn:SubConversation";
      conversationNodes: IConversationNode[];
    }

    export interface ICollaboration extends IRootElement {
      readonly $type: "bpmn:Collaboration" | "bpmn:GlobalConversation" | "bpmn:Choreography" | "bpmn:GlobalChoreographyTask";
      name?: string;
      isClosed?: boolean;
      participants: IParticipant[];
      messageFlows?: IMessageFlow[];
      artifacts?: IArtifact[];
      conversations?: IConversationNode[];
      conversationAssociations?: IConversationAssociation;
      participantAssociations?: IParticipantAssociation[];
      messageFlowAssociations?: IMessageFlowAssociation[];
      correlationKeys?: ICorrelationKey[];
      choreographyRef?: IChoreography[];
      conversationLinks?: IConversationLink[];
    }

    export interface IGlobalConversation extends ICollaboration {
      readonly $type: "bpmn:GlobalConversation";
    }

    export interface IPartnerEntity extends IRootElement {
      readonly $type: "bpmn:PartnerEntity";
      name: string;
      participantRef: IParticipant[];
    }

    export interface IPartnerRole extends IRootElement {
      readonly $type: "bpmn:PartnerRole";
      name: string;
      participantRef: IParticipant[];
    }

    export interface ICorrelationProperty extends IRootElement {
      readonly $type: "bpmn:CorrelationProperty";
      correlationPropertyRetrievalExpression: ICorrelationPropertyRetrievalExpression[];
      name: string;
      type: IItemDefinition;
    }

    export interface IError extends IRootElement {
      readonly $type: "bpmn:Error";
      structureRef: IItemDefinition;
      name: string;
      errorCode: string;
    }

    export interface ICorrelationKey extends IBaseElement {
      readonly $type: "bpmn:CorrelationKey";
      correlationPropertyRef: ICorrelationProperty[];
      name: string;
    }

    export interface IExpression extends IBaseElement {
      readonly $type: "bpmn:Expression" | "bpmn:FormalExpression";
      body: string;
    }

    export interface IFormalExpression extends IExpression {
      readonly $type: "bpmn:FormalExpression";
      language: string;
      evaluatesToTypeRef: IItemDefinition;
    }

    export interface IMessage extends IRootElement {
      readonly $type: "bpmn:Message";
      name: string;
      itemRef: IItemDefinition;
    }

    export interface IItemDefinition extends IRootElement {
      readonly $type: "bpmn:ItemDefinition";
      itemKind: ItemKind;
      structureRef: string;
      isCollection: boolean;
      import: IImport;
    }

    export interface ISequenceFlow extends IFlowElement {
      readonly $type: "bpmn:SequenceFlow";
      isImmediate: boolean;
      conditionExpression?: IExpression;
      sourceRef: IFlowNode;
      targetRef: IFlowNode;
    }

    export interface ICorrelationPropertyRetrievalExpression extends IBaseElement {
      readonly $type: "bpmn:CorrelationPropertyRetrievalExpression";
      messagePath: IFormalExpression;
      messageRef: IMessage;
    }

    export interface ICorrelationPropertyBinding extends IBaseElement {
      readonly $type: "bpmn:CorrelationPropertyBinding";
      dataPath: IFormalExpression;
      correlationPropertyRef: ICorrelationProperty;
    }

    export interface IResource extends IRootElement {
      readonly $type: "bpmn:Resource";
      name: string;
      resourceParameters: IResourceParameter[];
    }

    export interface IResourceParameter extends IBaseElement {
      readonly $type: "bpmn:ResourceParameter";
      name: string;
      isRequired: boolean;
      type: IItemDefinition;
    }

    export interface ICorrelationSubscription extends IBaseElement {
      readonly $type: "bpmn:CorrelationSubscription";
      correlationKeyRef: ICorrelationKey;
      correlationPropertyBinding: ICorrelationPropertyBinding[];
    }

    export interface IMessageFlow extends IBaseElement {
      readonly $type: "bpmn:MessageFlow";
      name: string;
      sourceRef: IInteractionNode;
      targetRef: IInteractionNode;
      messageRef: IMessage;
    }

    export interface IMessageFlowAssociation extends IBaseElement {
      readonly $type: "bpmn:MessageFlowAssociation";
      innerMessageFlowRef: IMessageFlow;
      outerMessageFlowRef: IMessageFlow;
    }

    export interface IParticipant extends IInteractionNode, IBaseElement {
      readonly $type: "bpmn:Participant";
      name?: string;
      interfaceRef?: IInterface[];
      participantMultiplicity?: IParticipantMultiplicity;
      endPointRefs?: IEndPoint[];
      processRef?: IProcess;
    }

    export interface IParticipantAssociation extends IBaseElement {
      readonly $type: "bpmn:ParticipantAssociation";
      innerParticipantRef: IParticipant;
      outerParticipantRef: IParticipant;
    }

    export interface IParticipantMultiplicity {
      readonly $type: "bpmn:ParticipantMultiplicity";
      minimum: number;
      maximum: number;
    }

    export interface IChoreographyActivity extends IFlowNode {
      participantRefs: IParticipant[];
      initiatingParticipantRef: IParticipant;
      correlationKeys: ICorrelationKey[];
      loopType: ChoreographyLoopType;
    }

    export interface ICallChoreography extends IChoreographyActivity {
      readonly $type: "bpmn:CallChoreography";
      calledChoreographyRef: IChoreography;
      participantAssociations: IParticipantAssociation[];
    }

    export interface ISubChoreography extends IChoreographyActivity, IFlowElementsContainer {
      readonly $type: "bpmn:SubChoreography";
      artifacts: IArtifact[];
    }

    export interface IChoreographyTask extends IChoreographyActivity {
      readonly $type: "bpmn:ChoreographyTask";
      messageFlowRef: IMessageFlow[];
    }

    export interface IChoreography extends IFlowElementsContainer, ICollaboration {
      readonly $type: "bpmn:Choreography" | "bpmn:GlobalChoreographyTask";
    }

    export interface IGlobalChoreographyTask extends IChoreography {
      readonly $type: "bpmn:GlobalChoreographyTask";
      initiatingParticipantRef: IParticipant;
    }

    export interface IArtifact extends IBaseElement {}

    export interface ITextAnnotation extends IArtifact {
      readonly $type: "bpmn:TextAnnotation";
      text: string;
      textFormat: string;
    }

    export interface IGroup extends IArtifact {
      readonly $type: "bpmn:Group";
      categoryValueRef: ICategoryValue;
    }

    export interface IAssociation extends IArtifact {
      readonly $type: "bpmn:Association";
      associationDirection: AssociationDirection;
      sourceRef: IBaseElement;
      targetRef: IBaseElement;
    }

    export interface ICategory extends IRootElement {
      readonly $type: "bpmn:Category";
      categoryValue: ICategoryValue[];
      name: string;
    }

    export interface ICategoryValue extends IBaseElement {
      readonly $type: "bpmn:CategoryValue";
      value: string;
    }

    export interface IServiceTask extends ITask {
      readonly $type: "bpmn:ServiceTask";
      implementation: string;
      operationRef: IOperation;
    }

    export interface ISubProcess extends IActivity, IFlowElementsContainer, IInteractionNode {
      readonly $type: "bpmn:SubProcess" | "bpmn:AdHocSubProcess" | "bpmn:Transaction";
      triggeredByEvent: boolean;
      artifacts: IArtifact[];
    }

    export interface ILoopCharacteristics extends IBaseElement {}

    export interface IMultiInstanceLoopCharacteristics extends ILoopCharacteristics {
      readonly $type: "bpmn:MultiInstanceLoopCharacteristics";
      isSequential: boolean;
      behavior: MultiInstanceBehavior;
      loopCardinality: IExpression;
      loopDataInputRef: IItemAwareElement;
      loopDataOutputRef: IItemAwareElement;
      inputDataItem: IDataInput;
      outputDataItem: IDataOutput;
      complexBehaviorDefinition: IComplexBehaviorDefinition[];
      completionCondition: IExpression;
      oneBehaviorEventRef: IEventDefinition;
      noneBehaviorEventRef: IEventDefinition;
    }

    export interface IStandardLoopCharacteristics extends ILoopCharacteristics {
      readonly $type: "bpmn:StandardLoopCharacteristics";
      testBefore: boolean;
      loopCondition: IExpression;
      loopMaximum: IExpression;
    }

    export interface ICallActivity extends IActivity {
      readonly $type: "bpmn:CallActivity";
      calledElement: string;
    }

    export interface ISendTask extends ITask {
      readonly $type: "bpmn:SendTask";
      implementation: string;
      operationRef: IOperation;
      messageRef: IMessage;
    }

    export interface IReceiveTask extends ITask {
      readonly $type: "bpmn:ReceiveTask";
      implementation: string;
      instantiate: boolean;
      operationRef: IOperation;
      messageRef: IMessage;
    }

    export interface IScriptTask extends ITask {
      readonly $type: "bpmn:ScriptTask";
      scriptFormat: string;
      script: string;
    }

    export interface IBusinessRuleTask extends ITask {
      readonly $type: "bpmn:BusinessRuleTask";
      implementation: string;
    }

    export interface IAdHocSubProcess extends ISubProcess {
      readonly $type: "bpmn:AdHocSubProcess";
      completionCondition: IExpression;
      ordering: AdHocOrdering;
      cancelRemainingInstances: boolean;
    }

    export interface ITransaction extends ISubProcess {
      readonly $type: "bpmn:Transaction";
      protocol: string;
      method: string;
    }

    export interface IGlobalScriptTask extends IGlobalTask {
      readonly $type: "bpmn:GlobalScriptTask";
      scriptLanguage: string;
      script: string;
    }

    export interface IGlobalBusinessRuleTask extends IGlobalTask {
      readonly $type: "bpmn:GlobalBusinessRuleTask";
      implementation: string;
    }

    export interface IComplexBehaviorDefinition extends IBaseElement {
      readonly $type: "bpmn:ComplexBehaviorDefinition";
      condition: IFormalExpression;
      event: IImplicitThrowEvent;
    }

    export interface IResourceParameterBinding {
      readonly $type: "bpmn:ResourceParameterBinding";
      expression: IExpression;
      parameterRef: IResourceParameter;
    }

    export interface IResourceAssignmentExpression extends IBaseElement {
      readonly $type: "bpmn:ResourceAssignmentExpression";
      expression: IExpression;
    }

    export interface IImport {
      readonly $type: "bpmn:Import";
      importType: string;
      location: string;
      namespace: string;
    }

    export interface IDefinitions extends IBaseElement {
      readonly $type: "bpmn:Definitions";
      name?: string;
      targetNamespace?: string;
      expressionLanguage: string;
      typeLanguage: string;
      imports?: IImport[];
      extensions?: IExtension[];
      rootElements: IRootElement[];
      diagrams: Bpmndi.IBPMNDiagram[];
      exporter?: string;
      relationships?: IRelationship[];
      exporterVersion?: string;
      "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL";
      "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI";
      "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC";
      "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI";
      "xmlns:processhub": "http://processhub.com/schema/1.0/bpmn";
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance";
    }

    export type bpmnType =
      | "bpmn:Interface"
      | "bpmn:Operation"
      | "bpmn:EndPoint"
      | "bpmn:Auditing"
      | "bpmn:GlobalTask"
      | "bpmn:Monitoring"
      | "bpmn:Performer"
      | "bpmn:Process"
      | "bpmn:LaneSet"
      | "bpmn:Lane"
      | "bpmn:GlobalManualTask"
      | "bpmn:ManualTask"
      | "bpmn:UserTask"
      | "bpmn:Rendering"
      | "bpmn:HumanPerformer"
      | "bpmn:PotentialOwner"
      | "bpmn:GlobalUserTask"
      | "bpmn:EventBasedGateway"
      | "bpmn:ComplexGateway"
      | "bpmn:ExclusiveGateway"
      | "bpmn:InclusiveGateway"
      | "bpmn:ParallelGateway"
      | "bpmn:Relationship"
      | "bpmn:Extension"
      | "bpmn:ExtensionDefinition"
      | "bpmn:ExtensionAttributeDefinition"
      | "bpmn:ExtensionElements"
      | "bpmn:Documentation"
      | "bpmn:IntermediateCatchEvent"
      | "bpmn:IntermediateThrowEvent"
      | "bpmn:EndEvent"
      | "bpmn:StartEvent"
      | "bpmn:BoundaryEvent"
      | "bpmn:CancelEventDefinition"
      | "bpmn:ErrorEventDefinition"
      | "bpmn:TerminateEventDefinition"
      | "bpmn:EscalationEventDefinition"
      | "bpmn:Escalation"
      | "bpmn:CompensateEventDefinition"
      | "bpmn:TimerEventDefinition"
      | "bpmn:LinkEventDefinition"
      | "bpmn:MessageEventDefinition"
      | "bpmn:ConditionalEventDefinition"
      | "bpmn:SignalEventDefinition"
      | "bpmn:Signal"
      | "bpmn:ImplicitThrowEvent"
      | "bpmn:DataState"
      | "bpmn:ItemAwareElement"
      | "bpmn:DataAssociation"
      | "bpmn:DataInput"
      | "bpmn:DataOutput"
      | "bpmn:InputSet"
      | "bpmn:OutputSet"
      | "bpmn:Property"
      | "bpmn:DataInputAssociation"
      | "bpmn:DataOutputAssociation"
      | "bpmn:InputOutputSpecification"
      | "bpmn:DataObject"
      | "bpmn:InputOutputBinding"
      | "bpmn:Assignment"
      | "bpmn:DataStore"
      | "bpmn:DataStoreReference"
      | "bpmn:DataObjectReference"
      | "bpmn:ConversationLink"
      | "bpmn:ConversationAssociation"
      | "bpmn:CallConversation"
      | "bpmn:Conversation"
      | "bpmn:SubConversation"
      | "bpmn:GlobalConversation"
      | "bpmn:PartnerEntity"
      | "bpmn:PartnerRole"
      | "bpmn:CorrelationProperty"
      | "bpmn:Error"
      | "bpmn:CorrelationKey"
      | "bpmn:Expression"
      | "bpmn:FormalExpression"
      | "bpmn:Message"
      | "bpmn:ItemDefinition"
      | "bpmn:SequenceFlow"
      | "bpmn:CorrelationPropertyRetrievalExpression"
      | "bpmn:CorrelationPropertyBinding"
      | "bpmn:Resource"
      | "bpmn:ResourceParameter"
      | "bpmn:CorrelationSubscription"
      | "bpmn:MessageFlow"
      | "bpmn:MessageFlowAssociation"
      | "bpmn:Participant"
      | "bpmn:ParticipantAssociation"
      | "bpmn:ParticipantMultiplicity"
      | "bpmn:Collaboration"
      | "bpmn:CallChoreography"
      | "bpmn:SubChoreography"
      | "bpmn:ChoreographyTask"
      | "bpmn:Choreography"
      | "bpmn:GlobalChoreographyTask"
      | "bpmn:TextAnnotation"
      | "bpmn:Group"
      | "bpmn:Association"
      | "bpmn:Category"
      | "bpmn:CategoryValue"
      | "bpmn:ServiceTask"
      | "bpmn:SubProcess"
      | "bpmn:MultiInstanceLoopCharacteristics"
      | "bpmn:StandardLoopCharacteristics"
      | "bpmn:CallActivity"
      | "bpmn:Task"
      | "bpmn:SendTask"
      | "bpmn:ReceiveTask"
      | "bpmn:ScriptTask"
      | "bpmn:BusinessRuleTask"
      | "bpmn:AdHocSubProcess"
      | "bpmn:Transaction"
      | "bpmn:GlobalScriptTask"
      | "bpmn:GlobalBusinessRuleTask"
      | "bpmn:ComplexBehaviorDefinition"
      | "bpmn:ResourceRole"
      | "bpmn:ResourceParameterBinding"
      | "bpmn:ResourceAssignmentExpression"
      | "bpmn:Import"
      | "bpmn:Definitions";
  }
}
