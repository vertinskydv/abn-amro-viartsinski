import { computed } from 'vue';
import { useDashboardShowsStore } from '../stores/useDashboardShowsStore';
import type { Show } from '../types/entities/Show';

type ShowsByGenre = Record<string, Show[]>;

export const useShowsByGenre = () => {
  const showsStore = useDashboardShowsStore();

  const showsByGenre = computed(() => {
    return showsStore.shows.reduce<ShowsByGenre>((acc, show) => {
      show.genres.forEach((genre) => {
        if (!acc[genre]) acc[genre] = [];
        acc[genre].push(show);
      });
      return acc;
    }, {});
  });

  return { showsByGenre };
};
