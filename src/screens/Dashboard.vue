<script setup lang="ts">
import ContentWrap from '../components/ContentWrap.vue';
import { useLoadDashboardShows, useShowsByGenre } from '../composables';
import ShowsSection from '../components/ShowsSection.vue';
import Loader from '../components/Loader.vue';
import Error from '../components/Error.vue';

import { ref } from 'vue';
const selected = ref<string | null>('all');

const { isLoading, error } = useLoadDashboardShows();
const { showsByGenre, allGenres } = useShowsByGenre(selected);
</script>

<template>
  <ContentWrap>
    <Error v-if="error" :message="error" />
    <Loader v-if="isLoading" class="mt-40" />
    <select v-model="selected">
      <option value="all">Please select one</option>
      <option v-for="genre in allGenres" :key="genre" :value="genre">
        {{ genre }}
      </option>
    </select>
    <div
      v-if="!isLoading && !error"
      v-for="(shows, genre) in showsByGenre"
      :key="genre"
    >
      <ShowsSection :shows="shows" :title="genre" />
    </div>
  </ContentWrap>
</template>
