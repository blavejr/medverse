import {sendSuccess, sendError, checkMethod} from "./http";
import {HttpMethod, HttpStatus} from "../types/enums";
import type {Request, Response} from "express";

describe("http", () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      method: "GET",
    };
  });

  describe("sendSuccess", () => {
    it("should send success response with data", () => {
      sendSuccess(mockResponse as Response, {test: "data"});

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        test: "data",
      });
    });

    it("should send success response with custom status", () => {
      sendSuccess(mockResponse as Response, {test: "data"}, HttpStatus.CREATED);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });
  });

  describe("sendError", () => {
    it("should send error response with message", () => {
      sendError(mockResponse as Response, "Error message");

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error message",
      });
    });

    it("should send error response with custom status", () => {
      sendError(mockResponse as Response, "Not found", HttpStatus.NOT_FOUND);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });
  });

  describe("checkMethod", () => {
    it("should return true for allowed method", () => {
      mockRequest.method = "POST";
      const result = checkMethod(
        mockRequest as Request,
        mockResponse as Response,
        HttpMethod.POST
      );

      expect(result).toBe(true);
    });

    it("should return false and send error for disallowed method", () => {
      mockRequest.method = "DELETE";
      const result = checkMethod(
        mockRequest as Request,
        mockResponse as Response,
        HttpMethod.POST
      );

      expect(result).toBe(false);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.METHOD_NOT_ALLOWED);
    });

    it("should allow multiple methods", () => {
      mockRequest.method = "PATCH";
      const result = checkMethod(
        mockRequest as Request,
        mockResponse as Response,
        [HttpMethod.POST, HttpMethod.PATCH]
      );

      expect(result).toBe(true);
    });
  });
});
