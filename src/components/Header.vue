<script setup>
import { ref, watch, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const inputText = ref('');
const isFocused = ref(false);
let debounceTimer = null;

watch(inputText, (val) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleSearchNavigation(val);
  }, 500);
});

function handleSearchNavigation(val) {
  const query = val.trim();
  if (query) {
    router.push({ name: 'search', query: { q: query } });
  } else {
    router.push({ name: 'dashboard' });
  }
}

onMounted(async () => {
  await router.isReady();
  if (route.name === 'search' && route.query.q) {
    inputText.value = route.query.q;
  }
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#0c0c0e] backdrop-blur-xl"
  >
    <div class="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
      <RouterLink :to="{ name: 'dashboard' }" class="focus:outline-accent">
        <span
          class="text-white text-xl font-bold tracking-[0.2em] text-nowrap mr-5"
          >Maze TV</span
        >
      </RouterLink>

      <div
        class="flex items-center gap-2 rounded-sm px-4 h-10 w-200 max-sm:w-full border transition-all duration-300 ease-in-out"
        :class="
          isFocused ? 'bg-white/8 border-accent' : 'bg-white/5 border-white/10 '
        "
      >
        <svg
          fill="none"
          :class="isFocused ? 'text-accent' : 'text-white/35'"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          v-model="inputText"
          type="text"
          placeholder="Search..."
          class="flex-1 min-w-0 bg-transparent border-none outline-none text-[0.82rem] tracking-[0.03em] placeholder:text-white/25"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
      </div>
    </div>
  </header>
</template>
