import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../../store';
import Result from '../Result.vue';

const stubs = {
  IonIcon: { template: '<span />' },
};

describe('Result.vue', () => {
  beforeEach(() => {
    store.startGame(['Alice', 'Bob', 'Charlie']);
    // Force roles
    store.players.forEach(p => p.role = 'superhero');
    store.players[2].role = 'villain';
    store.gameState = 'results';
    store.config.impostorHint = true;
  });

  it('shows victory message for superheroes', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('¡HÉROES VENCEN!');
    expect(wrapper.text()).toContain('La verdad ha prevalecido hoy.');
  });

  it('shows victory message for villains', () => {
    store.winner = 'villains';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('¡VILLANOS GANAN!');
    expect(wrapper.text()).toContain('El mal ha triunfado esta vez.');
  });

  it('shows the selected word', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain(store.selectedWord);
  });

  it('shows the hint when impostorHint is true', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain(store.hint);
  });

  it('hides hint section when impostorHint is false', () => {
    store.config.impostorHint = false;
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    const statCards = wrapper.findAll('.result-stat-card');
    // Only word card, no hint card
    expect(statCards).toHaveLength(1);
  });

  it('shows villains section', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.find('.villain-box').exists()).toBe(true);
    expect(wrapper.text()).toContain('Charlie'); // villain
  });

  it('shows superheroes section', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.find('.superhero-box').exists()).toBe(true);
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
  });

  it('shows elimination round for eliminated villains', () => {
    store.eliminatedPlayers = [2]; // villain was eliminated
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('Eliminado en ronda 1');
  });

  it('shows "Eliminado" for eliminated heroes', () => {
    store.eliminatedPlayers = [0];
    store.winner = 'villains';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('Eliminado');
  });

  it('shows correct chip text based on winner', () => {
    store.winner = 'villains';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('VILLANOS GANADORES');
    expect(wrapper.text()).toContain('HÉROES CAÍDOS');
  });

  it('shows winning heroes/villains chip text', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.text()).toContain('VILLANOS DERROTADOS');
    expect(wrapper.text()).toContain('HÉROES VICTORIOSOS');
  });

  it('resets game on play again click', async () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    await wrapper.find('.start-action-btn').trigger('click');
    expect(store.gameState).toBe('setup');
    expect(store.players).toEqual([]);
  });

  it('shows avatar initial when no avatar path', () => {
    store.players[2].avatar = { color: '#000' };
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    expect(wrapper.find('.villain-avatar-initial').exists()).toBe(true);
  });

  it('getEliminationRound returns null for non-eliminated player', () => {
    store.winner = 'superheroes';
    const wrapper = mount(Result, { global: { stubs } });
    // Player 0 not eliminated, so no elimination badge
    const badges = wrapper.findAll('.eliminated-badge');
    // Only eliminated players should have badges
    expect(badges).toHaveLength(0);
  });
});
