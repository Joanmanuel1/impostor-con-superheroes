import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../store';
import App from '../App.vue';

// Stub all child components and Ionic components
const stubs = {
  IonApp: { template: '<div><slot /></div>' },
  IonContent: { template: '<div><slot /></div>' },
  WelcomeView: { template: '<div data-testid="welcome" />' },
  Setup: { template: '<div data-testid="setup" />' },
  PlayerView: { template: '<div data-testid="player-view" />' },
  Voting: { template: '<div data-testid="voting" />' },
  EliminationReveal: { template: '<div data-testid="elimination-reveal" />' },
  Result: { template: '<div data-testid="result" />' },
};

describe('App.vue', () => {
  beforeEach(() => {
    store.gameState = 'welcome';
  });

  it('renders WelcomeView for welcome state', () => {
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="welcome"]').exists()).toBe(true);
  });

  it('renders Setup for setup state', () => {
    store.gameState = 'setup';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="setup"]').exists()).toBe(true);
  });

  it('renders PlayerView for show-word state', () => {
    store.gameState = 'show-word';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="player-view"]').exists()).toBe(true);
  });

  it('renders Voting for voting state', () => {
    store.gameState = 'voting';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="voting"]').exists()).toBe(true);
  });

  it('renders EliminationReveal for elimination-reveal state', () => {
    store.gameState = 'elimination-reveal';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="elimination-reveal"]').exists()).toBe(true);
  });

  it('renders Result for results state', () => {
    store.gameState = 'results';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="result"]').exists()).toBe(true);
  });

  it('defaults to WelcomeView for unknown state', () => {
    store.gameState = 'unknown-state';
    const wrapper = mount(App, { global: { stubs } });
    expect(wrapper.find('[data-testid="welcome"]').exists()).toBe(true);
  });
});
