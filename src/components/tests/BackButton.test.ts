// BackButton.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BackButton from '../BackButton.vue';

const mockBack = vi.fn();
const mockPush = vi.fn();
const mockCurrentRoute = { value: { meta: {} } };

vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    currentRoute: mockCurrentRoute,
  }),
}));

describe('BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentRoute.value.meta = {};
  });

  it('renders a button with text "Back"', () => {
    const wrapper = mount(BackButton);
    expect(wrapper.find('button').text()).toContain('Back');
  });

  it('calls router.back() when previousRoute has a name', async () => {
    mockCurrentRoute.value.meta = {
      previousRoute: { name: 'some-route' },
    };

    const wrapper = mount(BackButton);
    await wrapper.find('button').trigger('click');

    expect(mockBack).toHaveBeenCalledOnce();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls router.push({ name: "dashboard" }) when previousRoute is undefined', async () => {
    mockCurrentRoute.value.meta = {};

    const wrapper = mount(BackButton);
    await wrapper.find('button').trigger('click');

    expect(mockPush).toHaveBeenCalledWith({ name: 'dashboard' });
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('calls router.push({ name: "dashboard" }) when previousRoute has no name', async () => {
    mockCurrentRoute.value.meta = {
      previousRoute: { name: undefined },
    };

    const wrapper = mount(BackButton);
    await wrapper.find('button').trigger('click');

    expect(mockPush).toHaveBeenCalledWith({ name: 'dashboard' });
    expect(mockBack).not.toHaveBeenCalled();
  });
});
