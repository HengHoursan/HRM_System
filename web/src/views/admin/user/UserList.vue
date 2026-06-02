<script setup lang="ts">
import { useAppI18n } from "@/hooks/useAppI18n";
import { usePermissions } from "@/hooks/usePermissions";
const { t, labels, fields, crud, auth } = useAppI18n("user");
const { hasPermission } = usePermissions();
import { ref, onMounted, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/services/user/user.service";
import type { User, PaginationMeta } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import Paginator from "primevue/paginator";
import Toast from "primevue/toast";

const toast = useToast();
const router = useRouter();

const users = ref<User[]>([]);
const loading = ref(true);
const filters = reactive({ search: "", status: "" });

const pagination = reactive<PaginationMeta>({
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  sortBy: "createdAt",
  sortOrder: "DESC",
});

const statusOptions = computed(() => [
  { label: crud.active, value: "active" },
  { label: crud.inactive, value: "inactive" },
]);

const isDeleteDialogOpen = ref(false);
const userToDelete = ref<number | null>(null);
const isResetDialogOpen = ref(false);
const userToReset = ref<number | null>(null);
const newPassword = ref("");
const resetting = ref(false);

const selectedUsers = ref<User[]>([]);

async function handleBulkAction(action: "delete" | "activate" | "deactivate") {
  if (selectedUsers.value.length === 0) return;
  const ids = selectedUsers.value.map((u) => u.id);
  const moduleTitle = labels.title;
  try {
    if (action === "delete") {
      if (!confirm(t("crud.confirmBulkDelete", { count: ids.length, module: moduleTitle }))) return;
      const res = await userService.bulkSoftDelete(ids);
      if (res.success) {
        toast.add({ severity: "success", summary: t("crud.successBulkDelete", { module: moduleTitle }), life: 3000 });
        selectedUsers.value = [];
        fetchUsers();
      }
    } else {
      const status = action === "activate";
      const res = await userService.bulkUpdateStatus(ids, status);
      if (res.success) {
        toast.add({ severity: "success", summary: t("crud.successBulkUpdate", { module: moduleTitle }), life: 3000 });
        selectedUsers.value = [];
        fetchUsers();
      }
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorBulkAction"), life: 3000 });
  }
}

async function fetchUsers() {
  loading.value = true;
  try {
    const payload: any = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
    };
    if (filters.search.trim()) payload.search = filters.search.trim();
    if (filters.status) payload.filter = { status: filters.status };
    const response = await userService.getList(payload);
    if (response.success && response.data) {
      users.value = response.data.data;
      Object.assign(pagination, response.data.meta);
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorFetch", { module: labels.title }), life: 3000 });
  } finally {
    loading.value = false;
  }
}

const debouncedFetch = useDebounceFn(() => { pagination.page = 1; fetchUsers(); }, 500);
watch(() => filters.search, () => debouncedFetch());
watch(() => filters.status, () => { pagination.page = 1; fetchUsers(); });

function onPageChange(event: any) {
  pagination.page = event.page + 1;
  pagination.limit = event.rows;
  fetchUsers();
}

async function toggleStatus(user: User) {
  try {
    const response = await userService.updateStatus({ id: user.id, status: !user.status });
    if (response.success) {
      user.status = !user.status;
      toast.add({ severity: "success", summary: t("crud.successUpdate", { module: labels.name }), life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorUpdate", { module: labels.name }), life: 3000 });
  }
}

function openDeleteDialog(id: number) { userToDelete.value = id; isDeleteDialogOpen.value = true; }

async function confirmDelete() {
  if (!userToDelete.value) return;
  try {
    const response = await userService.softDelete(userToDelete.value);
    if (response.success) {
      toast.add({ severity: "success", summary: t("crud.successDelete", { module: labels.name }), life: 3000 });
      fetchUsers();
    } else {
      toast.add({ severity: "error", summary: response.message || t("crud.errorDelete", { module: labels.name }), life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorDelete", { module: labels.name }), life: 3000 });
  } finally {
    isDeleteDialogOpen.value = false;
    userToDelete.value = null;
  }
}

function openResetDialog(id: number) { userToReset.value = id; newPassword.value = ""; isResetDialogOpen.value = true; }

async function confirmReset() {
  if (!userToReset.value || newPassword.value.trim().length < 6) {
    toast.add({ severity: "warn", summary: t("validation.min", { field: t("auth.password"), min: 6 }), life: 3000 });
    return;
  }
  resetting.value = true;
  try {
    const response = await userService.resetPassword(userToReset.value, newPassword.value.trim());
    if (response.success) {
      toast.add({ severity: "success", summary: t("crud.successPasswordChange"), life: 3000 });
      isResetDialogOpen.value = false;
    } else {
      toast.add({ severity: "error", summary: response.message || t("crud.errorPasswordChange"), life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorPasswordChange"), life: 3000 });
  } finally {
    resetting.value = false;
  }
}

function handleSort(event: any) {
  pagination.sortBy = event.sortField;
  pagination.sortOrder = event.sortOrder === 1 ? "ASC" : "DESC";
  fetchUsers();
}

onMounted(() => fetchUsers());
</script>

<template>
  <Toast />
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">{{ labels.title }}</h2>
      <div class="flex items-center gap-2">
        <Button icon="pi pi-refresh" severity="secondary" outlined :loading="loading" @click="fetchUsers" />
        <Button
          v-permission="'user:create'"
          icon="pi pi-plus"
          :label="`${crud.createBtn} ${labels.name}`"
          @click="router.push('/admin/users/create')"
        />
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div
      v-if="selectedUsers.length > 0"
      class="flex items-center gap-2 p-3 bg-surface-100 border rounded-xl"
    >
      <span class="text-sm font-medium mr-2">{{ t("crud.selectedCount", { count: selectedUsers.length }) }}</span>
      <Button v-permission="'user:update'" :label="crud.activate" severity="secondary" outlined size="small" @click="handleBulkAction('activate')" />
      <Button v-permission="'user:update'" :label="crud.deactivate" severity="secondary" outlined size="small" @click="handleBulkAction('deactivate')" />
      <Button v-permission="'user:delete'" :label="crud.delete" severity="danger" size="small" icon="pi pi-trash" @click="handleBulkAction('delete')" />
      <Button :label="crud.cancel" severity="secondary" text size="small" class="ml-auto" @click="selectedUsers = []" />
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="relative flex-1 w-full max-w-sm">
        <span class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
        <InputText
          v-model="filters.search"
          :placeholder="t('crud.search', { module: labels.title })"
          class="pl-9 w-full"
        />
      </div>
      <Select
        v-model="filters.status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        :placeholder="crud.filterByStatus"
        show-clear
        class="w-full sm:w-56"
      />
    </div>

    <!-- DataTable -->
    <DataTable
      v-model:selection="selectedUsers"
      :value="users"
      :loading="loading"
      lazy
      data-key="id"
      @sort="handleSort"
      class="rounded-xl border overflow-hidden"
      striped-rows
    >
      <Column selection-mode="multiple" header-style="width: 3rem" />

      <Column header="" style="width: 60px">
        <template #body="{ data }">
          <Avatar
            :label="data.username.slice(0, 2).toUpperCase()"
            :image="data.photo || undefined"
            shape="circle"
            class="bg-primary/10 text-primary font-bold"
          />
        </template>
      </Column>

      <Column field="username" :header="auth.username" sortable />
      <Column field="email" :header="auth.email" />

      <Column :header="auth.role">
        <template #body="{ data }">
          <Tag v-if="data.role" :value="data.role.name" severity="secondary" />
          <span v-else class="text-surface-400 italic text-sm">{{ crud.none }}</span>
        </template>
      </Column>

      <Column :header="fields.status">
        <template #body="{ data }">
          <Tag
            :value="data.status ? crud.active : crud.inactive"
            :severity="data.status ? 'success' : 'warn'"
            :class="hasPermission('user:update') ? 'cursor-pointer' : ''"
            @click="hasPermission('user:update') ? toggleStatus(data) : null"
          />
        </template>
      </Column>

      <Column :header="crud.actions" style="width: 120px; text-align: right">
        <template #body="{ data }">
          <div class="flex items-center gap-1 justify-end">
            <Button
              v-permission="'user:update'"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              size="small"
              @click="router.push(`/admin/users/${data.id}/edit`)"
            />
            <Button
              v-permission="'user:update'"
              icon="pi pi-key"
              severity="secondary"
              text
              rounded
              size="small"
              @click="openResetDialog(data.id)"
            />
            <Button
              v-permission="'user:delete'"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              @click="openDeleteDialog(data.id)"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center justify-center py-12 gap-3 text-surface-400">
          <i class="pi pi-users text-4xl opacity-30" />
          <p class="font-medium">{{ t("crud.noRecords", { module: labels.title }) }}</p>
          <Button
            v-if="filters.search || filters.status"
            :label="crud.resetFilters"
            severity="secondary"
            outlined
            size="small"
            @click="Object.assign(filters, { search: '', status: '' })"
          />
        </div>
      </template>
    </DataTable>

    <!-- Paginator -->
    <div class="flex items-center justify-end pt-2" v-if="pagination.totalItems > 0">
      <Paginator
        :rows="pagination.limit"
        :total-records="pagination.totalItems"
        :first="(pagination.page - 1) * pagination.limit"
        :rows-per-page-options="[10, 25, 50, 100]"
        @page="onPageChange"
        template="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>

    <!-- Delete Dialog -->
    <Dialog v-model:visible="isDeleteDialogOpen" modal :header="crud.confirmDelete" :style="{ width: '400px' }">
      <p class="text-surface-600">{{ t("crud.confirmDeleteDesc", { module: labels.name }) }}</p>
      <template #footer>
        <Button :label="crud.cancel" severity="secondary" text @click="isDeleteDialogOpen = false" />
        <Button :label="crud.delete" severity="danger" @click="confirmDelete" />
      </template>
    </Dialog>

    <!-- Reset Password Dialog -->
    <Dialog v-model:visible="isResetDialogOpen" modal :header="auth.resetPassword" :style="{ width: '400px' }">
      <p class="text-surface-600 mb-4">{{ auth.resetPasswordDesc }}</p>
      <Password
        v-model="newPassword"
        :placeholder="auth.newPasswordPlaceholder"
        toggle-mask
        :feedback="false"
        class="w-full"
        input-class="w-full"
        @keyup.enter="confirmReset"
      />
      <template #footer>
        <Button :label="crud.cancel" severity="secondary" text @click="isResetDialogOpen = false" />
        <Button
          :label="crud.save"
          :loading="resetting"
          :disabled="newPassword.length < 6"
          @click="confirmReset"
        />
      </template>
    </Dialog>
  </div>
</template>
