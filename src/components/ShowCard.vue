<script setup lang="ts">
import type { Show } from '../types/entities/Show';
import StarSVG from './StarSVG.vue';

defineProps<{ show: Show }>();
</script>

<template>
  <div class="w-44 shrink-0 group cursor-pointer">
    <div class="relative w-44 h-64 rounded-md overflow-hidden bg-gray-500">
      <img
        :src="show.image?.medium"
        :alt="show.name + ' poster image'"
        loading="lazy"
        class="w-full h-full object-cover transition-all duration-500 saturate-[0.85] group-hover:scale-105 group-hover:saturate-100"
      />
    </div>

    <div class="mt-3 px-0.5">
      <h3 class="font-sans font-medium truncate leading-snug">
        {{ show.name }}
      </h3>
      <div class="mt-1.5 flex items-center justify-between">
        <span class="text-white/60 text- tracking-widest">
          {{ show.year }}
        </span>
        <div v-if="show.rating.average" class="flex items-center gap-1">
          <StarSVG />
          <span class="text-xs text-white/60 font-sans pt-px">{{
            show.rating.average
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
