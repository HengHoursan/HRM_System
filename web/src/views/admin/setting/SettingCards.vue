<script setup lang="ts">
import { computed } from "vue";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";

const { layout } = useAppI18n();
const router = useRouter();
const authStore = useAuthStore();

const isSuperAdmin = computed(() => {
  const roleName = authStore.user?.role?.name?.toLowerCase() || "";
  return roleName.includes("admin") || roleName === "super admin";
});

const settingCards = computed(() => {
  const cards = [
    {
      id: "profile",
      path: "/admin/settings/profile",
      title: layout.profile,
      description: layout.profileDesc,
      icon: "pi-user",
      permission: null as string | null,
    },
  ];
  if (isSuperAdmin.value) {
    cards.push({
      id: "permissions",
      path: "/admin/settings/permissions",
      title: layout.rolePermissions,
      description: layout.rolePermissionsDesc,
      icon: "pi-shield",
      permission: "role:all",
    });
  }
  return cards;
});

const navigateTo = (path: string, id: string) => {
  if (authStore.user?.must_change_password && id !== "profile") return;
  router.push(path);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      v-for="card in settingCards"
      :key="card.id"
      v-permission="card.permission"
      class="cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary/50 overflow-hidden group"
      :class="{
        'opacity-50 pointer-events-none grayscale': authStore.user?.must_change_password && card.id !== 'profile',
        'border-red-400 shadow-lg shadow-red-200': authStore.user?.must_change_password && card.id === 'profile',
      }"
      @click="navigateTo(card.path, card.id)"
    >
      <template #header>
        <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </template>
      <template #content>
        <div class="flex items-start justify-between space-y-0 mb-4">
          <div class="p-3 bg-primary/10 rounded-xl text-primary">
            <i :class="['pi', card.icon, 'text-2xl']" />
          </div>
          <i class="pi pi-arrow-right text-surface-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        <h3 class="text-xl font-bold mb-1">{{ card.title }}</h3>
        <p class="text-sm text-surface-500">{{ card.description }}</p>
      </template>
    </Card>
  </div>
</template>
