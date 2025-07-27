import { AccessProxy } from "./oop";

describe("oop", () => {
  describe("AccessProxy", () => {
    interface Foo {
      bar: string;
    }
    const data: Foo = {
      bar: "baz",
    };
    it("should proxy property access", () => {
      class MyClass extends AccessProxy<Foo> {}
      const instance = new MyClass(data);
      expect(instance.bar).toEqual(data.bar);
    });
    it("should provide raw data accessor", () => {
      class MyClass extends AccessProxy<Foo> {}
      const instance = new MyClass(data);
      expect(instance.$data()).toEqual(data);
    });
    it("should have hooks to override", () => {
      const get = import.meta.jest.fn();
      const set = import.meta.jest.fn();
      class MyClass extends AccessProxy<Foo> {
        override $get<K extends "bar">(property: K): Foo[K] {
          get(property);
          return super.$get(property);
        }
        override $set<K extends "bar">(property: K, value: Foo[K]): boolean {
          set(property, value);
          return super.$set(property, value);
        }
      }
      const instance = new MyClass(data);
      expect(instance.bar).toEqual(data.bar);
      expect(get).toHaveBeenCalledWith("bar");
      instance.bar = "changed";
      expect(instance.bar).toEqual("changed");
      expect(set).toHaveBeenCalledWith("bar", "changed");
    });
  });
});
