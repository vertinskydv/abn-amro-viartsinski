import { computed, type Ref } from 'vue';
import { useDashboardShowsStore } from '../stores/useDashboardShowsStore';
import type { Show } from '../types/entities/Show';

type ShowsByGenre = Record<string, Show[]>;

export const useShowsByGenre = (filterGenre: Ref<string>) => {
  const showsStore = useDashboardShowsStore();

  const allGenres = computed(() => {
    return [
      ...new Set<string>(showsStore.shows.flatMap((show) => show.genres)),
    ];
  });

  const showsByGenre = computed(() => {
    return showsStore.shows.reduce<ShowsByGenre>((acc, show) => {
      show.genres.forEach((genre) => {
        if (filterGenre.value === 'all' || genre === filterGenre.value) {
          if (!acc[genre]) acc[genre] = [];
          acc[genre].push(show);
        }
      });
      return acc;
    }, {});
  });

  return { showsByGenre, allGenres };
};
