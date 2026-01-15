import {z} from "zod";
import { SessionStatus } from "../types/session";

// Status values enum
export const sessionStatusSchema = z.enum(Object.values(SessionStatus), {
  message: "Invalid status value",
});

// Regex to validate the region format e.g. "us-east"
export const regionSchema = z.string({message: "Invalid region format"}).min(1, "Invalid region format").regex(/^[a-z]{2}-[a-z]+$/, "Invalid region format");

// Validation schemas
export const createSessionSchema = z.object({
  region: regionSchema,
});

export const updateSessionStatusSchema = z.object({
  status: sessionStatusSchema,
});

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;

export const listSessionsSchema = z.object({
  status: sessionStatusSchema.optional(),
  region: regionSchema.optional(),
  limit: z.string().optional().transform((val) => {
    if (!val) return DEFAULT_LIMIT;
    const num = parseInt(val, 10);
    return num > MAX_LIMIT ? MAX_LIMIT : num < 1 ? DEFAULT_LIMIT : num;
  }),
  page: z.string().optional().transform((val) => {
    if (!val) return DEFAULT_PAGE;
    const num = parseInt(val, 10);
    return num < 1 ? DEFAULT_PAGE : num;
  }),
});
