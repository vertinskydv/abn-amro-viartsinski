<script setup lang="ts">
defineProps<{ message: string }>();
</script>
<template>
  <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
    <div class="flex items-center">
      <div class="shrink-0">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-red-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-500">{{ message }}</h3>
      </div>
    </div>
  </div>
</template>
