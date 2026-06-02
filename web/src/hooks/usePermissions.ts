import { useAuthStore } from "@/stores/auth";

/**
 * Hook for checking user permissions
 */
export function usePermissions() {
  const authStore = useAuthStore();

  /**
   * Check if user has a specific permission or any of multiple permissions
   * @param permission - Single permission string or array of strings
   * @returns boolean
   */
  const hasPermission = (permission: string | string[]): boolean => {
    // If no permission is required, allow
    if (!permission) return true;

    // Get user's permissions (fallback to empty array)
    const userPermissions = authStore.user?.permissions || [];

    // Allow everything for Super Admin (optional safety net)
    const roleName = authStore.user?.role?.name?.toLowerCase() || "";
    if (roleName === "superadmin") return true;

    if (Array.isArray(permission)) {
      // Check if user has ANY of the required permissions
      return permission.some((p) => userPermissions.includes(p));
    }

    // Check single permission
    return userPermissions.includes(permission);
  };

  return {
    hasPermission,
    user: authStore.user,
    role: authStore.user?.role,
  };
}
