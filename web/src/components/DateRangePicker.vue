<script setup lang="ts">
import { ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'

interface Props {
  modelValue?: { start: string | Date | null; end: string | Date | null } | null
  placeholder?: string
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dates = ref<Date[]>([])

watch(() => props.modelValue, (newVal) => {
  if (!newVal || (!newVal.start && !newVal.end)) {
    dates.value = []
  } else {
    const arr: Date[] = []
    if (newVal.start) arr.push(new Date(newVal.start))
    if (newVal.end) arr.push(new Date(newVal.end))
    dates.value = arr
  }
}, { immediate: true })

function onUpdate(val: Date | Date[] | (Date | null)[] | null | undefined) {
  if (Array.isArray(val)) {
    dates.value = val.filter((d) => d != null) as Date[]
    if (dates.value.length === 0) {
      emit('update:modelValue', null)
    } else {
      emit('update:modelValue', {
        start: dates.value[0] ? dates.value[0].toISOString() : null,
        end: dates.value[1] ? dates.value[1].toISOString() : null,
      })
    }
  } else {
    dates.value = []
    emit('update:modelValue', null)
  }
}
</script>

<template>
  <DatePicker
    :model-value="dates"
    @update:model-value="onUpdate"
    selectionMode="range"
    :placeholder="placeholder"
    showIcon
    dateFormat="dd/mm/yy"
    :class="props.class"
    class="w-full"
  />
</template>
