import { type AnyFunc, type AnyParam, union } from "./fp";
import type { Validator, Nullish, Nullable } from "./types";

export const clone = structuredClone;

export const isString: Validator<string> = (value): value is string => typeof value === "string";

export const isNumber: Validator<number> = (value): value is number => typeof value === "number";

export const isBoolean: Validator<boolean> = (value): value is boolean => typeof value === "boolean";

export const isSymbol: Validator<symbol> = (value): value is symbol => typeof value === "symbol";

export const isBigint: Validator<bigint> = (value): value is bigint => typeof value === "bigint";

export const isUndefined: Validator<undefined> = (value): value is undefined => value === undefined;

export const isNull: Validator<null> = (value): value is null => value === null;

export const isNullish: Validator<Nullish> = (value): value is Nullish => value == null;

export const isKey: Validator<PropertyKey> = union([isString, isSymbol, isNumber]);

export const isObjectLike: Validator<object> = (value): value is object =>
  (typeof value === "object" && value !== null) || typeof value === "function";

export const isFunction: Validator<AnyFunc> = (value): value is AnyFunc => typeof value === "function";

export const ctor =
  <C extends new (...args: AnyParam) => any>(fn: C) =>
  (...args: ConstructorParameters<C>): InstanceType<C> =>
    Reflect.construct(fn, args);

export const toTypeString = (obj: unknown) => Object.prototype.toString.call(obj);

export const patch: <T extends object>(dist: T, ...patches: Nullable<Partial<T>>[]) => T = Object.assign;
