<script setup lang="ts">
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router';

const router = useRouter();
const route = useRoute();

function goBack() {
  const prev = route.meta.previousRoute as RouteLocationNormalized | undefined;
  if (prev?.name) {
    router.back();
  } else {
    router.push({ name: 'dashboard' });
  }
}
</script>

<!--<template>-->
<!--  <button-->
<!--    class="inline-flex items-center gap-3 px-1.5 py-1.5 border border-white/20 text-white font-bold rounded-lg hover:border-white/60 hover:bg-white/5 transition-all"-->
<!--    @click="goBack"-->
<!--  >-->
<!--    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">-->
<!--      <path-->
<!--        d="M8 2L4 6L8 10"-->
<!--        stroke="#fff"-->
<!--        stroke-width="1.5"-->
<!--        stroke-linecap="round"-->
<!--      />-->
<!--    </svg>-->
<!--    Back-->
<!--  </button>-->
<!--</template>-->

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
