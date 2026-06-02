<script setup lang="ts">
import { computed } from "vue";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import Message from "primevue/message";

const { layout } = useAppI18n();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const showBackButton = computed(() => route.path !== "/admin/settings");
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button
          v-if="showBackButton && !authStore.user?.must_change_password"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          rounded
          @click="router.push('/admin/settings')"
        />
        <div class="p-2 bg-primary/10 rounded-xl">
          <i class="pi pi-cog text-primary text-2xl" />
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight">{{ layout.settingsDomain }}</h2>
          <p class="text-surface-500">{{ layout.settingsDescription || "Manage your account settings and preferences." }}</p>
        </div>
      </div>
    </div>

    <!-- Security Warning Banner -->
    <Message
      v-if="authStore.user?.must_change_password"
      severity="error"
      :closable="false"
      class="w-full"
    >
      <div>
        <p class="font-bold text-lg">Action Required: Update Your Password</p>
        <p class="mt-1 opacity-90">
          Your password has been reset by an administrator. For your security, you must create a new private password before you can access the rest of the application.
        </p>
      </div>
    </Message>

    <!-- Nested route view -->
    <RouterView class="animate-in fade-in duration-500" />
  </div>
</template>
