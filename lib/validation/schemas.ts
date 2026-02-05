import { z } from "zod/v4";

/**
 * Common validation schemas for GC applications
 */

// Email validation with Canadian government domain support
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters");

// Canadian postal code validation
export const postalCodeSchema = z
  .string()
  .regex(
    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    "Please enter a valid Canadian postal code (e.g., K1A 0B1)"
  )
  .transform((val) => val.toUpperCase().replace(/\s/g, " "));

// Canadian phone number validation
export const phoneSchema = z
  .string()
  .regex(
    /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
    "Please enter a valid phone number"
  );

// SIN (Social Insurance Number) validation
// Note: Only validate format, actual verification requires CRA
export const sinSchema = z
  .string()
  .regex(/^\d{3}[-\s]?\d{3}[-\s]?\d{3}$/, "Please enter a valid SIN format")
  .transform((val) => val.replace(/[-\s]/g, ""));

// Security classification enum
export const securityClassificationSchema = z.enum([
  "UNCLASSIFIED",
  "PROTECTED_A",
  "PROTECTED_B",
]);

// User role enum
export const userRoleSchema = z.enum([
  "ADMIN",
  "MANAGER",
  "USER",
  "CITIZEN",
  "GUEST",
]);

// Common form schemas
export const loginSchema = z.object({
  email: emailSchema,
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: emailSchema,
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1).max(500),
  filters: z.record(z.string(), z.string()).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Export types
export type Email = z.infer<typeof emailSchema>;
export type PostalCode = z.infer<typeof postalCodeSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type SIN = z.infer<typeof sinSchema>;
export type SecurityClassification = z.infer<typeof securityClassificationSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
