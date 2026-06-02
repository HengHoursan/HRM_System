<script setup lang="ts">
import { ref } from "vue";
import { uploadService } from "@/services/upload/upload.service.ts";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Avatar from "primevue/avatar";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";

const { t } = useI18n();
const toast = useToast();

const props = defineProps<{
  imageUrl?: string;
  label?: string;
  class?: string;
  shape?: "square" | "circle";
  name?: string;
}>();

const emit = defineEmits<{
  (e: "update:imageUrl", value: string): void;
}>();

const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
    toast.add({ severity: "error", summary: "Invalid File", detail: "Please upload a valid image file (png, jpeg, jpg, webp)", life: 3000 });
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.add({ severity: "error", summary: "File Too Large", detail: "File size must be less than 5MB", life: 3000 });
    return;
  }

  uploading.value = true;
  try {
    const response = await uploadService.uploadImage(file);
    if (response.success && response.data) {
      emit("update:imageUrl", response.data.image_url);
      toast.add({ severity: "success", summary: "Success", detail: t("crud.uploadSuccess") || "Image uploaded successfully", life: 3000 });
    } else {
      toast.add({ severity: "error", summary: "Error", detail: response.message || "Failed to upload image", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "An error occurred during upload", life: 3000 });
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
}

function removeImage() {
  emit("update:imageUrl", "");
}

function triggerUpload() {
  fileInput.value?.click();
}
</script>

<template>
  <div :class="props.class" class="w-full">
    <label v-if="label" class="block text-sm font-medium text-surface-700 mb-2">
      {{ label }}
    </label>

    <!-- Circular Avatar Mode -->
    <template v-if="shape === 'circle'">
      <div class="relative w-32 h-32 mx-auto cursor-pointer group" @click="triggerUpload">
        <Avatar
          v-if="imageUrl"
          :image="imageUrl"
          shape="circle"
          class="w-full h-full shadow-md"
        />
        <Avatar
          v-else
          icon="pi pi-user"
          shape="circle"
          class="w-full h-full bg-surface-200 text-surface-400 shadow-md"
          size="xlarge"
        />

        <div class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="pi pi-camera text-white text-2xl" />
        </div>

        <Button
          v-if="imageUrl"
          icon="pi pi-times"
          severity="danger"
          rounded
          text
          class="absolute -top-2 -right-2 bg-surface-0 shadow-sm p-1"
          @click.stop="removeImage"
        />

        <div v-if="uploading" class="absolute inset-0 bg-surface-0/80 rounded-full flex items-center justify-center">
          <ProgressSpinner style="width:30px;height:30px" />
        </div>
      </div>
    </template>

    <!-- Standard Square/Rect Mode -->
    <template v-else>
      <div
        class="relative border-2 border-dashed border-surface-300 rounded-xl p-4 text-center cursor-pointer hover:bg-surface-50 transition-colors h-48 flex flex-col items-center justify-center"
        @click="triggerUpload"
      >
        <template v-if="imageUrl">
          <img :src="imageUrl" class="max-h-full max-w-full object-contain rounded-lg" />
          <Button
            icon="pi pi-times"
            severity="danger"
            rounded
            text
            class="absolute top-2 right-2 bg-surface-0 shadow-sm"
            @click.stop="removeImage"
          />
        </template>
        <template v-else>
          <div class="flex flex-col items-center text-surface-500">
            <i class="pi pi-image text-4xl mb-2" />
            <span class="font-medium">{{ uploading ? t("crud.uploading") : t("crud.clickToUpload") }}</span>
            <span class="text-xs mt-1">{{ t("crud.uploadHint") }}</span>
          </div>
        </template>
        <div v-if="uploading" class="absolute inset-0 bg-surface-0/80 rounded-xl flex items-center justify-center">
          <ProgressSpinner style="width:40px;height:40px" />
        </div>
      </div>
    </template>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      @change="handleFileChange"
    />
  </div>
</template>
