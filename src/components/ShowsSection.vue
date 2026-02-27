<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Show } from '../types/entities/Show';
import ShowCard from './ShowCard.vue';

defineProps<{
  title: string;
  shows?: Show[];
  orientation?: 'horizontal' | 'vertical';
}>();

function preloadImage(url: string | undefined) {
  if (url) {
    const img = new Image();
    img.src = url;
  }
}
</script>

<template>
  <section class="py-5">
    <h4
      class="mb-5 font-bold text-2xl text-zinc-100 tracking-tight leading-none"
    >
      {{ title }}
    </h4>

    <div
      :class="[
        orientation === 'vertical'
          ? 'overflow-y-auto'
          : 'overflow-x-auto scrollbar-hide',
      ]"
    >
      <div
        :class="[
          orientation === 'vertical'
            ? 'flex flex-wrap gap-5 m-0.5'
            : 'flex gap-5 w-max m-0.5',
        ]"
      >
        <RouterLink
          class="focus:outline-accent"
          v-for="show in shows"
          :key="show.id"
          :to="{ name: 'show-details', params: { id: show.id } }"
          @mouseenter="preloadImage(show.image?.original)"
          @focus="preloadImage(show.image?.original)"
        >
          <ShowCard :show="show" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
