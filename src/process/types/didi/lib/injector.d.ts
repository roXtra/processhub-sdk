declare module "didi/lib/injector" {
  import Module from "didi/lib/module";

  export default class Injector {
    public constructor(modules: Module[], parent?: Injector);

    /**
     * Return a named service.
     *
     * @param {String} name
     * @param {Boolean} [strict=true] if false, resolve missing services to null
     *
     * @return {Object}
     */
    public get(name: string, strict?: boolean): {};

    public invoke(fn: Function, context: {}): void;
  }
}
