import { indexBy, mapProp } from "./collection";

describe("collection", () => {
  describe("indexBy", () => {
    it("should return indexed object", () => {
      const tom = { id: "Tom", kind: "Cat" };
      const jerry = { id: "Jerry", kind: "Mouse" };
      const indexed = indexBy([tom, jerry], (it) => it.id);
      expect(indexed).toEqual({
        Tom: tom,
        Jerry: jerry,
      });
    });
  });
  describe("mapProp", () => {
    it("should map properties", () => {
      const mapped = mapProp({ a: 1, b: 2 }, (it) => it * 2);
      expect(mapped).toEqual({ a: 2, b: 4 });
    });
  });
});
