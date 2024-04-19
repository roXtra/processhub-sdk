declare module "modeler/bpmn/processhub" {
  import Base from "moddle/lib/base";

  namespace Processhub {
    export interface IAsyncCapable {
      asyncBefore: boolean;
      asyncAfter: boolean;
    }

    export interface IAssignable {
      readonly $type: "processhub:Assignable";
      assignee: string;
    }

    export interface ICalling {
      readonly $type: "processhub:Calling";
      calledElementBinding: string;
      calledElementVersion: number;
    }

    export interface IServiceTaskLike {
      readonly $type: "processhub:ServiceTaskLike";
      expression: string;
      javaDelegate: string;
      delegateExpression: string;
    }

    export interface IConnector extends Element {
      readonly $type: "processhub:Connector";
      inputOutput: IInputOutput;
      connectorId: string;
    }

    export interface IInputOutput extends Base {
      readonly $type: "processhub:InputOutput";
      inputOutput: IInputOutput;
      connectorId: string;
      inputParameters: IInputParameter[];
      outputParameters: IOutputParameter[];
    }

    export interface IInputOutputParameter extends Base {
      readonly $type: "processhub:InputOutputParameter" | "processhub:InputParameter" | "processhub:OutputParameter";
      name: string;
      value: string;
      definition: IInputOutputParameterDefinition;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IInputOutputParameterDefinition {}

    export interface IList extends IInputOutputParameterDefinition {
      readonly $type: "processhub:List";
      items: IInputOutputParameterDefinition[];
    }

    export interface IMap extends IInputOutputParameterDefinition {
      readonly $type: "processhub:Map";
      entries: IEntry[];
    }

    export interface IEntry {
      readonly $type: "processhub:Entry";
      key: string;
      value: IInputOutputParameterDefinition;
    }

    export interface IValue extends IInputOutputParameterDefinition {
      readonly $type: "processhub:Value";
      value: string;
    }

    export interface IScript extends IInputOutputParameterDefinition {
      readonly $type: "processhub:Script";
      scriptLanguage: string;
      source: string;
    }

    export interface IInputParameter extends IInputOutputParameter {
      readonly $type: "processhub:InputParameter";
    }

    export interface IOutputParameter extends IInputOutputParameter {
      readonly $type: "processhub:OutputParameter";
    }
  }
}
