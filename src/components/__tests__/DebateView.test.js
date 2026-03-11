import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import DebateView from '../DebateView.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('DebateView.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    store.gameState = 'debate';
    store.config.debateTime = 180;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders formatted time correctly', () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    expect(wrapper.text()).toContain('3:00');
  });

  it('decrements timer each second', async () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('2:59');
  });

  it('formats time with leading zero for seconds < 10', async () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    vi.advanceTimersByTime(52000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('2:08');
  });

  it('marks as urgent when time <= 30', async () => {
    store.config.debateTime = 35;
    const wrapper = mount(DebateView, { global: { stubs } });
    vi.advanceTimersByTime(6000);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.urgent').exists()).toBe(true);
    expect(wrapper.find('.urgent-text').exists()).toBe(true);
  });

  it('is not urgent when time > 30', () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    expect(wrapper.find('.urgent').exists()).toBe(false);
  });

  it('stops at 0', async () => {
    store.config.debateTime = 3;
    const wrapper = mount(DebateView, { global: { stubs } });
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('0:00');
  });

  it('skips debate and goes to voting on button click', async () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    await wrapper.find('.btn-vote-now').trigger('click');
    expect(store.gameState).toBe('voting');
  });

  it('uses default 180 seconds when debateTime not set', () => {
    delete store.config.debateTime;
    const wrapper = mount(DebateView, { global: { stubs } });
    expect(wrapper.text()).toContain('3:00');
  });

  it('clears interval on unmount', () => {
    const wrapper = mount(DebateView, { global: { stubs } });
    wrapper.unmount();
    // Should not throw or leak
  });

  it('covers timer tick in last 10 seconds', async () => {
    store.config.debateTime = 12;
    const wrapper = mount(DebateView, { global: { stubs } });
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('0:09');
  });
});
