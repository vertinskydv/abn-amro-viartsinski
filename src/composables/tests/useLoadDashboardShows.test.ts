import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useLoadDashboardShows } from '../useLoadDashboardShows';

vi.mock('../../api/shows', () => ({
  getShows: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  logger: vi.fn(),
}));

vi.mock('../../stores/useDashboardShowsStore', () => ({
  useDashboardShowsStore: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

import { getShows } from '../../api/shows';
import { logger } from '../../utils/logger';
import { useDashboardShowsStore } from '../../stores/useDashboardShowsStore';

const mountComposable = () => {
  let result: ReturnType<typeof useLoadDashboardShows>;

  const TestComponent = defineComponent({
    setup() {
      result = useLoadDashboardShows();
      return {};
    },
    template: '<div />',
  });

  mount(TestComponent);

  return result!;
};

describe('useLoadDashboardShows', () => {
  let mockReplace: Mock;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    mockReplace = vi.fn();
    vi.mocked(useDashboardShowsStore).mockReturnValue({
      replace: mockReplace,
    } as any);
  });

  it('should return isLoading and error', () => {
    vi.mocked(getShows).mockResolvedValue([]);

    const { isLoading, error } = mountComposable();

    expect(isLoading.value).toBeDefined();
    expect(error.value).toBeNull();
  });

  it('should load the shows during mounting and save them to the store', async () => {
    const mockShows = [
      { id: 1, name: 'Show 1' },
      { id: 2, name: 'Show 2' },
    ];
    vi.mocked(getShows).mockResolvedValue(mockShows as any);

    const { isLoading, error } = mountComposable();

    expect(isLoading.value).toBe(true);

    await vi.waitUntil(() => !isLoading.value);

    expect(getShows).toHaveBeenCalledOnce();
    expect(mockReplace).toHaveBeenCalledWith(mockShows);
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  });

  it('should set error from the Error message', async () => {
    const errorMessage = 'Network error';
    vi.mocked(getShows).mockRejectedValue(new Error(errorMessage));

    const { isLoading, error } = mountComposable();

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe(errorMessage);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledOnce();
    expect(isLoading.value).toBe(false);
  });

  it('should set a default error for unknown errors', async () => {
    vi.mocked(getShows).mockRejectedValue('unknown error');

    const { isLoading, error } = mountComposable();

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe('Error while loading the list of shows');
    expect(logger).toHaveBeenCalledWith('unknown error');
  });

  it('should reset the error before repeating the request', async () => {
    vi.mocked(getShows)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce([]);

    const { isLoading, error } = mountComposable();

    await vi.waitUntil(() => !isLoading.value);
    expect(error.value).toBe('First error');

    vi.clearAllMocks();
    mockReplace = vi.fn();
    vi.mocked(useDashboardShowsStore).mockReturnValue({
      replace: mockReplace,
    } as any);
    vi.mocked(getShows).mockResolvedValue([]);

    const { error: error2 } = mountComposable();
    await vi.waitUntil(
      () => error2.value === null && mockReplace.mock.calls.length > 0,
    );

    expect(error2.value).toBeNull();
  });
});
