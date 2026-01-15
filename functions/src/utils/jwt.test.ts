import {generateToken, verifyToken, extractToken} from "./jwt";

describe("jwt", () => {
  describe("generateToken", () => {
    it("should return a string token", () => {
      const token = generateToken({sessionId: "test-123"});
      expect(typeof token).toBe("string");
    });

    it("should create a valid JWT token", () => {
      const token = generateToken({sessionId: "test-123"});
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("verifyToken", () => {
    it("should verify and decode valid token", () => {
      const payload = {sessionId: "test-123"};
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.sessionId).toBe(payload.sessionId);
    });

    it("should throw error for invalid token", () => {
      expect(() => verifyToken("invalid-token")).toThrow();
    });
  });

  describe("extractToken", () => {
    it("should extract token from Bearer header", () => {
      const token = "abc123xyz";
      const result = extractToken(`Bearer ${token}`);
      expect(result).toBe(token);
    });

    it("should return null for missing header", () => {
      const result = extractToken(undefined);
      expect(result).toBeNull();
    });

    it("should return null for invalid format", () => {
      const result = extractToken("abc123xyz");
      expect(result).toBeNull();
    });
  });
});
