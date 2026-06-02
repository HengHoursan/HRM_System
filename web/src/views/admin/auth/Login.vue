<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAppI18n } from "@/hooks/useAppI18n";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const authStore = useAuthStore();
const { t, auth, fields } = useAppI18n("auth");
const toast = useToast();

const isLoading = ref(false);
const email = ref("");
const password = ref("");
const errors = ref<{ email?: string; password?: string }>({});

const validate = () => {
  errors.value = {};
  if (!email.value) errors.value.email = t("validation.required", { field: "Email" });
  if (!password.value) errors.value.password = t("validation.required", { field: "Password" });
  else if (password.value.length < 6) errors.value.password = t("validation.min", { field: "Password", count: 6 });
  return Object.keys(errors.value).length === 0;
};

const onSubmit = async () => {
  if (!validate()) return;
  
  isLoading.value = true;
  try {
    const response = await authStore.login({ email: email.value, password: password.value });
    if (response.success) {
      router.push("/dashboard");
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: response.message || t("auth.loginFailed"), life: 3000 });
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || t("auth.loginError"), life: 3000 });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <Card class="auth-card">
      <template #title>
        <div class="auth-header">
          <h2>{{ auth.welcomeBack }}</h2>
          <p class="auth-subtitle">{{ auth.loginDescription }}</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-field">
            <label for="email">{{ auth.email }}</label>
            <InputText id="email" v-model="email" type="email" :placeholder="fields.emailPlaceholder" :disabled="isLoading" :invalid="!!errors.email" />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="form-field">
            <label for="password">{{ auth.password }}</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask :disabled="isLoading" :invalid="!!errors.password" inputClass="w-full" />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Button type="submit" class="w-full mt-3" :disabled="isLoading" :label="isLoading ? auth.loggingIn : auth.login" />

          <div class="auth-footer">
            {{ auth.noAccount }}
            <RouterLink to="/register" class="auth-link">{{ auth.signup }}</RouterLink>
          </div>
        </form>
      </template>
    </Card>
    <Toast />
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: var(--p-surface-50);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem;
}

.auth-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.auth-subtitle {
  color: var(--p-text-color-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  font-size: 0.9rem;
}

.form-field :deep(.p-password) {
  width: 100%;
}
.form-field :deep(.p-password-input) {
  width: 100%;
}

.w-full {
  width: 100%;
}

.mt-3 {
  margin-top: 0.75rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.auth-link {
  color: var(--p-primary-color);
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
