import {ZodType} from "zod";

// Let typescript infer the type of the data based on the schema
export const validate = <T>(schema: ZodType<T>, data: Record<string, any>): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
};
