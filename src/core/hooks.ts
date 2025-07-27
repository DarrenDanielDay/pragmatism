import type { Nullable } from "./types";
class Scope<T> implements Disposable {
  readonly context: Nullable<T>;
  #stack: ScopeStack<T>;
  constructor(context: Nullable<T>, stack: ScopeStack<T>) {
    this.context = context;
    this.#stack = stack;
    stack.enter(context);
  }
  [Symbol.dispose](): void {
    this.#stack.quit();
  }
}

export class ScopeStack<T> implements Disposable {
  #stack: Nullable<T>[] = [];
  readonly resolve = () => this.#stack.at(-1);
  readonly enter = (context: Nullable<T>) => this.#stack.push(context);
  readonly scope = (context: Nullable<T>) => new Scope(context, this);
  readonly quit = () => this.#stack.pop();
  [Symbol.dispose](): void {
    this.#stack.length = 0;
  }
}

export const scopes = <T>() => {
  const stack = new ScopeStack<T>();
  return [stack.enter, stack.quit, stack.resolve, stack.scope] as const;
};
