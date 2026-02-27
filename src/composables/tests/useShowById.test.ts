import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useShowById } from '../useShowById';

vi.mock('../../api/shows', () => ({
  getShowsById: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  logger: vi.fn(),
}));

vi.mock('../../stores/useDashboardShowsStore', () => ({
  useDashboardShowsStore: vi.fn(() => ({
    getById: vi.fn(() => null),
  })),
}));

vi.mock('../../stores/useSearchShowsStore', () => ({
  useSearchShowsStore: vi.fn(() => ({
    getById: vi.fn(() => null),
  })),
}));

import { getShowsById } from '../../api/shows';
import { logger } from '../../utils/logger';
import { useDashboardShowsStore } from '../../stores/useDashboardShowsStore';
import { useSearchShowsStore } from '../../stores/useSearchShowsStore';

const mountComposable = (id: string) => {
  let result: ReturnType<typeof useShowById>;

  const TestComponent = defineComponent({
    setup() {
      result = useShowById(id);
      return {};
    },
    template: '<div />',
  });

  mount(TestComponent);

  return result!;
};

describe('useShowById', () => {
  let mockDashboardGetById: Mock;
  let mockSearchGetById: Mock;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    mockDashboardGetById = vi.fn(() => null);
    mockSearchGetById = vi.fn(() => null);

    vi.mocked(useDashboardShowsStore).mockReturnValue({
      getById: mockDashboardGetById,
    } as any);

    vi.mocked(useSearchShowsStore).mockReturnValue({
      getById: mockSearchGetById,
    } as any);
  });

  it('should return show, isLoading and error', () => {
    vi.mocked(getShowsById).mockResolvedValue(null as any);

    const { show, isLoading, error } = mountComposable('1');

    expect(show).toBeDefined();
    expect(isLoading.value).toBeDefined();
    expect(error.value).toBeNull();
  });

  it('should fetch show on mount when neither store has it', async () => {
    const mockShow = { id: '1', name: 'Breaking Bad' };
    vi.mocked(getShowsById).mockResolvedValue(mockShow as any);

    const { isLoading, show, error } = mountComposable('1');

    expect(isLoading.value).toBe(true);

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsById).toHaveBeenCalledWith('1');
    expect(show.value).toEqual(mockShow);
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  });

  it('should not fetch if show exists in dashboardShowsStore', async () => {
    const mockShow = { id: '1', name: 'From Dashboard Store' };
    mockDashboardGetById.mockReturnValue(mockShow);

    const { isLoading, show } = mountComposable('1');

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsById).not.toHaveBeenCalled();
    expect(show.value).toEqual(mockShow);
  });

  it('should not fetch if show exists in searchShowsStore', async () => {
    const mockShow = { id: '1', name: 'From Search Store' };
    mockSearchGetById.mockReturnValue(mockShow);

    const { isLoading, show } = mountComposable('1');

    await vi.waitUntil(() => !isLoading.value);

    expect(getShowsById).not.toHaveBeenCalled();
    expect(show.value).toEqual(mockShow);
  });

  it('should prefer dashboardShowsStore over searchShowsStore', () => {
    const dashboardShow = { id: '1', name: 'From Dashboard' };
    const searchShow = { id: '1', name: 'From Search' };

    mockDashboardGetById.mockReturnValue(dashboardShow);
    mockSearchGetById.mockReturnValue(searchShow);

    const { show } = mountComposable('1');

    expect(show.value).toEqual(dashboardShow);
  });

  it('should prefer searchShowsStore over localShow', async () => {
    const searchShow = { id: '1', name: 'From Search' };
    const apiShow = { id: '1', name: 'From API' };

    mockDashboardGetById.mockReturnValue(null);
    mockSearchGetById.mockReturnValueOnce(null).mockReturnValue(searchShow);
    vi.mocked(getShowsById).mockResolvedValue(apiShow as any);

    const { isLoading, show } = mountComposable('1');

    await vi.waitUntil(() => !isLoading.value);

    expect(show.value).toEqual(searchShow);
  });

  it('should set isLoading to true while fetching and false after', async () => {
    let resolveShow: (value: any) => void;
    const promise = new Promise((res) => {
      resolveShow = res;
    });
    vi.mocked(getShowsById).mockReturnValue(promise as any);

    const { isLoading } = mountComposable('1');

    expect(isLoading.value).toBe(true);

    resolveShow!({ id: '1', name: 'Breaking Bad' });
    await vi.waitUntil(() => !isLoading.value);

    expect(isLoading.value).toBe(false);
  });

  it('should set error from the Error message', async () => {
    const errorMessage = 'Network error';
    vi.mocked(getShowsById).mockRejectedValue(new Error(errorMessage));

    const { isLoading, error, show } = mountComposable('1');

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe(errorMessage);
    expect(show.value).toBeNull();
    expect(logger).toHaveBeenCalledOnce();
    expect(isLoading.value).toBe(false);
  });

  it('should set a default error for unknown errors', async () => {
    vi.mocked(getShowsById).mockRejectedValue('unknown error');

    const { isLoading, error } = mountComposable('42');

    await vi.waitUntil(() => !isLoading.value);

    expect(error.value).toBe('Error while loading show with id: 42');
    expect(logger).toHaveBeenCalledWith('unknown error');
  });
});
