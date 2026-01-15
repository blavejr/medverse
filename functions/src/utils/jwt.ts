import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtSecret";
const JWT_EXPIRES_IN = "24h";

export interface JwtPayload {
  sessionId: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
