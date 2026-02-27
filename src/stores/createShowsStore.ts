import { defineStore } from 'pinia';
import type { Show } from '../types/entities/Show';

export function createShowsStore(storeId: string) {
  return defineStore(storeId, {
    state: () => ({
      shows: [] as Show[],
    }),
    actions: {
      replace(shows: Show[]) {
        this.shows = shows;
      },
    },
    getters: {
      getById: (state) => {
        return (id: number | string) =>
          state.shows.find((show) => `${show.id}` === `${id}`);
      },
    },
  });
}
