// eslint-disable-next-line @typescript-eslint/naming-convention
interface Array<T> {
  last(): T;
}

Array.prototype.last = function <T>(): T | undefined {
  if (this) {
    if (this.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this[this.length - 1];
    } else {
      return undefined;
    }
  }
};
