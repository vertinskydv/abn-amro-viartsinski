import { ref, watch, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { getShowsByName } from '../api/shows';
import { useSearchShowsStore } from '../stores/useSearchShowsStore';
import { logger } from '../utils/logger';

export const useLoadSearchShows = (nameRef: Ref<string>) => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const showsStore = useSearchShowsStore();
  const { shows } = storeToRefs(showsStore);

  async function loadShows(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    isLoading.value = true;
    error.value = null;

    try {
      const shows = await getShowsByName(trimmedName);
      showsStore.replace(shows);
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : 'Error while searching list of shows';
      logger(e);
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    nameRef,
    (newName) => {
      void loadShows(newName);
    },
    { immediate: true },
  );

  return { shows, isLoading, error, loadShows };
};
