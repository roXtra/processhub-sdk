declare module "moddle/lib/factory" {
  export = Factory;
  import Base = require("moddle/lib/base");

  class Factory {
    public constructor(model: {}, properties: {});
    public createType(descriptor: {}): Factory.ModddleElementConstructor;
  }

  namespace Factory {
    class ModddleElement extends Base {
      public $type: string;
      public $attrs: {};

      constructor(attrs: {});
    }

    type ModddleElementConstructor = new (attrs: {}) => ModddleElement;
  }
}
