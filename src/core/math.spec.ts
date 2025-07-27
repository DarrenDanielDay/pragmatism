import {
  cofactor,
  det,
  divide,
  Fixed,
  fixed,
  Fraction,
  fraction,
  gcd,
  isMatrix,
  isSquareMatrix,
  max,
  range,
  solve,
  type SquareMatrix,
  squareMatrix,
  sum,
  vector,
  vectorOrder,
} from "./math";

describe("core.math", () => {
  describe("IntegerRange", () => {
    it("should create a range from 0 to stop (exclusive) with default step 1", () => {
      const r = range(5);
      expect(r.start).toBe(0);
      expect(r.stop).toBe(5);
      expect(r.step).toBe(1);
      expect([...r]).toEqual([0, 1, 2, 3, 4]);
    });

    it("should create a range from start to stop (exclusive) with default step 1", () => {
      const r = range(2, 6);
      expect(r.start).toBe(2);
      expect(r.stop).toBe(6);
      expect(r.step).toBe(1);
      expect([...r]).toEqual([2, 3, 4, 5]);
    });

    it("should create a range with custom step", () => {
      const r = range(1, 10, 3);
      expect(r.start).toBe(1);
      expect(r.stop).toBe(10);
      expect(r.step).toBe(3);
      expect([...r]).toEqual([1, 4, 7]);
    });

    it("should create a decreasing range with negative step", () => {
      const r = range(5, 0, -2);
      expect(r.start).toBe(5);
      expect(r.stop).toBe(0);
      expect(r.step).toBe(-2);
      expect([...r]).toEqual([5, 3, 1]);
    });

    it("should throw if step is zero", () => {
      expect(() => range(0, 5, 0)).toThrow("Step cannot be zero.");
    });

    it("should throw if start, stop, or step is not integer", () => {
      expect(() => range(0.5, 5)).toThrow();
      expect(() => range(0, 5.5)).toThrow();
      expect(() => range(0, 5, 1.1)).toThrow();
    });

    it("between() should check if value is in float interval [start, stop)", () => {
      const r = range(2, 5);
      expect(r.between(2)).toBe(true);
      expect(r.between(4.9)).toBe(true);
      expect(r.between(5)).toBe(false);
      expect(r.between(1.9)).toBe(false);
    });

    it("contains() should check if value is in integer set of the range", () => {
      const r = range(2, 10, 3); // [2,5,8]
      expect(r.contains(2)).toBe(true);
      expect(r.contains(5)).toBe(true);
      expect(r.contains(8)).toBe(true);
      expect(r.contains(3)).toBe(false);
      expect(r.contains(11)).toBe(false);
      expect(r.contains(1)).toBe(false);
    });

    it("should iterate correctly for empty ranges", () => {
      expect([...range(0)]).toEqual([]);
      expect([...range(5, 5)]).toEqual([]);
      expect([...range(5, 2)]).toEqual([]);
      expect([...range(2, 5, -1)]).toEqual([]);
    });

    it("should work with for...of", () => {
      const r = range(3);
      const arr: number[] = [];
      for (const i of r) arr.push(i);
      expect(arr).toEqual([0, 1, 2]);
    });

    it("should handle negative direction with correct contains and between", () => {
      const r = range(5, -1, -2); // [5,3,1]
      expect(r.contains(5)).toBe(true);
      expect(r.contains(3)).toBe(true);
      expect(r.contains(1)).toBe(true);
      expect(r.contains(0)).toBe(false);
      expect(r.between(5)).toBe(true);
      expect(r.between(-1)).toBe(false);
    });
  });
  describe("max", () => {
    it("should return max value in array", () => {
      expect(max([1, 2, 3])).toBe(3);
      expect(max([1, 2, NaN])).toBe(NaN);
      expect(max([1, Infinity, 3])).toBe(Infinity);
      expect(max([])).toBe(-Infinity);
    });
  });
  describe("sum", () => {
    it("should return sum of array", () => {
      expect(sum([1, 2, 3])).toBe(6);
      expect(sum([1, 2, NaN])).toBe(NaN);
      expect(sum([1, Infinity, 3])).toBe(Infinity);
      expect(sum([])).toBe(0);
    });
  });
  describe("divide", () => {
    it("should return quotient and remider", () => {
      const [quotient, remainder] = divide(7, 3);
      expect(quotient).toBe(2);
      expect(remainder).toBe(1);
    });
  });
  describe("gcd", () => {
    it("should return the greatest common divisor of two positive integers", () => {
      expect(gcd(12, 8)).toBe(4);
      expect(gcd(100, 25)).toBe(25);
      expect(gcd(17, 13)).toBe(1);
    });

    it("should return the absolute value for negative numbers", () => {
      expect(gcd(-12, 8)).toBe(4);
      expect(gcd(12, -8)).toBe(4);
      expect(gcd(-12, -8)).toBe(4);
    });

    it("should return a when b is 0", () => {
      expect(gcd(7, 0)).toBe(7);
      expect(gcd(0, 7)).toBe(7);
    });

    it("should return 0 when both a and b are 0", () => {
      expect(gcd(0, 0)).toBe(0);
    });
  });
  describe("vector", () => {
    it("should create a vector of given length and value", () => {
      const v = vector(3, 0);
      expect(Array.isArray(v)).toBe(true);
      expect(v.length).toBe(3);
      expect(v.every((x: number) => x === 0)).toBe(true);
    });
  });
  describe("squareMatrix", () => {
    it("should check square matrix type", () => {
      const mat: SquareMatrix<2> = [
        [0, 0],
        [0, 0],
      ];
      expect(squareMatrix<2>(mat)).toBe(mat);
    });
  });
  describe("vectorOrder", () => {
    it("should return the length of the vector", () => {
      const v = vector(4, 0);
      expect(vectorOrder<4>(v)).toBe(4);
    });
  });
  describe("isMatrix", () => {
    it("should detect valid matrices", () => {
      expect(
        // 2x2 matrix
        isMatrix([
          [1, 2],
          [3, 4],
        ]),
      ).toBe(true);
      expect(
        // 3x3 matrix
        isMatrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ]),
      ).toBe(true);
      expect(
        // 2x3 matrix
        isMatrix([
          [1, 2, 3],
          [4, 5, 6],
        ]),
      ).toBe(true);
    });

    it("should reject non-matrix values", () => {
      expect(isMatrix(null)).toBe(false);
      expect(isMatrix(undefined)).toBe(false);
      expect(isMatrix(123)).toBe(false);
      expect(isMatrix("not a matrix")).toBe(false);
      expect(isMatrix([1, 2, 3])).toBe(false); // not array of arrays
      expect(isMatrix([[1, 2], [3]])).toBe(false); // rows of different lengths
      expect(
        isMatrix([
          [1, 2],
          ["a", "b"],
        ]),
      ).toBe(false); // non-number element
      expect(
        isMatrix([
          [1, 2],
          [3, NaN],
        ]),
      ).toBe(true); // NaN is a number
    });

    it("should reject empty arrays and arrays with empty rows", () => {
      expect(isMatrix([])).toBe(false);
      expect(isMatrix([[]])).toBe(false);
      expect(isMatrix([[1, 2], []])).toBe(false);
    });
  });
  describe("isSquareMatrix", () => {
    it("should detect square matrices", () => {
      expect(
        isSquareMatrix([
          [1, 2],
          [3, 4],
        ]),
      ).toBe(true);
      expect(
        isSquareMatrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ]),
      ).toBe(true);
      expect(
        isSquareMatrix([
          [1, 2],
          [3, 4, 5],
        ]),
      ).toBe(false);
      expect(isSquareMatrix([[1], [2, 3]])).toBe(false);
    });
  });
  describe("cofactor", () => {
    it("should compute the correct cofactor", () => {
      const mat = squareMatrix<3>([
        [1, 2, 3],
        [0, 4, 5],
        [7, 8, 9],
      ]);
      // Remove row 0, col 0: [[4,5],[8,9]] => det = 4*9-5*8 = 36-40 = -4
      expect(cofactor<3>(mat, 0, 0)).toBe(-4);
      // Remove row 1, col 1: [[1,3],[7,9]] => det = 1*9-3*7 = 9-21 = -12
      expect(cofactor<3>(mat, 1, 1)).toBe(-12);
    });
    it("should throw when matrix is not square", () => {
      expect(() => {
        // @ts-expect-error invalid shape
        cofactor([
          [1, 2, 3],
          [2, 3, 4],
        ]);
      }).toThrow();
    });
  });
  describe("det", () => {
    it("should compute determinant of 1x1, 2x2, 3x3 matrices", () => {
      expect(det<1>([[5]])).toBe(5);
      expect(
        det<2>([
          [1, 2],
          [3, 4],
        ]),
      ).toBe(-2);
      expect(
        det<3>([
          [6, 1, 1],
          [4, -2, 5],
          [2, 8, 7],
        ]),
      ).toBe(-306);
    });
    it("should throw on non-square matrix", () => {
      expect(() =>
        // @ts-expect-error invalid dimensions
        det([
          [1, 2, 3],
          [4, 5, 6],
        ]),
      ).toThrow();
    });
  });
  describe("solve", () => {
    it("should solve a system of linear equations (Cramer's rule)", () => {
      // x + y = 3, 2x + 5y = 12
      const sol = solve<2>([
        [1, 1, 3],
        [2, 5, 12],
      ]);
      expect(sol.length).toBe(2);
      expect(sol[0]).toBeCloseTo(1);
      expect(sol[1]).toBeCloseTo(2);
    });
    it("should return NaN if solution count is infinite", () => {
      // x + 2y = 3, 4x + 8y = 12
      const [x, y] = solve<2>([
        [1, 2, 3],
        [4, 8, 12],
      ]);
      expect(x).toBeNaN();
      expect(y).toBeNaN();
    });
    it("should return Infinity if no real solution", () => {
      // x + 2y = 3, x + 2y = 0
      const [x, y] = solve<2>([
        [1, 2, 3],
        [1, 2, 0],
      ]);
      expect(isFinite(x)).toBeFalsy();
      expect(isFinite(y)).toBeFalsy();
    });
    it("should throw when matrix dimenssion is incorrect", () => {
      expect(() => {
        // @ts-expect-error
        solve([
          [1, 2],
          [1, 2, 3],
        ]);
      }).toThrow();
    });
  });
  describe("matrix and vector utilities", () => {});
  describe("Fraction", () => {
    it("should create a reduced fraction", () => {
      const f = fraction(6, 8);
      expect(f.p).toBe(3);
      expect(f.q).toBe(4);
      expect(f.toString()).toBe("3/4");
    });

    it("should default denominator to 1", () => {
      const f = fraction(5);
      expect(f.p).toBe(5);
      expect(f.q).toBe(1);
      expect(f.toString()).toBe("5/1");
    });

    it("should throw if numerator is not integer", () => {
      expect(() => fraction(1.5, 2)).toThrow();
    });

    it("should throw if denominator is not integer", () => {
      expect(() => fraction(2, 1.5)).toThrow();
    });

    it("should throw on division by zero", () => {
      expect(() => fraction(1, 0)).toThrow();
    });

    it("should add two fractions", () => {
      const a = fraction(1, 2);
      const b = fraction(1, 3);
      const c = a.add(b);
      expect(c.p).toBe(5);
      expect(c.q).toBe(6);
      expect(c.toString()).toBe("5/6");
    });

    it("should subtract two fractions", () => {
      const a = fraction(3, 4);
      const b = fraction(1, 4);
      const c = a.sub(b);
      expect(c.p).toBe(1);
      expect(c.q).toBe(2);
      expect(c.toString()).toBe("1/2");
    });

    it("should multiply two fractions", () => {
      const a = fraction(2, 3);
      const b = fraction(3, 5);
      const c = a.mul(b);
      expect(c.toString()).toBe("2/5");
    });

    it("should divide two fractions", () => {
      const a = fraction(3, 4);
      const b = fraction(2, 5);
      const c = a.div(b);
      expect(c.p).toBe(15);
      expect(c.q).toBe(8);
      expect(c.toString()).toBe("15/8");
    });

    it("should invert a fraction", () => {
      const a = fraction(2, 3);
      const inv = a.inv();
      expect(inv.p).toBe(3);
      expect(inv.q).toBe(2);
      expect(inv.toString()).toBe("3/2");
    });

    it("should check if fraction is integer", () => {
      expect(fraction(4, 2).isInteger()).toBe(true);
      expect(fraction(3, 2).isInteger()).toBe(false);
    });

    it("should check if fraction is zero", () => {
      expect(fraction(0, 5).isZero()).toBe(true);
      expect(fraction(1, 5).isZero()).toBe(false);
    });

    it("should return correct valueOf", () => {
      expect(fraction(3, 4).valueOf()).toBeCloseTo(0.75);
    });

    it("should compare fractions with lt, le, eq, ge, gt", () => {
      const a = fraction(1, 2);
      const b = fraction(2, 3);
      const c = fraction(1, 2);

      expect(a.lt(b)).toBe(true);
      expect(b.lt(a)).toBe(false);

      expect(a.le(b)).toBe(true);
      expect(a.le(a)).toBe(true);

      expect(a.eq(b)).toBe(false);
      expect(a.eq(c)).toBe(true);

      expect(b.ge(a)).toBe(true);
      expect(a.ge(b)).toBe(false);

      expect(b.gt(a)).toBe(true);
      expect(a.gt(b)).toBe(false);
    });

    it("should compare negative fractions with lt, le, eq, ge, gt", () => {
      const a = fraction(-3, 4);
      const b = fraction(-1, 2);
      const c = fraction(-3, 4);

      expect(a.lt(b)).toBe(true); // -3/4 < -1/2
      expect(b.lt(a)).toBe(false);

      expect(a.le(b)).toBe(true);
      expect(a.le(a)).toBe(true);

      expect(a.eq(b)).toBe(false);
      expect(a.eq(c)).toBe(true);

      expect(b.ge(a)).toBe(true);
      expect(a.ge(b)).toBe(false);

      expect(b.gt(a)).toBe(true);
      expect(a.gt(b)).toBe(false);
    });

    it("should compare negative and positive fractions correctly", () => {
      const neg = fraction(-2, 3);
      const pos = fraction(1, 3);

      expect(neg.lt(pos)).toBe(true);
      expect(pos.gt(neg)).toBe(true);
      expect(neg.le(pos)).toBe(true);
      expect(pos.ge(neg)).toBe(true);
      expect(neg.eq(pos)).toBe(false);
      expect(neg.ge(pos)).toBe(false);
      expect(pos.le(neg)).toBe(false);
    });

    it("should compare zero with negative and positive fractions", () => {
      const zero = fraction(0, 1);
      const neg = fraction(-1, 2);
      const pos = fraction(1, 2);

      expect(zero.gt(neg)).toBe(true);
      expect(zero.lt(pos)).toBe(true);
      expect(zero.ge(neg)).toBe(true);
      expect(zero.le(pos)).toBe(true);
      expect(zero.eq(fraction(0, 5))).toBe(true);
      expect(zero.lt(neg)).toBe(false);
      expect(zero.gt(pos)).toBe(false);
    });

    it("should return min and max of two fractions", () => {
      const a = fraction(3, 4);
      const b = fraction(2, 3);

      expect(a.min(b).toString()).toBe("2/3");
      expect(b.min(a).toString()).toBe("2/3");
      expect(a.max(b).toString()).toBe("3/4");
      expect(b.max(a).toString()).toBe("3/4");
    });

    it("should handle negative fractions", () => {
      const a = fraction(-2, 3);
      const b = fraction(2, 3);

      expect(a.add(b).toString()).toBe("0/1");
      expect(a.sub(b).toString()).toBe("-4/3");
      expect(a.mul(b).toString()).toBe("-4/9");
      expect(a.div(b).toString()).toBe("-1/1");
      expect(a.inv().toString()).toBe("-3/2");
    });

    it("should handle zero numerator", () => {
      const a = fraction(0, 5);
      const b = fraction(2, 3);

      expect(a.add(b).toString()).toBe("2/3");
      expect(a.sub(b).toString()).toBe("-2/3");
      expect(a.mul(b).toString()).toBe("0/1");
      expect(() => a.div(b)).not.toThrow();
      expect(a.div(b).toString()).toBe("0/1");
    });

    it("should stringify negative fractions correctly", () => {
      const a = fraction(-3, 4);
      expect(a.toString()).toBe("-3/4");
    });

    it("should reduce negative denominator to numerator", () => {
      const a = fraction(3, -4);
      expect(a.p).toBe(-3);
      expect(a.q).toBe(4);
      expect(a.toString()).toBe("-3/4");
    });

    it("should return the minimum of two fractions", () => {
      const a = fraction(1, 2);
      const b = fraction(2, 3);
      const c = fraction(-1, 4);

      expect(a.min(b).toString()).toBe("1/2");
      expect(b.min(a).toString()).toBe("1/2");
      expect(a.min(c).toString()).toBe("-1/4");
      expect(c.min(a).toString()).toBe("-1/4");
      expect(a.min(a).toString()).toBe("1/2");
    });

    it("should return the minimum when fractions are equal", () => {
      const a = fraction(5, 7);
      const b = fraction(10, 14); // equal to 5/7
      expect(a.min(b).toString()).toBe("5/7");
      expect(b.min(a).toString()).toBe("5/7");
    });

    it("should handle negative and zero values in min", () => {
      const a = fraction(0, 1);
      const b = fraction(-2, 3);
      expect(a.min(b).toString()).toBe("-2/3");
      expect(b.min(a).toString()).toBe("-2/3");
    });

    it("should return round fraction value", () => {
      expect(Fraction.round(0.512, fraction(1, 10))).toEqual(fraction(5, 10));
      expect(Fraction.round(0.512, fraction(1, 100))).toEqual(fraction(51, 100));
      expect(Fraction.round(0.512, fraction(1, 7))).toEqual(fraction(4, 7));
    });

    it("should return floor fraction value", () => {
      expect(Fraction.floor(0.512, fraction(1, 10))).toEqual(fraction(5, 10));
      expect(Fraction.floor(0.512, fraction(1, 100))).toEqual(fraction(51, 100));
      expect(Fraction.floor(0.512, fraction(1, 7))).toEqual(fraction(3, 7));
    });
  });
  describe("Fixed", () => {
    const f1 = fixed(1.23, 1);
    const f2 = fixed(1.28, 1);
    it("should return fixed number", () => {
      expect(`${f1}`).toBe("1.2");
      expect(`${f2}`).toBe("1.3");
      expect(f1.toString()).toBe("1.2");
      expect(f2.toString()).toBe("1.3");
    });
    it("should return truncated digits", () => {
      expect(f1.floor()).toBe("1.2");
      expect(f2.floor()).toBe("1.2");
    });
    it("should behave like number", () => {
      expect(`${f1.toFixed(2)}`).toBe("1.23");
      expect(`${f1.toFixed(3)}`).toBe("1.230");
      expect(f1.toString(16)).toBe((1.23).toString(16));
      expect(f1.valueOf()).toBe(1.23);
      // @ts-expect-error suppress implicit type convert
      expect(f1 * 2).toBe(2.46);
    });
    it("should throw when digits is not integer", () => {
      expect(() => {
        fixed(1, 2.1);
      }).toThrow();
    });
    it("should return round value", () => {
      expect(Fixed.round(1.237, 2).toString()).toEqual("1.24");
      expect(Fixed.round(1.237, 1).toString()).toEqual("1.2");
      expect(Fixed.round(0.3, 1).toString()).toEqual("0.3");
      expect(Fixed.round(0.3, 1).valueOf()).toEqual(0.3);
    });
    it("should return truncated value", () => {
      expect(Fixed.floor(1.237, 2).toString()).toEqual("1.23");
      expect(Fixed.floor(1.237, 1).toString()).toEqual("1.2");
    });
  });
});
