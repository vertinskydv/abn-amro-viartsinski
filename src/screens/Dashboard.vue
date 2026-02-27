<script setup lang="ts">
import ContentWrap from '../components/ContentWrap.vue';
import { useLoadDashboardShows, useShowsByGenre } from '../composables';
import ShowsSection from '../components/ShowsSection.vue';
import Loader from '../components/Loader.vue';
import Error from '../components/Error.vue';

const { isLoading, error } = useLoadDashboardShows();
const { showsByGenre } = useShowsByGenre();
</script>

<template>
  <ContentWrap>
    <Error v-if="error" :message="error" />
    <Loader v-if="isLoading" class="mt-40" />
    <div
      v-if="!isLoading && !error"
      v-for="(shows, genre) in showsByGenre"
      :key="genre"
    >
      <ShowsSection :shows="shows" :title="genre" />
    </div>
  </ContentWrap>
</template>
