<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Toast from "primevue/toast";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { layout, common } = useAppI18n();

const isCollapsed = ref(false);
const menu = ref();

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

interface NavItem {
  titleKey: string;
  icon: string;
  url: string;
  permission?: string | string[];
}

const navItems: NavItem[] = [
  { titleKey: "menu.dashboard", url: "/dashboard", icon: "pi pi-home" },
  { titleKey: "menu.allUsers", url: "/admin/users", icon: "pi pi-users", permission: "user:view" },
  { titleKey: "layout.settingsDomain", url: "/admin/settings", icon: "pi pi-cog" },
];

const filteredNavItems = computed(() => {
  const userPermissions = authStore.user?.permissions || [];
  const roleName = authStore.user?.role?.name?.toLowerCase() || "";
  const isSuperAdmin = roleName === "superadmin";

  const checkPerm = (p?: string | string[]) => {
    if (isSuperAdmin || !p) return true;
    if (Array.isArray(p)) return p.some((perm) => userPermissions.includes(perm));
    return userPermissions.includes(p);
  };

  return navItems.filter((item) => checkPerm(item.permission));
});

const userInitials = computed(() => {
  const username = authStore.user?.username || authStore.user?.email || "U";
  return username.slice(0, 2).toUpperCase();
});

const formattedUsername = computed(() => {
  const name = authStore.user?.username || "Guest";
  return name.charAt(0).toUpperCase() + name.slice(1);
});

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}

const userMenuOptions = computed(() => [
  {
    label: formattedUsername.value,
    items: [
      {
        label: layout.settingsDomain,
        icon: 'pi pi-cog',
        command: () => router.push('/admin/settings')
      },
      {
        label: common.logout,
        icon: 'pi pi-sign-out',
        command: handleLogout
      }
    ]
  }
]);

const toggleUserMenu = (event: Event) => {
  menu.value.toggle(event);
};

onMounted(() => {
  authStore.fetchUser();
});
</script>

<template>
  <div class="layout-wrapper">
    <aside class="layout-sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
        <i class="pi pi-box logo-icon"></i>
        <span v-if="!isCollapsed" class="logo-text">Stock POS</span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in filteredNavItems" :key="item.titleKey">
            <RouterLink :to="item.url" class="nav-item" :class="{ active: route.path.startsWith(item.url) }">
              <i :class="item.icon" class="nav-icon"></i>
              <span v-if="!isCollapsed" class="nav-text">{{ $t(item.titleKey) }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="layout-main">
      <header class="layout-topbar">
        <div class="topbar-left">
          <Button icon="pi pi-bars" text rounded @click="toggleSidebar" class="menu-button" />
          <h2 class="page-title">{{ route.meta.title ? $t(route.meta.title as string) : route.name }}</h2>
        </div>
        <div class="topbar-right">
          <div class="user-profile" @click="toggleUserMenu" aria-haspopup="true" aria-controls="overlay_menu">
            <Avatar :label="!authStore.user?.photo ? userInitials : undefined" :image="authStore.user?.photo" shape="circle" class="user-avatar" />
            <span class="username">{{ formattedUsername }}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <Menu ref="menu" id="overlay_menu" :model="userMenuOptions" :popup="true" />
        </div>
      </header>

      <main class="layout-content">
        <RouterView />
      </main>
    </div>
    <Toast />
  </div>
</template>

<style>
/* Basic Reset & Font Setup */
body, html {
  margin: 0;
  padding: 0;
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
  background-color: var(--p-surface-50);
  color: var(--p-text-color);
}

.layout-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-sidebar {
  width: 250px;
  background-color: var(--p-surface-0);
  border-right: 1px solid var(--p-surface-200);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.layout-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 1.25rem;
  border-bottom: 1px solid var(--p-surface-200);
  color: var(--p-primary-color);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.5rem;
}

.sidebar-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--p-text-color);
  text-decoration: none;
  border-radius: var(--p-border-radius);
  margin-bottom: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: var(--p-surface-100);
}

.nav-item.active {
  background-color: var(--p-primary-50);
  color: var(--p-primary-color);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  margin-right: 1rem;
}

.layout-sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.layout-sidebar.collapsed .nav-text {
  display: none;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-topbar {
  height: 60px;
  background-color: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--p-border-radius);
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--p-surface-100);
}

.user-avatar {
  background-color: var(--p-primary-100);
  color: var(--p-primary-color);
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>
