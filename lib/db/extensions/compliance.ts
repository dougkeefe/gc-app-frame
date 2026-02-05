/**
 * Compliance extension for Prisma
 *
 * Automatically populates compliance fields:
 * - createdBy / updatedBy - User attribution
 * - createdAt / updatedAt - Temporal tracking (handled by Prisma @default and @updatedAt)
 *
 * This ensures all records have proper attribution for GC compliance.
 *
 * Note: This extension requires the Prisma client to be generated.
 * Run `npx prisma generate` after setting up your database.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaType = any;

let Prisma: PrismaType;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Prisma = require("@prisma/client").Prisma;
} catch {
  // Prisma not available yet
}

type ComplianceContext = {
  userId?: string;
};

// Context for the current request
let complianceContext: ComplianceContext = {};

/**
 * Set the compliance context for the current request
 */
export function setComplianceContext(context: ComplianceContext) {
  complianceContext = context;
}

/**
 * Clear the compliance context
 */
export function clearComplianceContext() {
  complianceContext = {};
}

/**
 * Get the current compliance context
 */
export function getComplianceContext(): ComplianceContext {
  return complianceContext;
}

type QueryContext = {
  model: string;
  args: {
    where?: Record<string, unknown>;
    data?: Record<string, unknown>;
    create?: Record<string, unknown>;
    update?: Record<string, unknown>;
  };
  query: (args: unknown) => Promise<unknown>;
};

type CreateManyQueryContext = {
  model: string;
  args: {
    data?: Record<string, unknown>[];
  };
  query: (args: unknown) => Promise<unknown>;
};

export const complianceExtension = Prisma?.defineExtension({
  name: "compliance",
  query: {
    $allModels: {
      async create({ model, args, query }: QueryContext) {
        const ctx = getComplianceContext();

        // Check if model has createdBy field
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasCreatedBy = modelFields?.some((f: { name: string }) => f.name === "createdBy");
        const hasUpdatedBy = modelFields?.some((f: { name: string }) => f.name === "updatedBy");

        if (ctx.userId && args.data) {
          if (hasCreatedBy && !args.data.createdBy) {
            args.data.createdBy = ctx.userId;
          }
          if (hasUpdatedBy && !args.data.updatedBy) {
            args.data.updatedBy = ctx.userId;
          }
        }

        return query(args);
      },

      async createMany({ model, args, query }: CreateManyQueryContext) {
        const ctx = getComplianceContext();

        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasCreatedBy = modelFields?.some((f: { name: string }) => f.name === "createdBy");
        const hasUpdatedBy = modelFields?.some((f: { name: string }) => f.name === "updatedBy");

        if (ctx.userId && Array.isArray(args.data)) {
          args.data = args.data.map((record: Record<string, unknown>) => ({
            ...record,
            ...(hasCreatedBy && !record.createdBy
              ? { createdBy: ctx.userId }
              : {}),
            ...(hasUpdatedBy && !record.updatedBy
              ? { updatedBy: ctx.userId }
              : {}),
          }));
        }

        return query(args);
      },

      async update({ model, args, query }: QueryContext) {
        const ctx = getComplianceContext();

        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasUpdatedBy = modelFields?.some((f: { name: string }) => f.name === "updatedBy");

        if (ctx.userId && hasUpdatedBy && args.data && !args.data.updatedBy) {
          args.data.updatedBy = ctx.userId;
        }

        return query(args);
      },

      async updateMany({ model, args, query }: QueryContext) {
        const ctx = getComplianceContext();

        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasUpdatedBy = modelFields?.some((f: { name: string }) => f.name === "updatedBy");

        if (ctx.userId && hasUpdatedBy && args.data) {
          args.data = {
            ...args.data,
            updatedBy: ctx.userId,
          };
        }

        return query(args);
      },

      async upsert({ model, args, query }: QueryContext) {
        const ctx = getComplianceContext();

        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasCreatedBy = modelFields?.some((f: { name: string }) => f.name === "createdBy");
        const hasUpdatedBy = modelFields?.some((f: { name: string }) => f.name === "updatedBy");

        if (ctx.userId) {
          if (hasCreatedBy && args.create && !args.create.createdBy) {
            args.create.createdBy = ctx.userId;
          }
          if (hasUpdatedBy) {
            if (args.create && !args.create.updatedBy) {
              args.create.updatedBy = ctx.userId;
            }
            if (args.update && !args.update.updatedBy) {
              args.update.updatedBy = ctx.userId;
            }
          }
        }

        return query(args);
      },
    },
  },
});
