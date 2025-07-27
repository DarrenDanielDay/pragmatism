import { scopes, ScopeStack } from "./hooks";

describe("core.hooks", () => {
  describe("ScopeStack", () => {
    it("should enter and resolve context correctly", () => {
      const [enter, quit, resolve] = scopes<number>();
      expect(resolve()).toBeUndefined();
      enter(1);
      expect(resolve()).toBe(1);
      enter(2);
      expect(resolve()).toBe(2);
      quit();
      expect(resolve()).toBe(1);
      quit();
      expect(resolve()).toBeUndefined();
    });

    it("should quit context and clear stack", () => {
      const [enter, quit, resolve] = scopes<string>();
      enter("a");
      enter("b");
      quit();
      expect(resolve()).toBe("a");
      quit();
      expect(resolve()).toBeUndefined();
    });

    it("should clear stack on dispose", () => {
      const stack = new ScopeStack<number>();
      stack.enter(10);
      stack.enter(20);
      expect(stack.resolve()).toBe(20);
      stack[Symbol.dispose]();
      expect(stack.resolve()).toBeUndefined();
    });

    it("should create a scope and dispose it", () => {
      const stack = new ScopeStack<number>();
      const scope = stack.scope(42);
      expect(stack.resolve()).toBe(42);
      scope[Symbol.dispose]();
      expect(stack.resolve()).toBeUndefined();
    });

    it("should handle multiple scopes", () => {
      const stack = new ScopeStack<string>();
      const scope1 = stack.scope("foo");
      expect(stack.resolve()).toBe("foo");
      const scope2 = stack.scope("bar");
      expect(stack.resolve()).toBe("bar");
      scope2[Symbol.dispose]();
      expect(stack.resolve()).toBe("foo");
      scope1[Symbol.dispose]();
      expect(stack.resolve()).toBeUndefined();
    });
  });
  describe("scopes", () => {
    it("should be function like usage", () => {
      const [enter, quit, resolve] = scopes<number>();
      function useDouble() {
        return resolve()! * 2;
      }
      enter(2);
      expect(useDouble()).toBe(4);
      enter(3);
      expect(useDouble()).toBe(6);
      enter(undefined);
      expect(useDouble()).toBe(NaN);
      quit();
      expect(useDouble()).toBe(6);
      quit();
      expect(useDouble()).toBe(4);
      quit();
    });
  });
});
