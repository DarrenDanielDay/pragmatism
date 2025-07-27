import type { StringKey } from "./types";

export const indexBy = <T>(arr: T[], selector: (item: T) => string | number) => {
  return arr.reduce<{ [key: string | number]: T }>((index, item) => {
    index[selector(item)] = item;
    return index;
  }, {});
};

export const mapProp = <T extends object, R>(object: T, map: (value: T[StringKey<T>], property: StringKey<T>) => R) =>
  Object.fromEntries(
    Object.entries(object).map(([property, value]) => [property, map(value, property as StringKey<T>)]),
  ) as Record<StringKey<T>, R>;
