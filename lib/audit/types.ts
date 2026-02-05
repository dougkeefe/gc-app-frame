/**
 * Audit action types
 * These mirror the AuditAction enum in the Prisma schema
 */
export type AuditAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "ACCESS_DENIED"
  | "EXPORT"
  | "IMPORT";

/**
 * Security classification levels per Government of Canada standards
 * These mirror the SecurityClassification enum in the Prisma schema
 */
export type SecurityClassification =
  | "UNCLASSIFIED"
  | "PROTECTED_A"
  | "PROTECTED_B";

/**
 * Audit entry structure for logging
 */
export interface AuditEntry {
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  requestId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  securityClassification?: SecurityClassification;
}

/**
 * Context for audit logging
 */
export interface AuditContext {
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  requestId?: string;
}

/**
 * Options for the audit logger
 */
export interface AuditLoggerOptions {
  /** Include PII in audit logs (default: false for privacy) */
  includePii?: boolean;
  /** Security classification for the audit entry */
  securityClassification?: SecurityClassification;
  /** Additional metadata to include */
  metadata?: Record<string, unknown>;
}
