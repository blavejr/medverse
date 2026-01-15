import type {Request, Response} from "express";
import {HttpMethod, HttpStatus} from "../types/enums";

export const sendSuccess = (res: Response, data: Record<string, any>, status: HttpStatus = HttpStatus.OK) => {
  res.status(status).json({success: true, ...data});
};

export const sendError = (res: Response, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) => {
  res.status(status).json({success: false, message});
};

export const checkMethod = (
  req: Request,
  res: Response,
  allowedMethods: HttpMethod | HttpMethod[]
): boolean => {
  const methods = Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods];
  
  if (!methods.includes(req.method as HttpMethod)) {
    sendError(res, "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED);
    return false;
  }
  
  return true;
};
