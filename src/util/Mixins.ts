// From https://www.typescriptlang.org/docs/handbook/mixins.html

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      let descriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name,
      );
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        <PropertyDescriptor & ThisType<any>> descriptor,
      );
    });
  });
}
