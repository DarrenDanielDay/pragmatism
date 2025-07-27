import { dateTemplate, delay } from "./time";

describe("universal", () => {
  describe("delay", () => {
    it("should delay by milliseconds", async () => {
      const start = Date.now();
      await delay(100);
      expect(Date.now() - start).toBeGreaterThanOrEqual(95);
    });
  });
  describe("formatDate", () => {
    const testDate = new Date();
    testDate.setFullYear(2025);
    testDate.setMonth(3);
    testDate.setDate(9);
    testDate.setHours(16);
    testDate.setMinutes(25);
    testDate.setSeconds(36);
    testDate.setMilliseconds(49);
    it("should provide date format items", () => {
      const fullFormat = dateTemplate`${"YYYY"}/${"MM"}/${"dd"} ${"HH"}:${"mm"}:${"ss"}.${"SSS"}`;
      expect(fullFormat(testDate)).toBe("2025/04/09 16:25:36.049");
    });
  });
});
