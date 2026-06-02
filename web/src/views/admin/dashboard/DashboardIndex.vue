<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/hooks/useAppI18n';
import Card from 'primevue/card';

const { t, labels: dashboard, menu } = useAppI18n('dashboard');

// Basic RBAC Stats
const stats = computed(() => [
  { title: menu.users, value: '12', icon: 'pi pi-users', change: t('dashboard.thisMonth', { change: '+2' }), color: 'var(--p-blue-500)' },
  { title: menu.roles, value: '4', icon: 'pi pi-shield', change: t('dashboard.noChange'), color: 'var(--p-orange-500)' },
]);

</script>

<template>
  <div class="dashboard-container">
    <h2 class="section-title">{{ dashboard.title }}</h2>
    
    <div class="stats-grid">
      <Card v-for="stat in stats" :key="stat.title" class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-info">
              <span class="stat-title">{{ stat.title }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
            <div class="stat-icon-wrapper" :style="{ color: stat.color }">
              <i :class="stat.icon" class="stat-icon"></i>
            </div>
          </div>
          <div class="stat-footer">
            <span class="stat-change">{{ stat.change }}</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-primary-color);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: var(--p-border-radius);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--p-text-color-secondary);
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
}

.stat-icon-wrapper {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--p-surface-100);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-footer {
  margin-top: 1rem;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--p-text-color-secondary);
}
</style>
