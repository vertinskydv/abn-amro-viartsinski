<script setup lang="ts">
import { computed, toRef } from 'vue';
import ContentWrap from '../components/ContentWrap.vue';
import ShowsSection from '../components/ShowsSection.vue';
import { useLoadSearchShows } from '../composables/useLoadSearchShows.ts';
import Loader from '../components/Loader.vue';
import Error from '../components/Error.vue';

const props = defineProps<{ q?: string }>();
const query = toRef(() => props.q ?? '');

const { shows, isLoading, error } = useLoadSearchShows(query);

const title = computed(() =>
  shows.value.length
    ? `Search results for "${props.q}":`
    : `No search results for: "${props.q}"`,
);
</script>

<template>
  <ContentWrap>
    <Error v-if="error" :message="error" />
    <Loader v-if="isLoading" class="mt-40" />
    <ShowsSection
      v-if="!isLoading && !error"
      :title="title"
      :shows="shows"
      :orientation="'vertical'"
    />
  </ContentWrap>
</template>
