import {asyncHandler} from "./async-handler";
import {HttpStatus} from "../types/enums";
import type {Request, Response} from "express";

describe("async-handler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should execute handler successfully", async () => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = asyncHandler(mockHandler);

    await wrappedHandler(mockRequest as Request, mockResponse as Response);

    expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should handle not found errors", async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error("Session not found"));
    const wrappedHandler = asyncHandler(mockHandler);

    await wrappedHandler(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Session not found",
    });
  });

  it("should handle validation errors", async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error("Invalid region format"));
    const wrappedHandler = asyncHandler(mockHandler);

    await wrappedHandler(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid region format",
    });
  });

  it("should handle unexpected errors", async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error("Database connection failed"));
    const wrappedHandler = asyncHandler(mockHandler);

    await wrappedHandler(mockRequest as Request, mockResponse as Response);

    expect(console.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});
