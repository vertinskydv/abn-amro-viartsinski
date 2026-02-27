// AppHeader.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Header from '../Header.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div/>' } },
      { path: '/search', name: 'search', component: { template: '<div/>' } },
    ],
  });
}

describe('AppHeader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets isFocused=true on input focus and isFocused=false on blur', async () => {
    const router = createTestRouter();
    const wrapper = mount(Header, { global: { plugins: [router] } });
    const input = wrapper.find('input');
    const container = wrapper.find('div.flex.items-center.gap-2');

    await input.trigger('focus');
    expect(container.classes()).toContain('border-accent');

    await input.trigger('blur');
    expect(container.classes()).toContain('border-white/10');
  });

  it('navigates to search route after debounce when input has value', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mount(Header, { global: { plugins: [router] } });

    await wrapper.find('input').setValue('batman');
    vi.advanceTimersByTime(500);
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('search');
    expect(router.currentRoute.value.query.q).toBe('batman');
  });

  it('navigates to dashboard when input is cleared', async () => {
    const router = createTestRouter();
    await router.push('/search?q=batman');

    const wrapper = mount(Header, { global: { plugins: [router] } });
    vi.clearAllTimers();
    await flushPromises();

    await wrapper.find('input').setValue('');
    vi.advanceTimersByTime(500);
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('navigates to dashboard when input is only whitespace', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mount(Header, { global: { plugins: [router] } });

    await wrapper.find('input').setValue('   ');
    vi.advanceTimersByTime(500);
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('debounces navigation', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mount(Header, { global: { plugins: [router] } });

    await wrapper.find('input').setValue('batman');
    vi.advanceTimersByTime(499);
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dashboard');

    vi.advanceTimersByTime(1);
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('search');
  });

  it('trims text from input', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mount(Header, { global: { plugins: [router] } });

    await wrapper.find('input').setValue('  batman  ');
    vi.advanceTimersByTime(500);
    await flushPromises();

    expect(router.currentRoute.value.query.q).toBe('batman');
  });

  it('populates input from query param on mount', async () => {
    const router = createTestRouter();
    await router.push('/search?q=inception');

    const wrapper = mount(Header, { global: { plugins: [router] } });
    await flushPromises();

    const input = wrapper.find('input').element as HTMLInputElement;
    expect(input.value).toBe('inception');
  });
});
