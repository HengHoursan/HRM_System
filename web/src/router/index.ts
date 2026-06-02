import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  // Auth Routes (Standalone, no sidebar)
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/admin/auth/Login.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/admin/auth/Register.vue"),
    meta: { requiresGuest: true },
  },

  // Redirect root to dashboard
  {
    path: "/",
    redirect: "/dashboard",
  },

  // Admin Routes (with AdminLayout sidebar)
  {
    path: "/",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      // Dashboard
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/admin/dashboard/DashboardIndex.vue"),
        meta: { title: "menu.dashboard" },
      },

      // User CRUD
      {
        path: "admin/users",
        name: "Users",
        component: () => import("../views/admin/user/UserList.vue"),
        meta: { title: "menu.allUsers" },
      },
      {
        path: "admin/users/create",
        name: "UserCreate",
        component: () => import("../views/admin/user/UserCreate.vue"),
        meta: { title: "menu.addUser" },
      },
      {
        path: "admin/users/:id/edit",
        name: "UserEdit",
        component: () => import("../views/admin/user/UserEdit.vue"),
        meta: { title: "crud.editBtn" },
      },

      // Settings
      {
        path: "admin/settings",
        component: () => import("../views/admin/setting/SettingIndex.vue"),
        meta: { title: "layout.settingsDomain" },
        children: [
          {
            path: "",
            name: "SettingsRoot",
            component: () => import("../views/admin/setting/SettingCards.vue")
          },
          {
            path: "profile",
            name: "SettingProfile",
            component: () => import("../views/admin/setting/ProfileSetting.vue"),
            meta: { title: "layout.profile" },
          },
          {
            path: "security",
            name: "SettingSecurity",
            component: () => import("../views/admin/setting/SecuritySetting.vue"),
            meta: { title: "layout.security" },
          },
          {
            path: "permissions",
            name: "SettingPermissions",
            component: () => import("../views/admin/setting/RolePermissionSetting.vue"),
            meta: { title: "Role Permissions" },
          }
        ]
      },
    ],
  },

  // Catch-all fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Route requires auth but user is not logged in → redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: "Login" };
  }

  // Force password change guard
  if (isAuthenticated && authStore.user?.must_change_password) {
    if (to.name !== "SettingSecurity") {
      return { name: "SettingSecurity", query: { alert: 'must_change_password' } };
    }
  }

  // Route is for guests only but user is already logged in → redirect to dashboard
  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: "Dashboard" };
  }
});

export default router;
