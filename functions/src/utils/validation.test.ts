import {z} from "zod";
import {validate} from "./validation";

describe("validation", () => {
  describe("validate", () => {
    const testSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it("should return parsed data for valid input", () => {
      const data = {name: "John", age: 30};
      const result = validate(testSchema, data);
      expect(result).toEqual(data);
    });

    it("should throw error for invalid input", () => {
      const data = {name: "John", age: "thirty"};
      expect(() => validate(testSchema, data)).toThrow();
    });

    it("should throw error for missing required fields", () => {
      const data = {name: "John"};
      expect(() => validate(testSchema, data)).toThrow();
    });
  });
});
