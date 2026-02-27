import { ref, onMounted } from 'vue';
import { getShows } from '../api/shows';
import { useDashboardShowsStore } from '../stores/useDashboardShowsStore';
import { logger } from '../utils/logger';

export const useLoadDashboardShows = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const showsStore = useDashboardShowsStore();

  async function fetchShows() {
    isLoading.value = true;
    error.value = null;

    try {
      const shows = await getShows();
      showsStore.replace(shows);
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : 'Error while loading the list of shows';
      logger(e);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(fetchShows);

  return { isLoading, error };
};
