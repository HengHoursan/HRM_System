<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useAppI18n } from "@/hooks/useAppI18n";
const { layout, menu, crud, t } = useAppI18n();
import { roleService } from "@/services/role/role.service";
import { permissionService } from "@/services/permission/permission.service";
import type { Role, Permission, RolePermission } from "@/types";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";
import ProgressSpinner from "primevue/progressspinner";
import Tag from "primevue/tag";

const toast = useToast();
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const rolePermissions = ref<RolePermission[]>([]);
const selectedRoleId = ref<number | null>(null);

const isLoadingRoles = ref(false);
const isLoadingPermissions = ref(false);
const isSyncing = ref<Record<number, boolean>>({});
const filters = reactive({ search: "", module: "" });

const activeRolePermissions = computed(() => new Set(rolePermissions.value.map((rp) => rp.permissionId)));

const availableModules = computed(() => {
  const modules = new Set<string>();
  permissions.value.forEach((p) => modules.add(p.group || "Other"));
  return Array.from(modules).sort();
});

const moduleOptions = computed(() =>
  availableModules.value.map((mod) => ({ label: mod, value: mod }))
);

const filteredPermissions = computed(() =>
  permissions.value.filter((p) => {
    const searchMatch = !filters.search ||
      p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (p.displayName && p.displayName.toLowerCase().includes(filters.search.toLowerCase()));
    const groupName = p.group || "Other";
    const moduleMatch = !filters.module || groupName === filters.module;
    return searchMatch && moduleMatch;
  })
);

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {};
  filteredPermissions.value.forEach((p) => {
    const groupName = p.group || "Other";
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(p);
  });
  return groups;
});

async function fetchRoles() {
  isLoadingRoles.value = true;
  try {
    const res = await roleService.getAll();
    if (res.success && res.data) {
      roles.value = res.data;
      if (roles.value.length > 0 && !selectedRoleId.value) selectRole(roles.value[0].id);
    }
  } catch {
    toast.add({ severity: "error", summary: "Failed to load roles", life: 3000 });
  } finally {
    isLoadingRoles.value = false;
  }
}

async function fetchPermissions() {
  isLoadingPermissions.value = true;
  try {
    const res = await permissionService.getAll();
    if (res.success && res.data) permissions.value = res.data;
  } catch {
    toast.add({ severity: "error", summary: "Failed to load permissions", life: 3000 });
  } finally {
    isLoadingPermissions.value = false;
  }
}

async function fetchRolePermissions(roleId: number) {
  try {
    const res = await roleService.getRolePermissions(roleId);
    if (res.success && res.data) rolePermissions.value = res.data;
  } catch {
    toast.add({ severity: "error", summary: "Failed to load role permissions", life: 3000 });
  }
}

async function selectRole(roleId: number) {
  selectedRoleId.value = roleId;
  rolePermissions.value = [];
  await fetchRolePermissions(roleId);
}

async function togglePermission(permissionId: number, checked: boolean) {
  if (!selectedRoleId.value) return;
  const roleId = selectedRoleId.value;
  isSyncing.value[permissionId] = true;
  try {
    if (checked) {
      const res = await roleService.assignPermission(roleId, permissionId);
      if (res.success) {
        rolePermissions.value.push({
          roleId,
          permissionId,
          permission: permissions.value.find((p) => p.id === permissionId) as Permission,
        });
        toast.add({ severity: "success", summary: "Permission assigned", life: 2000 });
      } else throw new Error(res.message);
    } else {
      const res = await roleService.revokePermission(roleId, permissionId);
      if (res.success) {
        rolePermissions.value = rolePermissions.value.filter((rp) => rp.permissionId !== permissionId);
        toast.add({ severity: "success", summary: "Permission revoked", life: 2000 });
      } else throw new Error(res.message);
    }
  } catch (error: any) {
    toast.add({ severity: "error", summary: error.message || "Failed to update permission", life: 3000 });
  } finally {
    isSyncing.value[permissionId] = false;
  }
}

onMounted(() => {
  fetchPermissions();
  fetchRoles();
});
</script>

