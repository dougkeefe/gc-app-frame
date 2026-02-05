import type { Session } from "next-auth";

/**
 * Application roles following GC role naming conventions
 */
export type Role = "admin" | "manager" | "user" | "citizen" | "guest";

/**
 * Permission definitions for the application
 */
export type Permission =
  | "read:own"
  | "read:all"
  | "write:own"
  | "write:all"
  | "delete:own"
  | "delete:all"
  | "admin:users"
  | "admin:audit"
  | "admin:system";

/**
 * Role to permissions mapping
 */
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "read:own",
    "read:all",
    "write:own",
    "write:all",
    "delete:own",
    "delete:all",
    "admin:users",
    "admin:audit",
    "admin:system",
  ],
  manager: [
    "read:own",
    "read:all",
    "write:own",
    "write:all",
    "delete:own",
    "admin:audit",
  ],
  user: ["read:own", "read:all", "write:own", "delete:own"],
  citizen: ["read:own", "write:own"],
  guest: ["read:own"],
};

/**
 * Extended session type with roles
 */
export interface SessionWithRoles extends Session {
  user: Session["user"] & {
    roles?: Role[];
  };
}

/**
 * Check if a user has a specific role
 */
export function hasRole(session: SessionWithRoles | null, role: Role): boolean {
  if (!session?.user?.roles) {
    return false;
  }
  return session.user.roles.includes(role);
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(
  session: SessionWithRoles | null,
  roles: Role[]
): boolean {
  if (!session?.user?.roles) {
    return false;
  }
  return roles.some((role) => session.user.roles?.includes(role));
}

/**
 * Check if a user has all of the specified roles
 */
export function hasAllRoles(
  session: SessionWithRoles | null,
  roles: Role[]
): boolean {
  if (!session?.user?.roles) {
    return false;
  }
  return roles.every((role) => session.user.roles?.includes(role));
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  session: SessionWithRoles | null,
  permission: Permission
): boolean {
  if (!session?.user?.roles) {
    return false;
  }

  return session.user.roles.some((role) => {
    const permissions = rolePermissions[role];
    return permissions?.includes(permission);
  });
}

/**
 * Get all permissions for a user based on their roles
 */
export function getPermissions(
  session: SessionWithRoles | null
): Permission[] {
  if (!session?.user?.roles) {
    return [];
  }

  const permissions = new Set<Permission>();
  for (const role of session.user.roles) {
    const rolePerms = rolePermissions[role];
    if (rolePerms) {
      rolePerms.forEach((perm) => permissions.add(perm));
    }
  }
  return Array.from(permissions);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: SessionWithRoles | null): boolean {
  return !!session?.user;
}

/**
 * Check if user has admin role
 */
export function isAdmin(session: SessionWithRoles | null): boolean {
  return hasRole(session, "admin");
}
