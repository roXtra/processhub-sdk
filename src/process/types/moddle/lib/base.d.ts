/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "moddle/lib/base" {
  export default Base;

  import Moddle from "moddle/lib/moddle";
  class Base {
    public expressionLanguage: string;
    public typeLanguage: string;
    public $descriptor: Base.ITypeDescriptor;
    public $model: Moddle;
    public $type: string;
    public $children?: Base[];
    public $body?: string;
    public $parent: Base;
    public name?: string;

    public $instanceOf(element: {}, type: {}): boolean;
    public get(name: string): unknown;
    public set(name: string, value: unknown): void;
  }

  namespace Base {
    export interface ITypeDescriptor {
      $pkg: unknown;
      allTypes: ITypeDescriptor[];
      idProperty: IPropertyDescriptor;
      name: string;
      ns: INamespaceDescriptor;
      properties: IPropertyDescriptor[];
      propertiesByName: { [name: string]: IPropertyDescriptor };
    }

    export interface IPropertyDescriptor {
      definedBy: ITypeDescriptor;
      inherited: boolean;
      isAttr: boolean;
      name: string;
      ns: INamespaceDescriptor;
      type: string;
      isMunknown?: boolean;
    }

    export interface INamespaceDescriptor {}
  }
}
