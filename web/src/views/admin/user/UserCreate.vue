<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useZod } from "@/hooks/useZod";
import { userService } from "@/services/user/user.service";
import { roleService } from "@/services/role/role.service";
import type { Role } from "@/types";
import { useToast } from "primevue/usetoast";
import ImageUpload from "@/components/upload/ImageUpload.vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";
import Toast from "primevue/toast";

const { t, labels, fields, crud, auth } = useAppI18n("user");
const toast = useToast();
const router = useRouter();
const { z, err } = useZod();

const roles = ref<Role[]>([]);
const fetchingRoles = ref(false);
const submitting = ref(false);

const userSchema = computed(() =>
  z.object({
    username: z.string().min(3, err.min("auth.username", 3)).max(60, err.max("auth.username", 60)),
    email: z.string().email(err.email()),
    password: z.string().min(6, err.min("auth.password", 6)),
    roleId: z.string().nullable().optional(),
    status: z.boolean().default(true),
    photo: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: computed(() => toTypedSchema(userSchema.value)),
  initialValues: { username: "", email: "", password: "", roleId: null, status: true, photo: "" },
});

const [usernameField, usernameMeta] = form.defineField("username");
const [emailField, emailMeta] = form.defineField("email");
const [passwordField, passwordMeta] = form.defineField("password");
const [roleIdField] = form.defineField("roleId");
const [statusField] = form.defineField("status");
const [photoField] = form.defineField("photo");

const roleOptions = computed(() =>
  roles.value.map((r) => ({ label: r.name, value: String(r.id) }))
);

const fetchRoles = async () => {
  fetchingRoles.value = true;
  try {
    const response = await roleService.getAll();
    if (response.success && response.data) roles.value = response.data;
  } catch {}
  finally { fetchingRoles.value = false; }
};

const onSubmit = form.handleSubmit(async (values) => {
  submitting.value = true;
  try {
    const payload: any = {
      username: values.username,
      email: values.email,
      password: values.password,
      status: values.status,
      photo: values.photo,
    };
    if (values.roleId && values.roleId !== "null") payload.roleId = Number(values.roleId);
    const response = await userService.create(payload);
    if (response.success) {
      toast.add({ severity: "success", summary: t("crud.successCreate", { module: labels.name }), life: 3000 });
      router.push("/admin/users");
    } else {
      toast.add({ severity: "error", summary: response.message || t("crud.errorCreate", { module: labels.name }), life: 3000 });
    }
  } catch (error: any) {
    toast.add({ severity: "error", summary: error.response?.data?.message || t("crud.errorGeneral"), life: 3000 });
  } finally {
    submitting.value = false;
  }
});

onMounted(() => fetchRoles());
</script>

<template>
  <Toast />
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button icon="pi pi-arrow-left" severity="secondary" outlined rounded @click="router.back()" />
      <h2 class="text-3xl font-bold tracking-tight">
        {{ crud.createBtn }} {{ labels.name }}
      </h2>
    </div>

    <Card class="shadow-lg">
      <template #title>{{ t('crud.info', { module: labels.name }) }}</template>
      <template #content>
        <form @submit="onSubmit" id="userCreateForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Username -->
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">{{ auth.username }} <span class="text-red-500">*</span></label>
              <InputText v-model="usernameField" placeholder="johndoe123" :invalid="!!usernameMeta.errors[0]" />
              <small class="text-red-500" v-if="usernameMeta.errors[0]">{{ usernameMeta.errors[0] }}</small>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">{{ auth.email }} <span class="text-red-500">*</span></label>
              <InputText v-model="emailField" type="email" placeholder="johndoe@example.com" :invalid="!!emailMeta.errors[0]" />
              <small class="text-red-500" v-if="emailMeta.errors[0]">{{ emailMeta.errors[0] }}</small>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">{{ auth.password }} <span class="text-red-500">*</span></label>
              <InputText v-model="passwordField" type="password" placeholder="••••••••" :invalid="!!passwordMeta.errors[0]" />
              <small class="text-red-500" v-if="passwordMeta.errors[0]">{{ passwordMeta.errors[0] }}</small>
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">{{ auth.role }}</label>
              <Select
                v-model="roleIdField"
                :options="[{ label: crud.none, value: 'null' }, ...roleOptions]"
                option-label="label"
                option-value="value"
                :placeholder="fields.selectRole"
                :loading="fetchingRoles"
                class="w-full"
              />
            </div>

            <!-- Status -->
            <div class="md:col-span-2">
              <div class="flex flex-row items-center justify-between rounded-xl border p-4 bg-surface-50">
                <div>
                  <p class="font-semibold text-base">{{ fields.activeStatus }}</p>
                  <p class="text-sm text-surface-500">{{ t('fields.statusDescription', { module: labels.name }) }}</p>
                </div>
                <ToggleSwitch v-model="statusField" />
              </div>
            </div>

            <!-- Photo Upload -->
            <div class="md:col-span-2 space-y-4">
              <label class="font-medium text-sm">{{ fields.photo }}</label>
              <div class="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100 transition-all">
                <ImageUpload :image-url="photoField" @update:image-url="(v) => (photoField = v)" shape="circle" />
                <div class="text-center space-y-1 mt-2">
                  <p class="text-sm font-bold">{{ fields.userAvatar }}</p>
                  <p class="text-xs text-surface-400 leading-relaxed max-w-xs">{{ fields.userAvatarHint }}</p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 border-t pt-4">
          <Button :label="crud.cancel" severity="secondary" outlined @click="router.back()" :disabled="submitting" />
          <Button
            type="submit"
            form="userCreateForm"
            :label="`${crud.createBtn} ${labels.name}`"
            :loading="submitting"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
