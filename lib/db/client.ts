/**
 * Extended Prisma client with GC compliance features:
 * - Soft delete: Records are never physically deleted
 * - Compliance: Auto-populates createdBy/updatedBy fields
 * - Audit logging: All mutations are logged (configured separately)
 *
 * Note: The audit extension uses the base client to avoid circular logging,
 * so it's applied separately in the audit logger service.
 *
 * Note: This module requires Prisma to be initialized and the client generated.
 * Run the following commands to set up:
 * 1. Configure DATABASE_URL in .env
 * 2. Run `npx prisma generate` to generate the client
 * 3. Run `npx prisma migrate dev` to create/update database schema
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtensionType = any;

let PrismaClientClass: (new (options?: unknown) => PrismaClientType) | null = null;
let softDeleteExt: ExtensionType | null = null;
let complianceExt: ExtensionType | null = null;

try {
  // Dynamic import to avoid errors when Prisma client isn't generated
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClientClass = require("@prisma/client").PrismaClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  softDeleteExt = require("./extensions/softDelete").softDeleteExtension;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  complianceExt = require("./extensions/compliance").complianceExtension;
} catch {
  // Prisma client not generated yet - create stub
  console.warn(
    "Prisma client not available. Run `npx prisma generate` to generate the client."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function createPrismaClient(): PrismaClientType | null {
  if (!PrismaClientClass) {
    return null;
  }

  const baseClient = new PrismaClientClass({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Apply extensions in order if available
  let client = baseClient;
  if (softDeleteExt) {
    client = client.$extends(softDeleteExt);
  }
  if (complianceExt) {
    client = client.$extends(complianceExt);
  }

  return client;
}

/**
 * Prisma client singleton with compliance extensions
 *
 * In development, we use a global variable to preserve the client
 * across hot reloads. In production, we create a new client.
 */
export const prisma: PrismaClientType | null = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

/**
 * Base Prisma client without extensions
 * Use this for operations that need to bypass soft delete or compliance
 * (e.g., hard delete for GDPR right to erasure)
 */
export const prismaBase: PrismaClientType | null = PrismaClientClass ? new PrismaClientClass() : null;
