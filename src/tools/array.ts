// eslint-disable-next-line @typescript-eslint/naming-convention
interface Array<T> {
  last(): T;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
Array.prototype.last = function <T>(): T | undefined {
  if (this) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (this.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
      return this[this.length - 1];
    } else {
      return undefined;
    }
  }
};
