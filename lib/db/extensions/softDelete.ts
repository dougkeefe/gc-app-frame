/**
 * Soft delete extension for Prisma
 *
 * Instead of physically deleting records, this extension:
 * 1. Overrides delete operations to set deletedAt timestamp
 * 2. Automatically filters out soft-deleted records from queries
 *
 * This ensures compliance with GC information management requirements
 * where records must be retained for specified periods.
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

type QueryContext = {
  model: string;
  args: { where?: Record<string, unknown>; data?: Record<string, unknown> };
  query: (args: unknown) => Promise<unknown>;
};

export const softDeleteExtension = Prisma?.defineExtension({
  name: "softDelete",
  query: {
    $allModels: {
      // Override delete to set deletedAt instead
      async delete({ model, args, query }: QueryContext) {
        // Check if model has deletedAt field
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          // Soft delete: update deletedAt instead of deleting
          const prismaModel = (Prisma as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)[
            model.charAt(0).toLowerCase() + model.slice(1)
          ];
          return prismaModel?.update({
            ...args,
            data: { deletedAt: new Date() },
          });
        }

        // Model doesn't support soft delete, proceed with hard delete
        return query(args);
      },

      // Override deleteMany to set deletedAt instead
      async deleteMany({ model, args, query }: QueryContext) {
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          const prismaModel = (Prisma as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)[
            model.charAt(0).toLowerCase() + model.slice(1)
          ];
          return prismaModel?.updateMany({
            ...args,
            data: { deletedAt: new Date() },
          });
        }

        return query(args);
      },

      // Filter out soft-deleted records from findMany
      async findMany({ model, args, query }: QueryContext) {
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          args.where = {
            ...args.where,
            deletedAt: null,
          };
        }

        return query(args);
      },

      // Filter out soft-deleted records from findFirst
      async findFirst({ model, args, query }: QueryContext) {
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          args.where = {
            ...args.where,
            deletedAt: null,
          };
        }

        return query(args);
      },

      // Filter out soft-deleted records from findUnique
      async findUnique({ model, args, query }: QueryContext) {
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          // findUnique doesn't support complex where, so we check after
          const result = await query(args);
          if (result && (result as { deletedAt?: Date }).deletedAt) {
            return null;
          }
          return result;
        }

        return query(args);
      },

      // Filter out soft-deleted records from count
      async count({ model, args, query }: QueryContext) {
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (m: { name: string }) => m.name === model
        )?.fields;
        const hasDeletedAt = modelFields?.some((f: { name: string }) => f.name === "deletedAt");

        if (hasDeletedAt) {
          args.where = {
            ...args.where,
            deletedAt: null,
          };
        }

        return query(args);
      },
    },
  },
});

/**
 * Extension method to include soft-deleted records in queries
 * Usage: prisma.user.findMany({ ...includeDeleted() })
 */
export function includeDeleted() {
  return {
    where: {
      OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
    },
  };
}

/**
 * Extension method to find only soft-deleted records
 * Usage: prisma.user.findMany({ ...onlyDeleted() })
 */
export function onlyDeleted() {
  return {
    where: {
      deletedAt: { not: null },
    },
  };
}
