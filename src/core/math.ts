import { die } from "./fp";
import { ctor, isNumber } from "./language";

const ERR_NOT_INTEGER = (value: number) => `${value} is not integer.`;
const ERR_DIVISION_BY_ZERO = "Division by zero.";
const ERR_NOT_SQUARE_MATRIX = "Matrix is not square.";

/**
 * To distinguish with `window.Range` in browser, use `IntegerRange` as the class name.
 * Present an integer range `[start, stop) ∩ { start + step * k }`.
 */
export class IntegerRange {
  readonly start: number;
  readonly stop: number;
  readonly step: number;
  readonly direction: number;
  constructor(stop: number);
  constructor(start: number, stop: number);
  constructor(start: number, stop: number, step: number);
  constructor(...args: number[]) {
    let start: number;
    let stop: number;
    let step: number;
    if (args.length === 1) {
      [start, stop, step] = [0, args[0], 1];
    } else {
      [start, stop, step] = [args[0], args[1], args[2] ?? 1];
    }
    const notInteger = [start, stop, step].find((p) => !Number.isInteger(p));
    if (notInteger) {
      throw new Error(ERR_NOT_INTEGER(notInteger));
    }
    if (step === 0) {
      throw new Error("Step cannot be zero.");
    }
    this.direction = Math.sign(stop - start);
    this.start = start;
    this.stop = stop;
    this.step = step;
  }

  #compareStart(value: number) {
    if (this.direction > 0) {
      return this.start <= value;
    } else {
      return value <= this.start;
    }
  }

  #compareStop(value: number) {
    if (this.direction > 0) {
      return value < this.stop;
    } else {
      return this.stop < value;
    }
  }

  /**
   * value in float number interval `[start, stop)`
   */
  between(value: number) {
    return this.#compareStart(value) && this.#compareStop(value);
  }

  /**
   * value in the integer range
   */
  contains(value: number) {
    if (!this.between(value)) {
      return false;
    }
    return Number.isInteger((value - this.start) / this.step);
  }

  *[Symbol.iterator]() {
    if (Math.sign(this.step) !== this.direction) {
      return;
    }
    for (let i = this.start; this.#compareStop(i); i += this.step) {
      yield i;
    }
  }
}

export interface IntegerRangeFactory {
  (stop: number): IntegerRange;
  (start: number, stop: number): IntegerRange;
  (start: number, stop: number, step: number): IntegerRange;
}

// @ts-expect-error not error
export const range: IntegerRangeFactory = ctor(IntegerRange);

export const max = (arr: number[]) => {
  return arr.reduce((acc, cur) => Math.max(acc, cur), -Infinity);
};

export const sum = (arr: number[]) => {
  return arr.reduce((s, curr) => s + curr, 0);
};

export const divide = (a: number, b: number) => {
  const quotient = Math.floor(a / b);
  const remainder = a - quotient * b;
  return [quotient, remainder] as const;
};

