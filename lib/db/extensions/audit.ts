/**
 * Audit logging extension for Prisma
 *
 * Automatically logs all CREATE, UPDATE, and DELETE operations
 * to the AuditLog table for compliance with GC audit requirements.
 *
 * Note: This extension logs to the database. For high-volume applications,
 * consider using a separate audit service or message queue.
 *
 * Note: This extension requires the Prisma client to be generated.
 * Run `npx prisma generate` after setting up your database.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

let Prisma: PrismaType;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Prisma = require("@prisma/client").Prisma;
} catch {
  // Prisma not available yet
}

type AuditContext = {
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  requestId?: string;
};

// AsyncLocalStorage to pass context through the request
let auditContext: AuditContext = {};

/**
 * Set the audit context for the current request
 * Call this at the start of each request with user information
 */
export function setAuditContext(context: AuditContext) {
  auditContext = context;
}

/**
 * Clear the audit context
 * Call this at the end of each request
 */
export function clearAuditContext() {
  auditContext = {};
}

/**
 * Get the current audit context
 */
export function getAuditContext(): AuditContext {
  return auditContext;
}

// Models to skip auditing (e.g., the AuditLog itself)
const skipAuditModels = ["AuditLog", "VerificationToken"];

type QueryContext = {
  model: string;
  args: { where?: Record<string, unknown>; data?: Record<string, unknown> };
  query: (args: unknown) => Promise<unknown>;
};

export const auditExtension = Prisma?.defineExtension((client: PrismaClientType) => {
  return client.$extends({
    name: "audit",
    query: {
      $allModels: {
        async create({ model, args, query }: QueryContext) {
          const result = await query(args);

          // Skip audit for certain models
          if (!skipAuditModels.includes(model)) {
            const ctx = getAuditContext();
            try {
              await client.auditLog.create({
                data: {
                  action: "CREATE",
                  entityType: model,
                  entityId: (result as { id: string }).id,
                  userId: ctx.userId,
                  userAgent: ctx.userAgent,
                  ipAddress: ctx.ipAddress,
                  sessionId: ctx.sessionId,
                  requestId: ctx.requestId,
                  newValues: result as object,
                },
              });
            } catch (error) {
              // Log error but don't fail the operation
              console.error("Failed to create audit log:", error);
            }
          }

          return result;
        },

        async update({ model, args, query }: QueryContext) {
          // Skip audit for certain models
          if (skipAuditModels.includes(model)) {
            return query(args);
          }

          // Get old values before update
          let oldValues = null;
          try {
            const prismaModel = client[model.charAt(0).toLowerCase() + model.slice(1)];
            oldValues = await prismaModel?.findUnique({
              where: args.where,
            });
          } catch {
            // Ignore errors fetching old values
          }

          const result = await query(args);

          const ctx = getAuditContext();
          try {
            await client.auditLog.create({
              data: {
                action: "UPDATE",
                entityType: model,
                entityId: (result as { id: string }).id,
                userId: ctx.userId,
                userAgent: ctx.userAgent,
                ipAddress: ctx.ipAddress,
                sessionId: ctx.sessionId,
                requestId: ctx.requestId,
                oldValues: oldValues as object,
                newValues: result as object,
              },
            });
          } catch (error) {
            console.error("Failed to create audit log:", error);
          }

          return result;
        },

        async delete({ model, args, query }: QueryContext) {
          // Skip audit for certain models
          if (skipAuditModels.includes(model)) {
            return query(args);
          }

          // Get record before deletion
          let oldValues: { id?: string } | null = null;
          try {
            const prismaModel = client[model.charAt(0).toLowerCase() + model.slice(1)];
            oldValues = (await prismaModel?.findUnique({
              where: args.where,
            })) as { id?: string } | null;
          } catch {
            // Ignore errors
          }

          const result = await query(args);

          const ctx = getAuditContext();
          try {
            await client.auditLog.create({
              data: {
                action: "DELETE",
                entityType: model,
                entityId: oldValues?.id || "unknown",
                userId: ctx.userId,
                userAgent: ctx.userAgent,
                ipAddress: ctx.ipAddress,
                sessionId: ctx.sessionId,
                requestId: ctx.requestId,
                oldValues: oldValues as object,
              },
            });
          } catch (error) {
            console.error("Failed to create audit log:", error);
          }

          return result;
        },
      },
    },
  });
});
