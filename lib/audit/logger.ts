import type { AuditContext, AuditEntry, AuditLoggerOptions, SecurityClassification } from "./types";

// Prisma client is conditionally imported to allow the app to run without a database
let prismaBase: { auditLog: { create: (args: { data: Record<string, unknown> }) => Promise<unknown> } } | null = null;

async function getPrismaBase() {
  if (!prismaBase) {
    try {
      const { prismaBase: pb } = await import("@/lib/db/client");
      prismaBase = pb as typeof prismaBase;
    } catch {
      // Prisma not available, logging will be skipped
      console.warn("Prisma client not available. Audit logging disabled.");
    }
  }
  return prismaBase;
}

/**
 * Audit Logger for Government of Canada compliance
 *
 * Provides methods for logging various actions to the audit trail.
 * All audit logs are immutable and retained per GC retention requirements.
 *
 * Usage:
 * ```typescript
 * const logger = new AuditLogger({
 *   userId: session.user.id,
 *   ipAddress: request.ip,
 *   userAgent: request.headers['user-agent'],
 * });
 *
 * await logger.logCreate('User', user.id, user);
 * ```
 */
export class AuditLogger {
  private context: AuditContext;

  constructor(context: AuditContext = {}) {
    this.context = context;
  }

  /**
   * Update the audit context
   */
  setContext(context: Partial<AuditContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Anonymize IP address for privacy compliance
   * Removes the last octet for IPv4 or last 80 bits for IPv6
   */
  private anonymizeIp(ip?: string): string | undefined {
    if (!ip) return undefined;

    if (ip.includes(".")) {
      // IPv4: Remove last octet
      const parts = ip.split(".");
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
      }
    } else if (ip.includes(":")) {
      // IPv6: Remove last 5 groups
      const parts = ip.split(":");
      if (parts.length >= 4) {
        return `${parts.slice(0, 3).join(":")}::`;
      }
    }

    return ip;
  }

  /**
   * Strip PII from values if not explicitly allowed
   */
  private sanitizeValues(
    values: Record<string, unknown> | undefined,
    includePii: boolean
  ): Record<string, unknown> | undefined {
    if (!values) return undefined;
    if (includePii) return values;

    const piiFields = [
      "email",
      "name",
      "firstName",
      "lastName",
      "phone",
      "address",
      "sin",
      "dateOfBirth",
      "password",
      "passwordHash",
    ];

    const sanitized = { ...values };
    for (const field of piiFields) {
      if (field in sanitized) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }

  /**
   * Create an audit log entry
   */
  private async log(
    entry: Omit<AuditEntry, "userId" | "userAgent" | "ipAddress" | "sessionId" | "requestId">,
    options: AuditLoggerOptions = {}
  ): Promise<void> {
    const { includePii = false, securityClassification, metadata } = options;

    const db = await getPrismaBase();
    if (!db) {
      // Log to console as fallback
      console.log("[AUDIT]", JSON.stringify({
        ...entry,
        userId: this.context.userId,
        timestamp: new Date().toISOString(),
      }));
      return;
    }

    try {
      await db.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          userId: this.context.userId,
          userAgent: this.context.userAgent,
          ipAddress: this.anonymizeIp(this.context.ipAddress),
          sessionId: this.context.sessionId,
          requestId: this.context.requestId,
          oldValues: this.sanitizeValues(entry.oldValues, includePii),
          newValues: this.sanitizeValues(entry.newValues, includePii),
          metadata: { ...entry.metadata, ...metadata },
          securityClassification:
            securityClassification ?? entry.securityClassification ?? "UNCLASSIFIED",
        },
      });
    } catch (error) {
      // Log to console but don't fail the operation
      // In production, this should go to a monitoring service
      console.error("Failed to write audit log:", error);
    }
  }

  /**
   * Log a CREATE action
   */
  async logCreate(
    entityType: string,
    entityId: string,
    newValues?: Record<string, unknown>,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "CREATE",
        entityType,
        entityId,
        newValues,
      },
      options
    );
  }

  /**
   * Log a READ action (for sensitive data access)
   */
  async logRead(
    entityType: string,
    entityId: string,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "READ",
        entityType,
        entityId,
      },
      options
    );
  }

  /**
   * Log an UPDATE action
   */
  async logUpdate(
    entityType: string,
    entityId: string,
    oldValues?: Record<string, unknown>,
    newValues?: Record<string, unknown>,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "UPDATE",
        entityType,
        entityId,
        oldValues,
        newValues,
      },
      options
    );
  }

  /**
   * Log a DELETE action
   */
  async logDelete(
    entityType: string,
    entityId: string,
    oldValues?: Record<string, unknown>,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "DELETE",
        entityType,
        entityId,
        oldValues,
      },
      options
    );
  }

  /**
   * Log a LOGIN action
   */
  async logLogin(
    userId: string,
    metadata?: Record<string, unknown>,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "LOGIN",
        entityType: "Session",
        entityId: userId,
        metadata,
      },
      options
    );
  }

  /**
   * Log a LOGOUT action
   */
  async logLogout(
    userId: string,
    metadata?: Record<string, unknown>,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "LOGOUT",
        entityType: "Session",
        entityId: userId,
        metadata,
      },
      options
    );
  }

  /**
   * Log an ACCESS_DENIED action
   */
  async logAccessDenied(
    entityType: string,
    entityId: string,
    reason?: string,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "ACCESS_DENIED",
        entityType,
        entityId,
        metadata: { reason },
      },
      {
        ...options,
        securityClassification:
          options?.securityClassification ?? ("PROTECTED_A" as SecurityClassification),
      }
    );
  }

  /**
   * Log an EXPORT action (for data exports)
   */
  async logExport(
    entityType: string,
    entityIds: string[],
    format: string,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "EXPORT",
        entityType,
        entityId: entityIds.join(","),
        metadata: { format, count: entityIds.length },
      },
      options
    );
  }

  /**
   * Log an IMPORT action (for data imports)
   */
  async logImport(
    entityType: string,
    count: number,
    source: string,
    options?: AuditLoggerOptions
  ): Promise<void> {
    await this.log(
      {
        action: "IMPORT",
        entityType,
        entityId: "batch",
        metadata: { count, source },
      },
      options
    );
  }
}

/**
 * Create an audit logger with context from a request
 */
export function createAuditLogger(
  userId?: string,
  request?: Request
): AuditLogger {
  const context: AuditContext = {
    userId,
    userAgent: request?.headers.get("user-agent") ?? undefined,
    ipAddress:
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request?.headers.get("x-real-ip") ??
      undefined,
    requestId: request?.headers.get("x-request-id") ?? crypto.randomUUID(),
  };

  return new AuditLogger(context);
}
