// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface Array<T> {
  last(): T;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
Array.prototype.last = function<T> (): T {
  if (this) {
    if (this.length > 0) {
      return this[this.length - 1];
    } else {
      return null;
    }
  }
};
