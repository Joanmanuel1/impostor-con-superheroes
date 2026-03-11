import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import EliminationReveal from '../EliminationReveal.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('EliminationReveal.vue', () => {
  beforeEach(() => {
    store.startGame(['Alice', 'Bob', 'Charlie', 'Dave', 'Eve']);
    // Force roles
    store.players.forEach(p => p.role = 'superhero');
    store.players[4].role = 'villain';
    // Simulate elimination of player 0
    store.lastEliminatedPlayer = store.players[0];
    store.eliminatedPlayers = [0];
    store.gameState = 'elimination-reveal';
    store.currentRound = 1;
  });

  it('shows eliminated player name', () => {
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('Alice');
  });

  it('shows role of eliminated player', () => {
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('ERA UN SUPERHÉROE');
  });

  it('shows VILLANO label when villain is eliminated', () => {
    store.lastEliminatedPlayer = store.players[4];
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('ERA UN VILLANO');
  });

  it('shows remaining villains count', () => {
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('1');
    expect(wrapper.text()).toContain('villano');
  });

  it('pluralizes villains correctly', () => {
    store.players[3].role = 'villain';
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('villanos');
    expect(wrapper.text()).toContain('ocultos');
  });

  it('does not show remaining villains alert when none left', () => {
    // Eliminate the villain
    store.eliminatedPlayers = [0, 4];
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.find('.alert-box').exists()).toBe(false);
  });

  it('shows current round and active player count', () => {
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.text()).toContain('RONDA');
    expect(wrapper.text()).toContain('JUGADORES ACTIVOS');
  });

  it('calls startNewVotingRound on button click', async () => {
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    const btn = wrapper.find('.btn-continue');
    await btn.trigger('click');
    expect(store.gameState).toBe('voting');
    expect(store.currentRound).toBe(2);
  });

  it('shows avatar initial when no avatar path', () => {
    store.lastEliminatedPlayer = { ...store.players[0], avatar: { color: '#000' } };
    const wrapper = mount(EliminationReveal, { global: { stubs } });
    expect(wrapper.find('.avatar-initial-xl').text()).toBe('A');
  });
});
