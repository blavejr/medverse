import {formatSession} from "./formatter";
import {SessionStatus} from "../types/session";

describe("formatter", () => {
  describe("formatSession", () => {
    it("should format session with ISO string timestamps", () => {
      const data = {
        region: "us-east",
        status: SessionStatus.ACTIVE,
        createdAt: "2025-01-15T10:00:00.000Z",
        updatedAt: "2025-01-15T10:00:00.000Z",
      };

      const result = formatSession("test-id", data);

      expect(result).toEqual({
        id: "test-id",
        region: "us-east",
        status: SessionStatus.ACTIVE,
        createdAt: "2025-01-15T10:00:00.000Z",
        updatedAt: "2025-01-15T10:00:00.000Z",
      });
    });

    it("should format session with Date objects", () => {
      const date = new Date("2025-01-15T10:00:00.000Z");
      const data = {
        region: "eu-west",
        status: SessionStatus.PENDING,
        createdAt: date,
        updatedAt: date,
      };

      const result = formatSession("test-id", data);

      expect(result.createdAt).toBe("2025-01-15T10:00:00.000Z");
      expect(result.updatedAt).toBe("2025-01-15T10:00:00.000Z");
    });

    it("should format session with Firestore Timestamp", () => {
      const mockTimestamp = {
        toDate: () => new Date("2025-01-15T10:00:00.000Z"),
      };

      const data = {
        region: "us-west",
        status: SessionStatus.COMPLETED,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      const result = formatSession("test-id", data);

      expect(result.createdAt).toBe("2025-01-15T10:00:00.000Z");
      expect(result.updatedAt).toBe("2025-01-15T10:00:00.000Z");
    });
  });
});
