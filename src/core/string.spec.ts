import {
  concat,
  constant,
  expand,
  format,
  formatError,
  formatJSON,
  formatKeys,
  formatNullable,
  FormatProperties,
  pattern,
  untagged,
  variable,
} from "./string";

describe("core.string", () => {
  describe("untagged", () => {
    it("should work like normal template literals", () => {
      const num = 0,
        bignum = 1n,
        str = "abc",
        obj = {};
      expect(untagged`template strings: ${num} ${bignum} ${str} ${obj}`).toBe(
        `template strings: ${num} ${bignum} ${str} ${obj}`,
      );
    });
  });
  describe("format", () => {
    it("should return formatter factory", () => {
      const fmtTemplate = format({ Day: (d) => d.getDay() } satisfies FormatProperties<Date>);
      const dayOfDate = fmtTemplate`No of day is ${"Day"}.`;
      const now = new Date();
      expect(dayOfDate(now)).toBe(`No of day is ${now.getDay()}.`);
    });
    it("should have function slot", () => {
      const fmtTemplate = format({ Day: (d) => d.getDay() } satisfies FormatProperties<Date>);
      const dayOfDate1 = fmtTemplate`No of day is ${"Day"}.`;
      const dayOfDate2 = fmtTemplate`Message: ${dayOfDate1}`;
      const now = new Date();
      expect(dayOfDate1(now)).toBe(`No of day is ${now.getDay()}.`);
      expect(dayOfDate2(now)).toBe(`Message: No of day is ${now.getDay()}.`);
    });
    it("should throw when unknown properties are used", () => {
      const fmtTemplate = format({ Day: (d) => d.getDay() } satisfies FormatProperties<Date>);
      expect(() => {
        // @ts-expect-error
        fmtTemplate`No of day is ${"Date"}.`;
      }).toThrow(/unknown/i);
    });
  });
  describe("constant", () => {
    it("should return a function which returns constant string", () => {
      const prefix = constant("foo");
      expect(prefix()).toBe("foo");
      const fmt = format({})`${prefix}/`;
      expect(fmt({})).toBe("foo/");
    });
  });
  describe("variable", () => {
    it("should return a function which returns a changable string", () => {
      const prefix = variable("foo");
      expect(prefix()).toBe("foo");
      const fmt = format({})`${prefix}/`;
      expect(fmt({})).toBe("foo/");
      prefix.set("bar");
      expect(fmt({})).toBe("bar/");
    });
  });
  describe("expand", () => {
    it("should return expanded string", () => {
      const var1 = variable(1);
      const const2 = constant(2);
      expect(expand`${var1}_${const2}`).toBe("1_2");
    });
  });
  describe("concat", () => {
    it("should return new formatter", () => {
      const var1 = variable(1);
      const const2 = constant(2);
      const desc3 = (foo: { bar: string }) => foo.bar;
      const formatter = concat`${var1}_${const2}_${desc3}`;
      expect(formatter({ bar: "1" })).toBe("1_2_1");
      expect(formatter({ bar: "6" })).toBe("1_2_6");
    });
  });
  describe("formatNullable", () => {
    it("should return string representation for non-null/undefined values", () => {
      expect(formatNullable(123)).toBe("123");
      expect(formatNullable("abc")).toBe("abc");
      expect(formatNullable(false)).toBe("false");
      expect(formatNullable(0)).toBe("0");
    });
    it("should return empty string for null or undefined", () => {
      expect(formatNullable(null)).toBe("");
      expect(formatNullable(undefined)).toBe("");
    });
  });
  describe("formatError", () => {
    it("should return stack if present", () => {
      const err = new Error("fail");
      err.stack = "STACK_TRACE";
      expect(formatError(err)).toBe("STACK_TRACE");
    });
    it("should return message if stack is absent", () => {
      const err = new Error("fail");
      err.stack = undefined;
      expect(formatError(err)).toBe("fail");
    });
    it("should return empty string if both stack and message are empty", () => {
      const err = new Error("");
      err.stack = undefined;
      err.message = "";
      expect(formatError(err)).toBe("");
    });
  });
  describe("formatKeys", () => {
    it("should format symbol keys", () => {
      expect(() => {
        formatKeys([Symbol.toPrimitive]);
      }).not.toThrow();
    });
  });
  describe("formatJSON", () => {
    it("should format json with tab size 2 by default", () => {
      expect(formatJSON({ a: 1 })).toBe(`{
  "a": 1
}`);
    });
    it("should support change tab size", () => {
      expect(formatJSON({ a: 1 }, 4)).toBe(`{
    "a": 1
}`);
    });
  });
  describe("pattern", () => {
    it("should return null when not matched", () => {
      const parse = pattern({
        id: /[a-z]+/,
        kind: { match: /[0-4]/, as: Number },
      })`${"id"}_${"kind"}`;
      expect(parse("2_s")).toBeNull();
    });
    it("should match pattern and generate context", () => {
      const parse = pattern({
        id: /[a-z]+/,
        kind: { match: /[0-4]/, as: Number },
      })`${"id"}_${"kind"}`;
      const { id, kind } = parse("s_2")!;
      expect(id).toBe("s");
      expect(kind).toBe(2);
    });
    it("should throw when unused properties are declared in descriptors", () => {
      expect(() => {
        pattern({
          id: /[a-z]+/,
          kind: { match: /[0-4]/, as: Number },
        })`${"id"}_`;
      }).toThrow(/unused/i);
    });
    it("should throw when undeclared properties are present in pattern", () => {
      expect(() => {
        pattern({
          id: /[a-z]+/,
          kind: { match: /[0-4]/, as: Number },
          // @ts-expect-error unknown key for test cases
        })`${"id"}_${"kind2"}`;
      }).toThrow(/unknown/i);
    });
    it("should throw when properties are used more than once in pattern", () => {
      expect(() => {
        pattern({
          id: /[a-z]+/,
          kind: { match: /[0-4]/, as: Number },
        })`${"id"}_${"kind"}_${"id"}`;
      }).toThrow(/duplicated/i);
    });
  });
});
