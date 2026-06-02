<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "primevue/usetoast";
import { userService } from "@/services/user/user.service";
import { useAppI18n } from "@/hooks/useAppI18n";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";
import Button from "primevue/button";
import Password from "primevue/password";
import Toast from "primevue/toast";

const { t, auth, crud } = useAppI18n();
const toast = useToast();
const submitting = ref(false);

const formSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, t("validation.required", { field: auth.currentPassword })),
      newPassword: z.string().min(6, t("validation.min", { field: auth.newPassword, min: 6 })),
      confirmPassword: z.string().min(1, t("validation.required", { field: auth.confirmPassword })),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: auth.passwordMismatch,
      path: ["confirmPassword"],
    })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
});

const [currentPasswordField, currentPasswordMeta] = form.defineField("currentPassword");
const [newPasswordField, newPasswordMeta] = form.defineField("newPassword");
const [confirmPasswordField, confirmPasswordMeta] = form.defineField("confirmPassword");

const onSubmit = form.handleSubmit(async (values) => {
  submitting.value = true;
  try {
    const response = await userService.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    if (response.success) {
      toast.add({ severity: "success", summary: crud.successPasswordChange, life: 3000 });
      const authStore = useAuthStore();
      if (authStore.user?.must_change_password) {
        authStore.setUser({ ...authStore.user, must_change_password: false });
        toast.add({ severity: "info", summary: "Security requirement met. You now have full access.", life: 4000 });
      }
      form.resetForm();
    } else {
      toast.add({ severity: "error", summary: response.message || crud.errorPasswordChange, life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: crud.errorPasswordChange, life: 3000 });
  } finally {
    submitting.value = false;
  }
});
</script>

<template>
  <Toast />
  <Card class="w-full shadow-xl">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-shield text-primary" />
        {{ crud.securitySettings }}
      </div>
    </template>
    <template #content>
      <form @submit="onSubmit" id="securityForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Current Password -->
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm">{{ auth.currentPassword }}</label>
            <Password
              v-model="currentPasswordField"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              class="w-full"
              :invalid="!!currentPasswordMeta.errors[0]"
            />
            <small class="text-red-500" v-if="currentPasswordMeta.errors[0]">{{ currentPasswordMeta.errors[0] }}</small>
          </div>

          <div class="hidden md:block" />

          <!-- New Password -->
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm">{{ auth.newPassword }}</label>
            <Password
              v-model="newPasswordField"
              toggle-mask
              input-class="w-full"
              class="w-full"
              :invalid="!!newPasswordMeta.errors[0]"
            />
            <small class="text-red-500" v-if="newPasswordMeta.errors[0]">{{ newPasswordMeta.errors[0] }}</small>
          </div>

          <!-- Confirm Password -->
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm">{{ auth.confirmPassword }}</label>
            <Password
              v-model="confirmPasswordField"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              class="w-full"
              :invalid="!!confirmPasswordMeta.errors[0]"
            />
            <small class="text-red-500" v-if="confirmPasswordMeta.errors[0]">{{ confirmPasswordMeta.errors[0] }}</small>
          </div>

        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end border-t pt-6">
        <Button
          type="submit"
          form="securityForm"
          :loading="submitting"
          icon="pi pi-lock"
          :label="auth.changePassword"
          class="h-11 px-8 font-bold"
        />
      </div>
    </template>
  </Card>
</template>
