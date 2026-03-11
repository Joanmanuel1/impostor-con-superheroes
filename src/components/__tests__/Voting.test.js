import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import Voting from '../Voting.vue';

const stubs = {
  IonButton: { template: '<button><slot /></button>' },
  IonIcon: { template: '<span />' },
};

describe('Voting.vue', () => {
  beforeEach(() => {
    store.startGame(['Alice', 'Bob', 'Charlie', 'Dave']);
    store.gameState = 'voting';
    store.eliminatedPlayers = [];
  });

  it('renders all active players', () => {
    const wrapper = mount(Voting, { global: { stubs } });
    const voterCards = wrapper.findAll('.voter-card-premium');
    expect(voterCards).toHaveLength(4);
  });

  it('filters out eliminated players', () => {
    store.eliminatedPlayers = [0];
    const wrapper = mount(Voting, { global: { stubs } });
    const voterCards = wrapper.findAll('.voter-card-premium');
    expect(voterCards).toHaveLength(3);
  });

  it('shows current round', () => {
    store.currentRound = 3;
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.text()).toContain('Ronda 3');
  });

  it('shows eliminated count when players have been eliminated', () => {
    store.eliminatedPlayers = [0];
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.text()).toContain('1 caído');
  });

  it('pluralizes eliminated count correctly', () => {
    store.eliminatedPlayers = [0, 1];
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.text()).toContain('2 caídos');
  });

  it('does not show eliminated pill when no one eliminated', () => {
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.find('.eliminated-pill').exists()).toBe(false);
  });

  it('shows voting actions for players who have not voted', () => {
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.findAll('.voting-actions').length).toBeGreaterThan(0);
  });

  it('marks player as voted after voting', async () => {
    const wrapper = mount(Voting, { global: { stubs } });
    // Find first vote target button and click it
    const voteBtn = wrapper.find('.vote-target-card');
    await voteBtn.trigger('click');
    // Check voted status
    const votedCards = wrapper.findAll('.has-voted');
    expect(votedCards.length).toBeGreaterThanOrEqual(1);
  });

  it('shows avatar initial when no avatar path', () => {
    store.players[0].avatar = { color: '#000' };
    const wrapper = mount(Voting, { global: { stubs } });
    expect(wrapper.find('.voter-initial').text()).toBe('A');
  });
});
