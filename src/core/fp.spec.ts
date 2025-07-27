import { _, assert, die, identity, intersection, noop, notnull, partial, property, skip, union } from "./fp";
import { isNumber, isString } from "./language";
import type { Validator } from "./types";

describe("core.fp", () => {
  describe("noop", () => {
    it("should do nothing", () => {
      expect(noop()).toBe(void 0);
    });
  });
  describe("identity", () => {
    it("should return value itself", () => {
      const obj = {};
      expect(identity(obj)).toBe(obj);
    });
  });
  describe("die", () => {
    it("should throw", () => {
      expect(() => {
        die();
      }).toThrow();
    });
    it("should throw with message", () => {
      expect(() => {
        die("Message");
      }).toThrow("Message");
    });
  });
  describe("assert", () => {
    it("should not throw when condition is true", () => {
      expect(() => {
        assert(true);
      }).not.toThrow();
    });
    it("should throw when condition is false", () => {
      expect(() => {
        assert(false);
      }).toThrow();
    });
    it("should throw with custom message", () => {
      expect(() => {
        assert(false, "Custom error");
      }).toThrow("Custom error");
    });
  });
  describe("notnull", () => {
    it("should return the value if not null or undefined", () => {
      expect(notnull(0)).toBe(0);
      expect(notnull("")).toBe("");
      expect(notnull(false)).toBe(false);
      expect(notnull([])).toEqual([]);
      expect(notnull({})).toEqual({});
    });
    it("should throw if value is null", () => {
      expect(() => notnull(null)).toThrow("Not null assertion failed.");
    });
    it("should throw if value is undefined", () => {
      expect(() => notnull(undefined)).toThrow("Not null assertion failed.");
    });
    it("should throw with custom message", () => {
      expect(() => notnull(null, "Custom notnull error")).toThrow("Custom notnull error");
      expect(() => notnull(undefined, "Another error")).toThrow("Another error");
    });
  });
  describe("union", () => {
    it("should make union guard", () => {
      const isStrOrNum = union([isString, isNumber]);
      expect(isStrOrNum(1)).toBeTruthy();
      expect(isStrOrNum("")).toBeTruthy();
      expect(isStrOrNum(true)).toBeFalsy();
    });
  });
  describe("intersection", () => {
    it("should make intersection guard", () => {
      const is1: Validator<1> = (value) => value === 1;
      const is1AndNum = intersection([is1, isNumber]);
      expect(is1AndNum(1)).toBeTruthy();
      expect(is1AndNum(2)).toBeFalsy();
      expect(is1AndNum("")).toBeFalsy();
      expect(is1AndNum(true)).toBeFalsy();
    });
  });
  describe("skip", () => {
    it("should always return false for validation", () => {
      expect(skip()).toBe(true);
    });
  });
  describe("partial", () => {
    function fn(a: number, b: string, c: boolean) {
      return {
        foo: c ? a : b,
      };
    }
    it("should create partial function", () => {
      const c = partial(fn)(_, "", _);
      expect(c(1, false)).toStrictEqual({
        foo: "",
      });
      expect(c(2, true)).toStrictEqual({
        foo: 2,
      });
    });
    it("should throw when count is incorrect", () => {
      expect(() => {
        // @ts-expect-error incorrect count
        const c = partial(fn, -1);
        c.apply(null);
      }).toThrow(/invalid parameter count/i);
    });
    it("should throw when count is incorrect", () => {
      expect(() => {
        const c = partial(fn, 3);
        // @ts-expect-error
        c();
      }).toThrow("got 0 parameters");
    });
  });
  describe("property", () => {
    it("should return wrapped function for selecting property", () => {
      interface Foo {
        bar: string;
      }
      function invoke(selector: (foo: Foo) => string) {
        return selector({
          bar: "abc",
        });
      }
      expect(invoke(property("bar"))).toBe("abc");
    });
  });
});
