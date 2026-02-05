/**
 * Database module public API
 *
 * Re-exports Prisma client and extensions for use throughout the application.
 */

export { prisma, prismaBase } from "./client";
export {
  softDeleteExtension,
  includeDeleted,
  onlyDeleted,
} from "./extensions/softDelete";
export { complianceExtension, setComplianceContext, clearComplianceContext, getComplianceContext } from "./extensions/compliance";
export { auditExtension, setAuditContext, clearAuditContext, getAuditContext } from "./extensions/audit";
