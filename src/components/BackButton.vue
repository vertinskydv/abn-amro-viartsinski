<script setup lang="ts">
import { useRouter, type RouteLocationNormalized } from 'vue-router';

const router = useRouter();

function goBack() {
  const prev = router.currentRoute.value.meta.previousRoute as
    | RouteLocationNormalized
    | undefined;
  if (prev?.name) {
    router.back();
  } else {
    router.push({ name: 'dashboard' });
  }
}
</script>

<template>
  <nav aria-label="Back">
    <button
      @click="goBack"
      class="flex items-center px-2 py-1.5 -ml-2 rounded-md hover:bg-white/5 focus:outline-accent transition-colors duration-200"
    >
      <svg
        class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 17l-5-5m0 0l5-5m-5 5h12"
        ></path>
      </svg>
      <span
        class="text-sm font-mediumgroup-hover:text-gray-800 transition-colors"
      >
        Back
      </span>
    </button>
  </nav>
</template>
