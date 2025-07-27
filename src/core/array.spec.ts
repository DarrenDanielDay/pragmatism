import { append, cycleAt, perfectShuffle, repeat, repeatFor, shuffle } from "./array";

describe("core.array", () => {
  describe("repeat", () => {
    it("should return array of repeated items", () => {
      expect(repeat([1, 2, 3], 2)).toEqual([1, 2, 3, 1, 2, 3]);
      expect(repeat([1, 2, 3], 0)).toEqual([]);
    });
  });
  describe("repeatFor", () => {
    it("should return array of repeated items", () => {
      expect(repeatFor(3, null)).toEqual([null, null, null]);
    });
    it("should return array of repeated created items", () => {
      let i = 0;
      expect(repeatFor(3, () => i++)).toEqual([0, 1, 2]);
    });
  });
  describe("append", () => {
    it("should return appended array", () => {
      const arr = [1, 2];
      const appended = append(arr, [3]);
      expect(appended).toEqual([1, 2, 3]);
      expect(appended).toBe(arr);
    });
  });
  describe("cycleAt", () => {
    it("should return cycle-indexed element", () => {
      expect(cycleAt([0, 1, 2], 6)).toBe(0);
    });
  });
  describe("shuffle", () => {
    it("should return array with same elements", () => {
      expect(new Set(shuffle([1, 2, 3]))).toEqual(new Set([1, 2, 3]));
    });
  });
  describe("perfectShuffle", () => {
    it("should return perfect shuffled deck with same length", () => {
      const a = [1, 2, 3, 4],
        b = [5, 6, 7, 8];
      expect(perfectShuffle(a, b)).toEqual([5, 1, 6, 2, 7, 3, 8, 4]);
    });
    it("should return perfect shuffled deck with short first", () => {
      let a = [1, 2, 3],
        b = [5, 6, 7, 8];
      expect(perfectShuffle(a, b)).toEqual([5, 6, 1, 7, 2, 8, 3]);
      b = [4, 5, 6, 7, 8];
      expect(perfectShuffle(a, b)).toEqual([4, 5, 6, 1, 7, 2, 8, 3]);
    });
    it("should return perfect shuffled deck with long first", () => {
      let a = [1, 2, 3, 4],
        b = [5, 6, 7];
      expect(perfectShuffle(a, b)).toEqual([1, 5, 2, 6, 3, 7, 4]);
      a = [0, 1, 2, 3, 4];
      expect(perfectShuffle(a, b)).toEqual([0, 1, 5, 2, 6, 3, 7, 4]);
    });
  });
});
