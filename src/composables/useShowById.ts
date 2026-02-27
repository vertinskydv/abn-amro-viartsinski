import { computed, onMounted, ref } from 'vue';
import { getShowsById } from '../api/shows';
import { useDashboardShowsStore } from '../stores/useDashboardShowsStore';
import type { Show } from '../types/entities/Show';
import { logger } from '../utils/logger.ts';

export const useShowById = (id: string) => {
  const showsStore = useDashboardShowsStore();
  const localShow = ref<Show | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const show = computed<Show | null>(() => {
    return showsStore.getById(id) ?? localShow.value;
  });

  const fetchShow = async (id: string) => {
    if (show.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      localShow.value = await getShowsById(id);
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : 'Error while loading show with id: ' + id;
      logger(e);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => fetchShow(id));

  return { show, isLoading, error };
};
