/**
 * Auth module public API
 *
 * Re-exports authentication utilities and types for use throughout the application.
 */

export { authConfig } from "./config";
export {
  type Role,
  type Permission,
  type SessionWithRoles,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  getPermissions,
  isAuthenticated,
  isAdmin,
} from "./rbac";
export { azureAdProvider } from "./providers/azure-ad";
export { gcKeyProvider } from "./providers/gckey";
