<script setup lang="ts">
import { useCurrencyStore } from "@/stores/currency";
import Select from "primevue/select";

const currencyStore = useCurrencyStore();

function formatRate(rate: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(rate);
}
</script>

<template>
  <Select
    v-if="currencyStore.availableCurrencies.length > 0"
    :model-value="currencyStore.activeCurrency"
    :options="currencyStore.availableCurrencies"
    option-label="code"
    @update:model-value="(val) => currencyStore.setCurrency(val)"
    class="w-32"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center gap-2">
        <i class="pi pi-money-bill" />
        <div>{{ slotProps.value.symbol }} {{ slotProps.value.code }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex items-center gap-2">
        <div class="font-bold">{{ slotProps.option.symbol }}</div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold">{{ slotProps.option.code }}</span>
          <span v-if="slotProps.option.exchangeRate !== 1" class="text-xs text-surface-500">
            ×{{ formatRate(slotProps.option.exchangeRate) }}
          </span>
        </div>
      </div>
    </template>
  </Select>
</template>
