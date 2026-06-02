<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { userService } from "@/services/user/user.service";
import { useAuthStore } from "@/stores/auth";
import { useAppI18n } from "@/hooks/useAppI18n";
import ImageUpload from "@/components/upload/ImageUpload.vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";

const { t, crud, auth, fields } = useAppI18n();
const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const submitting = ref(false);

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, t("validation.min", { field: auth.username, min: 3 })).max(60),
    email: z.string().min(1, t("validation.required", { field: auth.email })).email(t("validation.email")),
    photo: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: authStore.user?.username || "",
    email: authStore.user?.email || "",
    photo: authStore.user?.photo || "",
  },
});

const [usernameField, usernameMeta] = form.defineField("username");
const [emailField, emailMeta] = form.defineField("email");
const [photoField] = form.defineField("photo");

const onSubmit = form.handleSubmit(async (values) => {
  submitting.value = true;
  try {
    const response = await userService.updateProfile(values);
    if (response.success && response.data) {
      toast.add({ severity: "success", summary: t("crud.successProfileUpdate"), life: 3000 });
      authStore.setUser(response.data);
    } else {
      toast.add({ severity: "error", summary: response.message || t("crud.errorProfileUpdate"), life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: t("crud.errorProfileUpdate"), life: 3000 });
  } finally {
    submitting.value = false;
  }
});

onMounted(() => {
  if (authStore.user) {
    form.setValues({
      username: authStore.user.username,
      email: authStore.user.email,
      photo: authStore.user.photo || "",
    });
  }
});
</script>

<template>
  <Toast />
  <div class="space-y-6">
    <Card class="w-full shadow-xl">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-user text-primary" />
          {{ crud.profileInfo }}
        </div>
      </template>
      <template #content>
        <form @submit="onSubmit" id="profileForm" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <!-- Photo Section -->
            <div class="lg:col-span-4 space-y-4">
              <label class="font-medium text-sm flex items-center gap-2">
                <i class="pi pi-camera text-surface-500" />
                {{ t("fields.photo") }}
              </label>
              <div class="flex flex-col items-center gap-6">
                <ImageUpload
                  :image-url="photoField"
                  @update:image-url="(v) => (photoField = v)"
                  shape="circle"
                  class="w-full"
                />
                <div class="text-center space-y-1.5">
                  <p class="text-sm font-bold">{{ fields.userAvatar }}</p>
                  <p class="text-xs text-surface-400 leading-relaxed max-w-52">{{ fields.userAvatarHint }}</p>
                </div>
              </div>
            </div>

            <!-- Fields Section -->
            <div class="lg:col-span-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Username -->
                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm">{{ auth.username }}</label>
                  <InputText v-model="usernameField" :invalid="!!usernameMeta.errors[0]" class="h-11" />
                  <small class="text-red-500" v-if="usernameMeta.errors[0]">{{ usernameMeta.errors[0] }}</small>
                </div>

                <!-- Email -->
                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm">{{ auth.email }}</label>
                  <InputText v-model="emailField" type="email" :invalid="!!emailMeta.errors[0]" class="h-11" />
                  <small class="text-red-500" v-if="emailMeta.errors[0]">{{ emailMeta.errors[0] }}</small>
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-surface-100 border border-surface-200 space-y-2">
                <p class="text-sm font-bold">{{ fields.profileVisibility }}</p>
                <p class="text-xs text-surface-500 leading-relaxed">{{ fields.profileVisibilityDesc }}</p>
              </div>
            </div>

          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4 border-t pt-6">
          <Button
            type="button"
            severity="secondary"
            outlined
            class="h-11 px-6"
            icon="pi pi-shield"
            :label="auth.changePassword"
            @click="router.push('/admin/settings/security')"
          />
          <Button
            type="submit"
            form="profileForm"
            :loading="submitting"
            :label="crud.updateProfile"
            class="h-11 px-10 font-bold"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
