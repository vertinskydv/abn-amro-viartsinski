import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useLoadSearchShows } from '../useLoadSearchShows';

vi.mock('../../api/shows', () => ({
  getShowsByName: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  logger: vi.fn(),
}));

vi.mock('../../stores/useSearchShowsStore', () => ({
  useSearchShowsStore: vi.fn(() => ({
    replace: vi.fn(),
    shows: [],
  })),
}));

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>();
  return {
    ...actual,
    storeToRefs: vi.fn((store) => ({
      shows: ref(store.shows ?? []),
    })),
  };
});

import { getShowsByName } from '../../api/shows';
import { logger } from '../../utils/logger';
import { useSearchShowsStore } from '../../stores/useSearchShowsStore';

const mountComposable = (initialName = '') => {
  let result: ReturnType<typeof useLoadSearchShows>;
  const nameRef = ref(initialName);

  const TestComponent = defineComponent({
    setup() {
      result = useLoadSearchShows(nameRef);
      return {};
    },
    template: '<div />',
  });

  mount(TestComponent);

  return { ...result!, nameRef };
};

describe('useLoadSearchShows', () => {
  let mockReplace: Mock;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    mockReplace = vi.fn();
    vi.mocked(useSearchShowsStore).mockReturnValue({
      replace: mockReplace,
      shows: [],
    } as any);
  });

  it('should return shows, isLoading and error', () => {
    vi.mocked(getShowsByName).mockResolvedValue([]);

    const { isLoading, error, shows } = mountComposable();

    expect(isLoading.value).toBeDefined();
    expect(error.value).toBeNull();
    expect(shows).toBeDefined();
  });

  it('should not call getShowsByName when name is empty', async () => {
    const { isLoading } = mountComposable('');

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsByName).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should not call getShowsByName when name is whitespace only', async () => {
    const { isLoading } = mountComposable('   ');

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsByName).not.toHaveBeenCalled();
  });

  it('should load shows immediately when name is provided on mount', async () => {
    const mockShows = [
      { id: 1, name: 'Breaking Bad' },
      { id: 2, name: 'Better Call Saul' },
    ];
    vi.mocked(getShowsByName).mockResolvedValue(mockShows as any);

    const { isLoading, error } = mountComposable('breaking');

    expect(isLoading.value).toBe(true);

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsByName).toHaveBeenCalledWith('breaking');
    expect(mockReplace).toHaveBeenCalledWith(mockShows);
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  });

  it('should trim the name before calling getShowsByName', async () => {
    vi.mocked(getShowsByName).mockResolvedValue([]);

    const { isLoading } = mountComposable('  breaking  ');

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsByName).toHaveBeenCalledWith('breaking');
  });

  it('should load shows when nameRef changes', async () => {
    const mockShows = [{ id: 1, name: 'Show 1' }];
    vi.mocked(getShowsByName).mockResolvedValue(mockShows as any);

    const { isLoading, error, nameRef } = mountComposable('');

    expect(getShowsByName).not.toHaveBeenCalled();

    nameRef.value = 'show';

    await nextTick();
    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsByName).toHaveBeenCalledWith('show');
    expect(mockReplace).toHaveBeenCalledWith(mockShows);
    expect(error.value).toBeNull();
  });

  it('should set error from the Error message', async () => {
    const errorMessage = 'Network error';
    vi.mocked(getShowsByName).mockRejectedValue(new Error(errorMessage));

    const { isLoading, error } = mountComposable('test');

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe(errorMessage);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledOnce();
    expect(isLoading.value).toBe(false);
  });

  it('should set a default error for unknown errors', async () => {
    vi.mocked(getShowsByName).mockRejectedValue('unknown error');

    const { isLoading, error } = mountComposable('test');

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe('Error while searching list of shows');
    expect(logger).toHaveBeenCalledWith('unknown error');
  });

  it('should reset error before repeating the request', async () => {
    vi.mocked(getShowsByName)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce([]);

    const { isLoading, error, nameRef } = mountComposable('first');

    await vi.waitUntil(() => !isLoading.value);
    expect(error.value).toBe('First error');

    nameRef.value = 'second';

    await nextTick();
    await vi.waitUntil(() => !isLoading.value && error.value === null);

    expect(error.value).toBeNull();
    expect(mockReplace).toHaveBeenCalledOnce();
  });

  it('should set isLoading to true while fetching and false after', async () => {
    let resolveShows: (value: any) => void;
    const promise = new Promise((res) => {
      resolveShows = res;
    });
    vi.mocked(getShowsByName).mockReturnValue(promise as any);

    const { isLoading } = mountComposable('test');

    expect(isLoading.value).toBe(true);

    resolveShows!([]);
    await vi.waitUntil(() => !isLoading.value);

    expect(isLoading.value).toBe(false);
  });
});
