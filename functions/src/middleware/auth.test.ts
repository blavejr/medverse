import {jwtAuth} from "./auth";
import {extractToken, verifyToken} from "../utils/jwt";
import {sendError} from "../utils/http";
import {HttpStatus} from "../types/enums";
import type {Request, Response} from "express";

jest.mock("../utils/jwt");
jest.mock("../utils/http");

describe("middleware/auth", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    jest.clearAllMocks();
  });

  describe("jwtAuth", () => {
    it("should return payload for valid token", () => {
      const mockPayload = {sessionId: "test-123"};
      mockRequest.headers = {authorization: "Bearer valid-token"};

      (extractToken as jest.Mock).mockReturnValue("valid-token");
      (verifyToken as jest.Mock).mockReturnValue(mockPayload);

      const result = jwtAuth(mockRequest as Request, mockResponse as Response);

      expect(result).toEqual(mockPayload);
      expect(extractToken).toHaveBeenCalledWith("Bearer valid-token");
      expect(verifyToken).toHaveBeenCalledWith("valid-token");
    });

    it("should return null for missing token", () => {
      mockRequest.headers = {};

      (extractToken as jest.Mock).mockReturnValue(null);

      const result = jwtAuth(mockRequest as Request, mockResponse as Response);

      expect(result).toBeNull();
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Missing or invalid authorization header",
        HttpStatus.UNAUTHORIZED
      );
    });

    it("should return null for invalid authorization header", () => {
      mockRequest.headers = {authorization: "invalid-format"};

      (extractToken as jest.Mock).mockReturnValue(null);

      const result = jwtAuth(mockRequest as Request, mockResponse as Response);

      expect(result).toBeNull();
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Missing or invalid authorization header",
        HttpStatus.UNAUTHORIZED
      );
    });

    it("should return null for expired token", () => {
      mockRequest.headers = {authorization: "Bearer expired-token"};

      (extractToken as jest.Mock).mockReturnValue("expired-token");
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Token expired");
      });

      const result = jwtAuth(mockRequest as Request, mockResponse as Response);

      expect(result).toBeNull();
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Invalid or expired token",
        HttpStatus.UNAUTHORIZED
      );
    });

    it("should return null for invalid token", () => {
      mockRequest.headers = {authorization: "Bearer invalid-token"};

      (extractToken as jest.Mock).mockReturnValue("invalid-token");
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = jwtAuth(mockRequest as Request, mockResponse as Response);

      expect(result).toBeNull();
      expect(sendError).toHaveBeenCalledWith(
        mockResponse,
        "Invalid or expired token",
        HttpStatus.UNAUTHORIZED
      );
    });
  });
});
