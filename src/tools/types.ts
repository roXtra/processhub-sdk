export function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return o.reduce((res, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res[key] = key;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res;
  }, Object.create(null));
}
