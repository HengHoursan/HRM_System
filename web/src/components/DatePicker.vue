<script setup lang="ts">
import { ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'

interface Props {
  modelValue?: string | Date | null
  placeholder?: string
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dateValue = ref<Date | null>(null)

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    dateValue.value = null
  } else {
    dateValue.value = new Date(newVal)
  }
}, { immediate: true })

function onUpdate(val: Date | Date[] | (Date | null)[] | null | undefined) {
  if (val instanceof Date) {
    dateValue.value = val
    emit('update:modelValue', val.toISOString())
  } else {
    dateValue.value = null
    emit('update:modelValue', null)
  }
}
</script>

<template>
  <DatePicker
    :model-value="dateValue"
    @update:model-value="onUpdate"
    :placeholder="placeholder"
    showIcon
    dateFormat="dd/mm/yy"
    :class="props.class"
    class="w-full"
  />
</template>
