declare module "didi/lib/module" {
  export default class Module {
    public factory(name: string, factory: Function): Module;
    public value(name: string, value: {}): Module;
    public type(name: string, type: Function): Module;
    public forEach(iterator: Function): void;
  }
}