export const gcd = (a: number, b: number) => {
  a = Math.abs(a);
  b = Math.abs(b);
  let r: number;
  while (b > 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return a;
};

export type Matrix = number[][];
type _Vec<N extends number, T, _A extends T[]> = _A["length"] extends N ? _A : _Vec<N, T, [T, ..._A]>;
export type Vector<N extends number, T> = _Vec<N, T, []>;
export type SquareMatrix<N extends number> = Vector<N, Vector<N, number>>;
export type Add<A extends number, B extends number> = [...Vector<A, 0>, ...Vector<B, 0>]["length"] & number;
export type AugmentedMatrix<N extends number> = Vector<N, Vector<Add<N, 1>, number>>;

export const vector = <N extends number, T = number>(n: N, zero: T): Vector<N, T> =>
  // @ts-expect-error cannot type check
  Array.from({ length: n }, () => structuredClone(zero));

export const squareMatrix = <N extends number>(mat: SquareMatrix<N>) => mat;

export const vectorOrder = <N extends number>(mat: Vector<N, any>): N => {
  // @ts-expect-error cannot type check.
  return mat.length;
};

export const isMatrix = (value: unknown): value is Matrix => {
  if (!Array.isArray(value)) {
    return false;
  }
  const row0 = value[0];
  if (row0 == null || !Array.isArray(row0) || row0.length <= 0) {
    return false;
  }
  return value.every((item) => Array.isArray(item) && item.length === row0.length && item.every(isNumber));
};

export const isSquareMatrix = <N extends number>(mat: Matrix): mat is SquareMatrix<N> => {
  const n = mat.length;
  return mat.every((r) => r.length === n);
};

export const cofactor = <N extends number>(mat: SquareMatrix<N>, r: number, c: number): number => {
  if (!isSquareMatrix(mat)) {
    return die(ERR_NOT_SQUARE_MATRIX);
  }
  const data: Matrix = mat;
  const cofactor = data.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
  // @ts-expect-error skip square matrix check
  return det(cofactor);
};

export const det = <N extends number>(mat: SquareMatrix<N>): number => {
  if (!isSquareMatrix<N>(mat)) {
    return die(ERR_NOT_SQUARE_MATRIX);
  }
  let sum = 0,
    sign = 1,
    n = vectorOrder(mat);
  if (n === 1) {
    return (mat as Matrix)[0]![0]!;
  }
  for (let i = 0, l = n; i < l; ++i) {
    sum += sign * (mat as Matrix)[i]![0]! * cofactor(mat, i, 0);
    sign *= -1;
  }
  return sum;
};

export const solve = <N extends number>(mat: AugmentedMatrix<N>): Vector<N, number> => {
  const n = vectorOrder(mat);
  const solution = vector(n, 0);
  const A = (mat as Matrix).map((r) => r.slice(0, -1));
  if (!isSquareMatrix(A)) {
    throw new Error(`Invalid augmented matrix demension.`);
  }
  const d = det(A);
  for (let i = 0; i < n; ++i) {
    const square = structuredClone(A);
    for (let j = 0; j < n; ++j) {
      const squareData: Matrix = square;
      squareData[j]![i]! = (mat as Matrix)[j]!.at(-1)!;
    }
    const vec: number[] = solution;
    vec[i] = det(square) / d;
  }
  return solution;
};

export class Fraction {
  static round(value: number, unit: Fraction) {
    const times = Math.round(value / unit.valueOf());
    return unit.mul(new Fraction(times));
  }
  static floor(value: number, unit: Fraction) {
    const times = Math.floor(value / unit.valueOf());
    return unit.mul(new Fraction(times));
  }

  public readonly p: number;
  public readonly q: number;

  constructor(p: number, q: number = 1) {
    if (!Number.isInteger(p)) {
      // TODO change to die
      throw new Error(ERR_NOT_INTEGER(p));
    }
    if (!Number.isInteger(q)) {
      // TODO change to die
      throw new Error(ERR_NOT_INTEGER(q));
    }
    if (q === 0) {
      // TODO change to die
      throw new Error(ERR_DIVISION_BY_ZERO);
    }
    const k = gcd(p, q);
    this.p = p / k;
    this.q = q / k;
    if (this.q < 0) {
      this.p = -this.p;
      this.q = -this.q;
    }
  }

  isInteger() {
    return this.q === 1;
  }

  isZero() {
    return this.p === 0;
  }

  add(other: Fraction) {
    return fraction(this.p * other.q + this.q * other.p, this.q * other.q);
  }

  sub(other: Fraction) {
    return fraction(this.p * other.q - this.q * other.p, this.q * other.q);
  }

  mul(other: Fraction) {
    return fraction(this.p * other.p, this.q * other.q);
  }

  div(other: Fraction) {
    return fraction(this.p * other.q, this.q * other.p);
  }

  inv() {
    return fraction(this.q, this.p);
  }

  lt(other: Fraction) {
    return this.p * other.q < this.q * other.p;
  }

  le(other: Fraction) {
    return this.p * other.q <= this.q * other.p;
  }

  eq(other: Fraction) {
    return this.p === other.p && this.q === other.q;
  }

  ge(other: Fraction) {
    return this.p * other.q >= this.q * other.p;
  }

  gt(other: Fraction) {
    return this.p * other.q > this.q * other.p;
  }

  min(other: Fraction) {
    return this.lt(other) ? this : other;
  }

  max(other: Fraction) {
    return this.gt(other) ? this : other;
  }

  toString() {
    return `${this.p}/${this.q}`;
  }

  valueOf() {
    return this.p / this.q;
  }
}

export const fraction = ctor(Fraction);

export class Fixed extends Number {
  static round(value: number, fixed: number) {
    const zoom = 10 ** fixed;
    const int = Math.round(value * zoom);
    return new Fixed(int / zoom, fixed);
  }
  static floor(value: number, fixed: number) {
    const zoom = 10 ** fixed;
    const int = Math.floor(value * zoom);
    return new Fixed(int / zoom, fixed);
  }
  digits: number;
  constructor(value: number, digits: number) {
    super(value);
    if (!Number.isInteger(digits)) {
      // TODO change to die
      throw new Error(ERR_NOT_INTEGER(digits));
    }
    this.digits = digits;
  }

  override toString(radix?: number): string {
    if (radix) {
      return super.toString(radix);
    }
    const value = this.valueOf();
    const base = 10 ** this.digits;
    return (Math.round(value * base) / base).toFixed(this.digits);
  }

  /**
   * Returns truncated digit, so it will not return a number.
   */
  floor() {
    const value = this.valueOf();
    return Fixed.floor(value, this.digits).toFixed(this.digits);
  }
}

export const fixed = ctor(Fixed);
