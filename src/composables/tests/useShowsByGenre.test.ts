import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useShowsByGenre } from '../useShowsByGenre';

vi.mock('../../stores/useDashboardShowsStore', () => ({
  useDashboardShowsStore: vi.fn(() => ({
    shows: [],
  })),
}));

import { useDashboardShowsStore } from '../../stores/useDashboardShowsStore';

const mountComposable = () => {
  let result: ReturnType<typeof useShowsByGenre>;

  const TestComponent = defineComponent({
    setup() {
      result = useShowsByGenre();
      return {};
    },
    template: '<div />',
  });

  mount(TestComponent);

  return result!;
};

describe('useShowsByGenre', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: [],
    } as any);
  });

  it('should return empty object when there are no shows', () => {
    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: [],
    } as any);

    const { showsByGenre } = mountComposable();

    expect(showsByGenre).toBeDefined();
    expect(showsByGenre.value).toEqual({});
  });

  it('should group shows by genre', () => {
    const mockShows = [
      { id: 1, name: 'Breaking Bad', genres: ['Drama', 'Crime'] },
      { id: 2, name: 'Better Call Saul', genres: ['Drama', 'Crime'] },
      { id: 3, name: 'The Office', genres: ['Comedy'] },
    ];

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: mockShows,
    } as any);

    const { showsByGenre } = mountComposable();

    expect(showsByGenre.value).toEqual({
      Drama: [mockShows[0], mockShows[1]],
      Crime: [mockShows[0], mockShows[1]],
      Comedy: [mockShows[2]],
    });
  });

  it('should put a show into multiple genres', () => {
    const mockShow = {
      id: 1,
      name: 'Breaking Bad',
      genres: ['Drama', 'Crime', 'Thriller'],
    };

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: [mockShow],
    } as any);

    const { showsByGenre } = mountComposable();

    expect(showsByGenre.value['Drama']).toContain(mockShow);
    expect(showsByGenre.value['Crime']).toContain(mockShow);
    expect(showsByGenre.value['Thriller']).toContain(mockShow);
  });

  it('should handle shows with no genres', () => {
    const mockShows = [
      { id: 1, name: 'Show 1', genres: [] },
      { id: 2, name: 'Show 2', genres: ['Drama'] },
    ];

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: mockShows,
    } as any);

    const { showsByGenre } = mountComposable();

    expect(Object.keys(showsByGenre.value)).toEqual(['Drama']);
    expect(showsByGenre.value['Drama']).toEqual([mockShows[1]]);
  });

  it('should return correct genre keys', () => {
    const mockShows = [
      { id: 1, name: 'Show 1', genres: ['Action'] },
      { id: 2, name: 'Show 2', genres: ['Comedy'] },
      { id: 3, name: 'Show 3', genres: ['Drama'] },
    ];

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      shows: mockShows,
    } as any);

    const { showsByGenre } = mountComposable();

    expect(Object.keys(showsByGenre.value)).toEqual([
      'Action',
      'Comedy',
      'Drama',
    ]);
  });
});
