import { mapProp } from "./collection";
import { clone } from "./language";

interface ProxyHooks<T extends object> {
  $data(): T;
  $get<K extends keyof T>(property: K): T[K];
  $set<K extends keyof T>(property: K, value: T[K]): boolean;
}

export type AccessProxy<T extends object> = T & ProxyHooks<T>;

export interface AccessProxyConstructor {
  new <T extends object>(data: T): AccessProxy<T>;
  prototype: AccessProxy<any>;
}

/**
 * Clone the data, and create a wrapper class to manage the property read and write.
 * @param data the initial data. should be a pure JSON object.
 */
// @ts-expect-error cannot implement this
export const AccessProxy: AccessProxyConstructor = class<T extends object> implements ProxyHooks<T> {
  #data: T;
  constructor(data: T) {
    this.#data = clone(data);
    Object.defineProperties(
      this,
      mapProp<T, PropertyDescriptor>(data, (_value, property) => ({
        configurable: false,
        enumerable: true,
        get: () => this.$get(property),
        set: (value) => this.$set(property, value),
      })),
    );
  }
  $data(): T {
    return this.#data;
  }
  $get<K extends keyof T>(property: K): T[K] {
    return Reflect.get(this.#data, property);
  }
  $set<K extends keyof T>(property: K, value: T[K]): boolean {
    return Reflect.set(this.#data, property, value);
  }
};
