import type {Request, Response} from "express";
import {extractToken, verifyToken, JwtPayload} from "../utils/jwt";
import {sendError} from "../utils/http";
import {HttpStatus} from "../types/enums";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const jwtAuth = (req: Request, res: Response): JwtPayload | null => {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    sendError(res, "Missing or invalid authorization header", HttpStatus.UNAUTHORIZED);
    return null;
  }

  try {
    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    sendError(res, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
    return null;
  }
};
