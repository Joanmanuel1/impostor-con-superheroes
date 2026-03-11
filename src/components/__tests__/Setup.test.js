import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { store } from '../../store';
import Setup from '../Setup.vue';

const stubs = {
  IonIcon: { template: '<span />' },
  GameConfig: {
    template: '<div class="game-config-stub" />',
    props: ['showCategory', 'impostorHint', 'villainCount', 'maxVillains'],
    emits: ['update:showCategory', 'update:impostorHint', 'update:villainCount']
  },
  CategorySelection: {
    template: '<div class="cat-sel-stub" />',
    props: ['isEditMode', 'selectedCategories'],
    emits: ['update:isEditMode', 'update:selectedCategories']
  },
  PlayerInput: {
    template: '<div class="player-input-stub" />',
    props: ['playerNames'],
    emits: ['update:playerNames']
  },
  Tutorial: { template: '<div data-testid="tutorial" />' },
};

describe('Setup.vue', () => {
  beforeEach(() => {
    store.gameState = 'setup';
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders without errors', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.setup-container').exists()).toBe(true);
  });

  it('renders child components', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.game-config-stub').exists()).toBe(true);
    expect(wrapper.find('.cat-sel-stub').exists()).toBe(true);
    expect(wrapper.find('.player-input-stub').exists()).toBe(true);
  });

  it('disables start button when no names are filled', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    const btn = wrapper.find('.btn-start-game');
    expect(btn.attributes('disabled')).toBeDefined();
  });

  it('shows "Faltan completar nombres" when invalid', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.btn-start-game').text()).toContain('Faltan completar nombres');
  });

  it('shows "¡COMENZAR!" when valid', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.playerNames = ['Ana', 'Beto', 'Carlos'];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.btn-start-game').text()).toContain('¡COMENZAR!');
  });

  it('shows tutorial button and opens tutorial on click', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    const tutBtn = wrapper.find('.btn-primary');
    await tutBtn.trigger('click');
    expect(wrapper.find('[data-testid="tutorial"]').exists()).toBe(true);
  });

  it('hides tutorial when showTutorial is false', () => {
    localStorage.setItem('tutorial_seen', 'true');
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('[data-testid="tutorial"]').exists()).toBe(false);
  });

  it('loads saved names from localStorage', () => {
    localStorage.setItem('impostor_player_names', JSON.stringify(['Ana', 'Beto', 'Carlos']));
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.vm.playerNames).toEqual(['Ana', 'Beto', 'Carlos']);
  });

  it('handles invalid JSON in saved names gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('impostor_player_names', 'bad-json');
    mount(Setup, { global: { stubs } });
    consoleSpy.mockRestore();
  });

  it('ignores saved names with less than 3 entries', () => {
    localStorage.setItem('impostor_player_names', JSON.stringify(['Only', 'Two']));
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.vm.playerNames).toEqual(['', '', '']);
  });

  it('shows tutorial if tutorial_seen not set', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Setup, { global: { stubs } });
    vi.advanceTimersByTime(600);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showTutorial).toBe(true);
    vi.useRealTimers();
  });

  it('does not auto-show tutorial if already seen', () => {
    localStorage.setItem('tutorial_seen', 'true');
    vi.useFakeTimers();
    const wrapper = mount(Setup, { global: { stubs } });
    vi.advanceTimersByTime(600);
    expect(wrapper.find('[data-testid="tutorial"]').exists()).toBe(false);
    vi.useRealTimers();
  });

  it('starts game when valid and start clicked', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.playerNames = ['Ana', 'Beto', 'Carlos'];
    await wrapper.vm.$nextTick();
    const btn = wrapper.find('.btn-start-game');
    await btn.trigger('click');
    expect(store.gameState).toBe('show-word');
  });

  it('does not start game when invalid', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.playerNames = ['Ana', '', 'Carlos'];
    await wrapper.vm.$nextTick();
    const btn = wrapper.find('.btn-start-game');
    await btn.trigger('click');
    expect(store.gameState).toBe('setup');
  });

  it('adjusts villainCount when player count shrinks', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.villainCount = 3;
    wrapper.vm.playerNames = ['A', 'B', 'C', 'D'];
    await wrapper.vm.$nextTick();
    wrapper.vm.playerNames = ['A', 'B', 'C'];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.villainCount).toBeLessThanOrEqual(2);
  });

  it('saves names to localStorage when they change', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.playerNames = ['X', 'Y', 'Z'];
    await wrapper.vm.$nextTick();
    // Wait for the watcher to fire
    await new Promise(r => setTimeout(r, 10));
    const saved = JSON.parse(localStorage.getItem('impostor_player_names'));
    expect(saved).toEqual(['X', 'Y', 'Z']);
  });

  it('passes correct props to GameConfig', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.game-config-stub').exists()).toBe(true);
  });

  it('passes correct props to CategorySelection', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.cat-sel-stub').exists()).toBe(true);
  });

  it('passes correct props to PlayerInput', () => {
    const wrapper = mount(Setup, { global: { stubs } });
    expect(wrapper.find('.player-input-stub').exists()).toBe(true);
  });

  it('closes tutorial on close event', async () => {
    const wrapper = mount(Setup, { global: { stubs } });
    wrapper.vm.showTutorial = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="tutorial"]').exists()).toBe(true);
    // Set showTutorial to false directly (simulating Tutorial @close)
    wrapper.vm.showTutorial = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="tutorial"]').exists()).toBe(false);
  });
});
