import { requireAuth } from "./jwt";
import { rolePermissions } from "./roles";

export function ensureAuthenticated(req) {
  const user = requireAuth(req);
  if (!user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  return { ok: true, user };
}

export function ensureRole(req, allowedRoles = []) {
  const auth = ensureAuthenticated(req);
  if (!auth.ok) return auth;
  const { user } = auth;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { ok: false, status: 403, message: "Forbidden" };
  }
  return { ok: true, user };
}

export function ensurePermission(req, permission) {
  const auth = ensureAuthenticated(req);
  if (!auth.ok) return auth;
  const { user } = auth;
  if (user.role === "admin") return { ok: true, user };
  const fromRole = rolePermissions[user.role] || [];
  const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
  const allowed = fromRole.includes(permission) || userPermissions.includes(permission);
  if (!allowed) {
    return { ok: false, status: 403, message: "Forbidden" };
  }
  return { ok: true, user };
}


