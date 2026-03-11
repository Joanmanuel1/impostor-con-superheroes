import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import WelcomeView from '../WelcomeView.vue';

describe('WelcomeView.vue', () => {
  beforeEach(() => {
    store.gameState = 'welcome';
  });

  it('changes gameState to setup on click', async () => {
    const wrapper = mount(WelcomeView);
    await wrapper.find('.welcome-screen').trigger('click');
    expect(store.gameState).toBe('setup');
  });

  it('renders splash image', () => {
    const wrapper = mount(WelcomeView);
    expect(wrapper.find('.splash-img').exists()).toBe(true);
  });

  it('renders tap hint text', () => {
    const wrapper = mount(WelcomeView);
    expect(wrapper.find('.tap-hint').text()).toContain('TOCAR PARA COMENZAR');
  });
});
