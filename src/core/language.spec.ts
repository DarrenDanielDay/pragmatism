import {
  ctor,
  isBigint,
  isBoolean,
  isFunction,
  isNull,
  isNullish,
  isNumber,
  isObjectLike,
  isString,
  isSymbol,
  isUndefined,
  toTypeString,
} from "./language";

describe("core.language", () => {
  describe("isString", () => {
    it("should return true for string literals", () => {
      expect(isString("hello")).toBe(true);
      expect(isString("")).toBe(true);
    });
    it("should return false for non-string values", () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(Symbol("s"))).toBe(false);
      expect(isString(() => {})).toBe(false);
    });
    it("should return false for String objects", () => {
      expect(isString(new String("abc"))).toBe(false);
    });
  });
  describe("isNumber", () => {
    it("should return true for number literals", () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-456)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(NaN)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });
    it("should return false for non-number values", () => {
      expect(isNumber("123")).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(Symbol("n"))).toBe(false);
      expect(isNumber(() => {})).toBe(false);
    });
    it("should return false for Number objects", () => {
      expect(isNumber(new Number(123))).toBe(false);
    });
  });
  describe("isBoolean", () => {
    it("should return true for boolean literals", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });
    it("should return false for non-boolean values", () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean("true")).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean({})).toBe(false);
      expect(isBoolean([])).toBe(false);
      expect(isBoolean(Symbol("b"))).toBe(false);
      expect(isBoolean(() => {})).toBe(false);
    });
    it("should return false for Boolean objects", () => {
      expect(isBoolean(new Boolean(true))).toBe(false);
    });
  });
  describe("isSymbol", () => {
    it("should return true for symbols", () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol("desc"))).toBe(true);
    });
    it("should return false for non-symbol values", () => {
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol("symbol")).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
      expect(isSymbol({})).toBe(false);
      expect(isSymbol([])).toBe(false);
      expect(isSymbol(() => {})).toBe(false);
    });
  });
  describe("isBigint", () => {
    it("should return true for bigints", () => {
      expect(isBigint(10n)).toBe(true);
      expect(isBigint(BigInt(123))).toBe(true);
    });
    it("should return false for non-bigint values", () => {
      expect(isBigint(123)).toBe(false);
      expect(isBigint("10")).toBe(false);
      expect(isBigint(true)).toBe(false);
      expect(isBigint(null)).toBe(false);
      expect(isBigint(undefined)).toBe(false);
      expect(isBigint({})).toBe(false);
      expect(isBigint([])).toBe(false);
      expect(isBigint(Symbol("b"))).toBe(false);
      expect(isBigint(() => {})).toBe(false);
    });
  });
  describe("isUndefined", () => {
    it("should return true for undefined", () => {
      expect(isUndefined(undefined)).toBe(true);
    });
    it("should return false for defined values", () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined("")).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined({})).toBe(false);
      expect(isUndefined([])).toBe(false);
      expect(isUndefined(Symbol("u"))).toBe(false);
      expect(isUndefined(() => {})).toBe(false);
    });
  });
  describe("isNull", () => {
    it("should return true for null", () => {
      expect(isNull(null)).toBe(true);
    });
    it("should return false for non-null values", () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull("")).toBe(false);
      expect(isNull(false)).toBe(false);
      expect(isNull({})).toBe(false);
      expect(isNull([])).toBe(false);
      expect(isNull(Symbol("n"))).toBe(false);
      expect(isNull(() => {})).toBe(false);
    });
  });
  describe("isNullish", () => {
    it("should return true for null and undefined", () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });
    it("should return false for defined values", () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish("")).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish({})).toBe(false);
      expect(isNullish([])).toBe(false);
      expect(isNullish(Symbol("n"))).toBe(false);
      expect(isNullish(() => {})).toBe(false);
    });
  });
  describe("isObjectLike", () => {
    it("should return true for objects and functions", () => {
      expect(isObjectLike({})).toBe(true);
      expect(isObjectLike([])).toBe(true);
      expect(isObjectLike(() => {})).toBe(true);
      expect(isObjectLike(new Date())).toBe(true);
    });
    it("should return false for null and primitives", () => {
      expect(isObjectLike(null)).toBe(false);
      expect(isObjectLike(123)).toBe(false);
      expect(isObjectLike("abc")).toBe(false);
      expect(isObjectLike(true)).toBe(false);
      expect(isObjectLike(undefined)).toBe(false);
      expect(isObjectLike(Symbol("o"))).toBe(false);
      expect(isObjectLike(10n)).toBe(false);
    });
  });
  describe("isFunction", () => {
    it("should return true for functions", () => {
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
    });
    it("should return false for non-function values", () => {
      expect(isFunction(123)).toBe(false);
      expect(isFunction("func")).toBe(false);
      expect(isFunction(true)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(Symbol("f"))).toBe(false);
      expect(isFunction(10n)).toBe(false);
    });
  });
  describe("ctor", () => {
    it("should construct a class with no arguments", () => {
      class Foo {
        x = 42;
      }
      const fooCtor = ctor(Foo);
      const instance = fooCtor();
      expect(instance).toBeInstanceOf(Foo);
      expect(instance.x).toBe(42);
    });
    it("should construct a class with arguments", () => {
      class Bar {
        constructor(
          public a: number,
          public b: string,
        ) {}
      }
      const barCtor = ctor(Bar);
      const instance = barCtor(7, "hello");
      expect(instance).toBeInstanceOf(Bar);
      expect(instance.a).toBe(7);
      expect(instance.b).toBe("hello");
    });
    it("should work with classes that extend others", () => {
      class Base {
        constructor(public base: string) {}
      }
      class Derived extends Base {
        constructor(
          base: string,
          public extra: number,
        ) {
          super(base);
        }
      }
      const derivedCtor = ctor(Derived);
      const instance = derivedCtor("foo", 99);
      expect(instance).toBeInstanceOf(Derived);
      expect(instance.base).toBe("foo");
      expect(instance.extra).toBe(99);
    });
  });
  describe("toTypeString", () => {
    it("should return correct type string for primitives", () => {
      expect(toTypeString("abc")).toBe("[object String]");
      expect(toTypeString(123)).toBe("[object Number]");
      expect(toTypeString(true)).toBe("[object Boolean]");
      expect(toTypeString(undefined)).toBe("[object Undefined]");
      expect(toTypeString(null)).toBe("[object Null]");
      expect(toTypeString(Symbol("s"))).toBe("[object Symbol]");
      expect(toTypeString(10n)).toBe("[object BigInt]");
    });
    it("should return correct type string for objects", () => {
      expect(toTypeString({})).toBe("[object Object]");
      expect(toTypeString([])).toBe("[object Array]");
      expect(toTypeString(new Date())).toBe("[object Date]");
      expect(toTypeString(/abc/)).toBe("[object RegExp]");
      expect(toTypeString(new Map())).toBe("[object Map]");
      expect(toTypeString(new Set())).toBe("[object Set]");
    });
    it("should return correct type string for functions and classes", () => {
      function fn() {}
      class MyClass {}
      expect(toTypeString(fn)).toBe("[object Function]");
      expect(toTypeString(MyClass)).toBe("[object Function]");
      expect(toTypeString(() => {})).toBe("[object Function]");
      expect(toTypeString(async () => {})).toBe("[object AsyncFunction]");
    });
  });
});
