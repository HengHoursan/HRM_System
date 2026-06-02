<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import Button from "primevue/button";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    severity="secondary"
    text
    rounded
    size="small"
    @click="toggleDark()"
    title="Toggle Theme"
    class="w-9 h-9"
  />
</template>
