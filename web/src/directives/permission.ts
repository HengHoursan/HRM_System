import type { Directive } from "vue";
import { useAuthStore } from "@/stores/auth";

/**
 * v-permission directive
 * Hides elements if the user doesn't have the required permission
 */
export const permission: Directive = {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  updated(el, binding) {
    checkPermission(el, binding);
  },
};

function checkPermission(el: HTMLElement, binding: any) {
  const { value } = binding;
  const authStore = useAuthStore();

  // If no value provided, do nothing
  if (!value) return;

  // If user not loaded yet, hide by default to prevent flicker/leaks
  if (!authStore.user) {
    el.style.display = "none";
    return;
  }

  const userPermissions = authStore.user?.permissions || [];
  const roleName = authStore.user?.role?.name?.toLowerCase() || "";
  const isSuperAdmin = roleName === "superadmin";

  // Skip check if Super Admin
  if (isSuperAdmin) {
    el.style.display = "";
    return;
  }

  let hasPermission = false;
  if (Array.isArray(value)) {
    hasPermission = value.some((p) => userPermissions.includes(p));
  } else {
    hasPermission = userPermissions.includes(value);
  }

  if (hasPermission) {
    el.style.display = "";
  } else {
    el.style.display = "none";
  }
}
