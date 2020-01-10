declare module "didi/lib/module" {
  export = Module;

  class Module {
    public factory(name: string, factory: Function): Module;
    public value(name: string, value: {}): Module;
    public type(name: string, type: Function): Module;
    public forEach(iterator: Function): void;
  }
}