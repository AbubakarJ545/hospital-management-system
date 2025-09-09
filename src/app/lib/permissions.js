export const hasPermission = (user, permission) => {
  if (!user) return false;
  if (user.role === "admin") return true; // admin has all rights
  const permissions = Array.isArray(user.permissions) ? user.permissions : [];
  return permissions.includes(permission);
};
