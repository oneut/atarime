export interface DynamicImport<V> {
  default: V;
  __esModule?: boolean;
}

function isDynamicImport<V>(obj: any): obj is DynamicImport<V> {
  return !!obj && !!obj.__esModule;
}

export function resolveImport<C>(promiseClazz: Promise<C | DynamicImport<C>>) {
  return promiseClazz.then((clazz) => {
    if (isDynamicImport<C>(clazz)) {
      if (clazz.default === undefined) {
        throw Error(`Dynamic import failed. You should use "export default"`);
      }

      return clazz.default;
    }

    return clazz;
  });
}
