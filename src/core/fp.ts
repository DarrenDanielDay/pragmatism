import type { Validator, UnionToIntersection, Nullable } from "./types";

export type AnyParam = readonly any[];
export type AnyFunc = (...args: AnyParam) => any;

export const noop = () => {};

export const identity = <T>(value: T): T => value;

export { identity as cast };

export const die = (msg?: string): never => {
  throw new Error(msg);
};

export const assert: (condition: boolean, msg?: string) => asserts condition is true = (
  condition: boolean,
  msg?: string,
): asserts condition is true => {
  if (!condition) {
    return die(msg);
  }
};

export { assert as invariant };

export const notnull = <T>(value: Nullable<T>, msg?: string) => {
  if (value == null) {
    return die(msg ?? "Not null assertion failed.");
  }
  return value;
};

export const skip = (): true => true;

type GuardsUnion<A extends Validator<any>[]> = A[number] extends Validator<infer T> ? T : never;
type GuardsIntersecton<A extends Validator<any>[]> = A[number] extends Validator<infer T>
  ? UnionToIntersection<T>
  : never;

export const union =
  <A extends Validator<any>[]>(validators: A): Validator<GuardsUnion<A>> =>
  (value): value is GuardsUnion<A> =>
    validators.some((validator) => validator(value));

export const intersection =
  <A extends Validator<any>[]>(validators: A): Validator<GuardsIntersecton<A>> =>
  (value): value is GuardsIntersecton<A> =>
    validators.every((validator) => validator(value));

export const _ = Symbol.for("@@placeholder");

export type Placeholder = typeof _;

type PassedParameter<P extends AnyParam> = {
  [K in keyof P]: P[K] | Placeholder;
};

type _RP<P extends AnyParam, PP extends AnyParam, RP extends AnyParam> = P extends readonly [infer F, ...infer R]
  ? PP extends readonly [infer PF, ...infer PR]
    ? PF extends Placeholder
      ? _RP<R, PR, readonly [...RP, F]>
      : _RP<R, PR, RP>
    : RP
  : RP;

type RestParam<P extends AnyParam, PP extends PassedParameter<P>> = _RP<P, PP, []>;

export const partial = <P extends AnyParam, R>(fn: (...args: P) => R, count?: P["length"]) => {
  count ??= fn.length;
  if (!(count > 0)) {
    return die("Invalid parameter count.");
  }
  return <PP extends PassedParameter<P>>(...pp: PP) => {
    if (pp.length !== count) {
      return die(`Expected ${count} parameters, got ${pp.length} parameters.`);
    }
    return function (...rp: RestParam<P, PP>): R {
      let i = 0;
      const args = pp.map((p) => (p === _ ? rp[i++] : p));
      // @ts-expect-error
      return fn.apply(this, args);
    };
  };
};

export const property =
  <T extends object, K extends keyof T>(key: K) =>
  (obj: T): T[K] =>
    obj[key];

export { property as prop };
