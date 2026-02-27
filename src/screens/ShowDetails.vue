<script setup lang="ts">
import { useShowById } from '../composables/useShowById.ts';
import ContentWrap from '../components/ContentWrap.vue';
import BackButton from '../components/BackButton.vue';
import StarSVG from '../components/StarSVG.vue';
import Loader from '../components/Loader.vue';
import Error from '../components/Error.vue';

const { id } = defineProps<{ id: string }>();
const { show, isLoading, error } = useShowById(id);
</script>

<template>
  <ContentWrap>
    <BackButton class="mb-5" />
    <Error v-if="error" :message="error" />
    <Loader v-if="isLoading" class="mt-40" />
    <div v-if="show && !isLoading && !error">
      <div class="flex flex-col items-center md:flex-row md:items-start gap-10">
        <div class="shrink-0">
          <img
            :src="show.image?.original"
            :alt="show.name + ' poster image'"
            class="w-80 rounded shadow-md object-cover"
          />
        </div>

        <div class="flex-1">
          <h1 class="font-display italic text-6xl leading-none text-bone mb-4">
            {{ show.name }}
          </h1>

          <div class="flex items-center gap-3 text-base text-soft mb-5">
            <span>{{ show.year }}</span>
            <span class="text-muted">·</span>
            <span>{{ show.language }}</span>
            <template v-if="show.rating.average">
              <span class="text-muted">·</span>
              <span class="flex items-center gap-1">
                <StarSVG />
                <span>{{ show.rating.average }}</span>
              </span>
            </template>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="genre in show.genres"
              :key="genre"
              class="border border-blood text-blood-light text-xs tracking-widest uppercase px-3 py-1"
              >{{ genre }}</span
            >
          </div>

          <hr class="border-t border-white/10 mb-6" />

          <div
            class="text-soft text-lg leading-relaxed max-w-xl [&_b]:text-bone [&_b]:font-normal [&_p]:m-0"
            v-html="show.summary"
          ></div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>