<template>
  <Toast />
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ layout.rolePermissions }}</h3>
        <p class="text-sm text-surface-500">{{ layout.rolePermissionsDesc }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Roles Sidebar -->
      <div class="col-span-1 border rounded-xl overflow-hidden bg-surface-0 shadow-sm">
        <div class="bg-surface-100 px-4 py-3 border-b">
          <h4 class="font-semibold text-sm flex items-center gap-2">
            <i class="pi pi-shield text-primary" />
            {{ menu.roles }}
          </h4>
        </div>
        <div v-if="isLoadingRoles" class="flex justify-center p-8">
          <ProgressSpinner style="width:32px;height:32px" />
        </div>
        <div v-else class="h-[500px] overflow-y-auto overflow-x-hidden">
          <div class="p-2 space-y-1">
            <button
              v-for="role in roles"
              :key="role.id"
              @click="selectRole(role.id)"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group"
              :class="
                selectedRoleId === role.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-surface-100 text-surface-600'
              "
            >
              <span>{{ role.displayName || role.name }}</span>
              <i
                v-if="selectedRoleId === role.id"
                class="pi pi-check-circle text-primary"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Permissions Grid -->
      <div class="col-span-1 md:col-span-3 border rounded-xl bg-surface-0 shadow-sm">
        <!-- Toolbar -->
        <div class="bg-surface-100 px-4 py-3 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <h4 class="font-semibold text-sm flex items-center gap-2 shrink-0">
              <i class="pi pi-shield-check text-primary" />
              {{ layout.assignedPermissions }}
            </h4>
            <Tag
              v-if="selectedRoleId"
              :value="`${activeRolePermissions.size} / ${permissions.length} ${layout.activePermissions}`"
              severity="secondary"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto" v-if="selectedRoleId">
            <div class="relative w-full sm:w-64 shrink-0">
              <span class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
              <InputText
                v-model="filters.search"
                :placeholder="t('crud.search', { module: layout.rolePermissions })"
                class="pl-9 h-9 w-full"
              />
            </div>

            <Select
              v-model="filters.module"
              :options="moduleOptions"
              option-label="label"
              option-value="value"
              :placeholder="crud.filterByModule"
              show-clear
              class="w-56 shrink-0"
            />
          </div>
        </div>

        <!-- Empty state: no role selected -->
        <div v-if="!selectedRoleId" class="flex flex-col items-center justify-center h-[500px] text-surface-400">
          <i class="pi pi-shield text-5xl opacity-20 mb-4" />
          <p>{{ layout.selectRolePrompt }}</p>
        </div>

        <!-- Loading permissions -->
        <div v-else-if="isLoadingPermissions" class="flex justify-center items-center h-[500px]">
          <ProgressSpinner style="width:40px;height:40px" />
        </div>

        <!-- Permissions list -->
        <div v-else class="h-[500px] p-6 overflow-y-auto">
          <div class="space-y-8">
            <div v-for="(groupPerms, groupName) in groupedPermissions" :key="groupName">
              <h5 class="text-xs font-bold text-surface-500 mb-4 uppercase tracking-widest bg-surface-100 py-1.5 px-3 rounded-lg inline-block">
                {{ groupName }}
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="permission in groupPerms"
                  :key="permission.id"
                  class="flex items-center justify-between p-3 border rounded-xl hover:border-primary/50 transition-colors"
                  :class="{
                    'border-primary/50 bg-primary/5': activeRolePermissions.has(permission.id),
                  }"
                >
                  <div class="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
                    <span class="text-sm font-medium truncate">
                      {{ permission.displayName || permission.name }}
                    </span>
                    <span class="text-xs text-surface-400 font-mono truncate">
                      {{ permission.name }}
                    </span>
                  </div>
                  <div class="relative flex items-center shrink-0">
                    <ProgressSpinner
                      v-if="isSyncing[permission.id]"
                      style="width:16px;height:16px"
                      class="absolute -left-6"
                    />
                    <ToggleSwitch
                      :model-value="activeRolePermissions.has(permission.id)"
                      :disabled="isSyncing[permission.id]"
                      @update:model-value="(val) => togglePermission(permission.id, val)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
