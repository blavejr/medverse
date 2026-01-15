import {generateId} from "./uuid";

describe("uuid", () => {
  describe("generateId", () => {
    it("should return a string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
    });

    it("should return a valid UUID format", () => {
      const id = generateId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });

    it("should return unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
