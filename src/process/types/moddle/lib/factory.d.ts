// Tslint:disable:max-classes-per-file
declare module "moddle/lib/factory" {
  export = Factory;
  import Base = require("moddle/lib/base");

  class Factory {
    public constructor(model: Record<string, any>, properties: Record<string, any>);
    public createType(descriptor: Record<string, any>): Factory.ModddleElementConstructor;
  }

  namespace Factory {
    class ModddleElement extends Base {
      public $type: string;
      public $attrs: Record<string, any>;

      constructor(attrs: Record<string, any>);
    }

    type ModddleElementConstructor = new (attrs: Record<string, any>) => ModddleElement;
  }
}
