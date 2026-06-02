<script setup lang="ts">
import Select from "primevue/select";

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  modelValue?: string | number | null;
  options: Option[];
  placeholder?: string;
  class?: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

function handleUpdate(val: any) {
  emit("update:modelValue", val);
  emit("change", val);
}
</script>

<template>
  <Select
    :model-value="modelValue ?? undefined"
    :options="options"
    option-label="label"
    option-value="value"
    :placeholder="placeholder"
    show-clear
    :class="props.class"
    class="w-full"
    @update:model-value="handleUpdate"
  />
</template>
