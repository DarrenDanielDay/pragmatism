import { delay } from "./universal.js";

describe("universal", () => {
  describe("delay", () => {
    it("should delay by milliseconds", async () => {
      const start = Date.now();
      await delay(100);
      expect(Date.now() - start).toBeGreaterThan(100);
    });
  });
});
