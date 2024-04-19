declare module "moddle/lib/factory" {
  import Base from "moddle/lib/base";
  export default Factory;

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
