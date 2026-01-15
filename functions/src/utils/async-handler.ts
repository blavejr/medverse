import type {Request, Response} from "express";
import {sendError} from "./http";
import {HttpStatus} from "../types/enums";

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error: any) {
      const message = error.message || "";
      
      if (message.includes("not found")) {
        return sendError(res, message, HttpStatus.NOT_FOUND);
      }
      
      if (message.includes("Invalid") || message.includes("Required")) {
        return sendError(res, message, HttpStatus.BAD_REQUEST);
      }
      
      console.error("Unhandled error:", error);
      sendError(res, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
};
