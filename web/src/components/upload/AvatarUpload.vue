<script setup lang="ts">
import { ref } from "vue";
import { uploadService } from "@/services/upload/upload.service.ts";
import { useToast } from "primevue/usetoast";
import Avatar from "primevue/avatar";
import ProgressSpinner from "primevue/progressspinner";

const props = defineProps<{
  imageUrl?: string;
  name?: string;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:imageUrl", value: string): void;
}>();

const toast = useToast();
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
      toast.add({ severity: "success", summary: "Success", detail: "Profile picture updated", life: 3000 });
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

function triggerUpload() {
  fileInput.value?.click();
}

const userInitials = props.name 
  ? props.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  : "??";
</script>

<template>
  <div :class="props.class" class="relative group w-32 h-32 mx-auto cursor-pointer" @click="triggerUpload">
    <Avatar
      v-if="imageUrl"
      :image="imageUrl"
      shape="circle"
      class="w-full h-full shadow-md border-4 border-surface-0"
    />
    <Avatar
      v-else
      :label="userInitials"
      shape="circle"
      class="w-full h-full bg-primary-100 text-primary-700 shadow-md border-4 border-surface-0 font-bold text-2xl"
    />

    <div class="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <i class="pi pi-camera text-white text-2xl mb-1" />
      <span class="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
    </div>

    <div v-if="uploading" class="absolute inset-0 bg-surface-0/80 rounded-full flex items-center justify-center">
      <ProgressSpinner style="width:30px;height:30px" />
    </div>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      @change="handleFileChange"
    />
  </div>
</template>
