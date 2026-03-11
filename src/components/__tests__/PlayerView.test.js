import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import PlayerView from '../PlayerView.vue';

const stubs = {
  IonButton: { template: '<button><slot /></button>' },
  IonIcon: { template: '<span />' },
};

describe('PlayerView.vue', () => {
  beforeEach(() => {
    store.startGame(['Alice', 'Bob', 'Charlie']);
    store.currentPlayerIndex = 0;
  });

  it('renders the current player name', () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    expect(wrapper.text()).toContain('Alice');
  });

  it('shows fingerprint (hidden state) initially', () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    expect(wrapper.find('.hidden-ui').exists()).toBe(true);
  });

  it('reveals word on button click (REVELAR MISIÓN)', async () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    const btn = wrapper.find('.btn-reveal-action');
    await btn.trigger('click');
    expect(wrapper.find('.revealed-ui').exists()).toBe(true);
  });

  it('shows role badge when revealed', async () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.btn-reveal-action').trigger('click');
    expect(wrapper.find('.role-badge').exists()).toBe(true);
  });

  it('clicking reveal box toggles reveal when hidden', async () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.reveal-box-premium').trigger('click');
    expect(wrapper.find('.revealed-ui').exists()).toBe(true);
  });

  it('clicking reveal box advances to next player when revealed', async () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    // First click reveals
    await wrapper.find('.reveal-box-premium').trigger('click');
    // Second click should advance (next)
    await wrapper.find('.reveal-box-premium').trigger('click');
    expect(store.currentPlayerIndex).toBe(1);
  });

  it('shows continue button after reveal and advances on click', async () => {
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.btn-reveal-action').trigger('click');
    // Now button should say ENTENDIDO  
    expect(wrapper.text()).toContain('ENTENDIDO');
    await wrapper.find('.btn-reveal-action').trigger('click');
    expect(store.currentPlayerIndex).toBe(1);
  });

  it('shows category when showCategory is true', () => {
    store.config.showCategory = true;
    const wrapper = mount(PlayerView, { global: { stubs } });
    expect(wrapper.text()).toContain(store.selectedCategory);
  });

  it('hides category when showCategory is false', () => {
    store.config.showCategory = false;
    const wrapper = mount(PlayerView, { global: { stubs } });
    expect(wrapper.find('.status-glass').exists()).toBe(false);
  });

  it('shows hint for villain when impostorHint is true', async () => {
    // Find villain
    const villainIndex = store.players.findIndex(p => p.role === 'villain');
    store.currentPlayerIndex = villainIndex;
    store.config.impostorHint = true;
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.btn-reveal-action').trigger('click');
    expect(wrapper.text()).toContain(store.hint);
  });

  it('shows SIN PISTA for villain when impostorHint is false', async () => {
    const villainIndex = store.players.findIndex(p => p.role === 'villain');
    store.currentPlayerIndex = villainIndex;
    store.config.impostorHint = false;
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.btn-reveal-action').trigger('click');
    expect(wrapper.text()).toContain('SIN PISTA');
  });

  it('shows the word for superhero players', async () => {
    const heroIndex = store.players.findIndex(p => p.role === 'superhero');
    store.currentPlayerIndex = heroIndex;
    const wrapper = mount(PlayerView, { global: { stubs } });
    await wrapper.find('.btn-reveal-action').trigger('click');
    expect(wrapper.text()).toContain(store.selectedWord);
  });

  it('shows avatar initial when no avatar path', () => {
    store.players[0].avatar = { color: '#000' };
    const wrapper = mount(PlayerView, { global: { stubs } });
    expect(wrapper.find('.avatar-initial-large').text()).toBe('A');
  });
});
