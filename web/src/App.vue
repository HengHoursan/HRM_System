<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import Toast from "primevue/toast";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initSync();
});
</script>

<template>
  <Toast position="top-right" />
  <RouterView />
</template>
