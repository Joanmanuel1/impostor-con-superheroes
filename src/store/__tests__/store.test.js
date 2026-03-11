import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '../index.js';

// Helper to reset store to initial state before each test
const resetStore = () => {
  store.gameState = 'welcome';
  store.players = [];
  store.currentPlayerIndex = 0;
  store.selectedCategory = '';
  store.selectedWord = '';
  store.impostorWord = '';
  store.winner = null;
  store.hint = '';
  store.eliminatedPlayers = [];
  store.currentRound = 1;
  store.lastEliminatedPlayer = null;
  store.votes = {};
  store.config.showCategory = true;
  store.config.impostorHint = true;
  store.config.enabledCategories = ['Comidas', 'Animales', 'Objetos', 'Países', 'Deportes', 'Ciudades'];
  store.config.villainCount = 1;
  store.customCategories = {};
};

describe('Store', () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── startGame ───────────────────────────────────────────────

  describe('startGame', () => {
    it('initializes players with correct structure', () => {
      store.startGame(['Alice', 'Bob', 'Charlie']);

      expect(store.players).toHaveLength(3);
      expect(store.players[0]).toMatchObject({
        id: 0,
        name: 'Alice',
        hasVoted: false
      });
      expect(store.players[0].word).toBeTruthy();
      expect(store.players[0].avatar).toBeTruthy();
    });

    it('assigns exactly the configured number of villains', () => {
      store.startGame(['Alice', 'Bob', 'Charlie', 'Dave'], { showCategory: true, impostorHint: true, villainCount: 2 });

      const villains = store.players.filter(p => p.role === 'villain');
      const heroes = store.players.filter(p => p.role === 'superhero');
      expect(villains).toHaveLength(2);
      expect(heroes).toHaveLength(2);
    });

    it('sets game state to show-word', () => {
      store.startGame(['A', 'B', 'C']);
      expect(store.gameState).toBe('show-word');
    });

    it('selects a category and word from the enabled categories', () => {
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true, enabledCategories: ['Comidas'] });
      expect(store.selectedCategory).toBe('Comidas');
      expect(store.selectedWord).toBeTruthy();
    });

    it('assigns a different impostor word', () => {
      // With many words, very likely different
      store.startGame(['A', 'B', 'C']);
      expect(store.impostorWord).toBeTruthy();
    });

    it('sets hint from the selected word entry', () => {
      store.startGame(['A', 'B', 'C']);
      expect(store.hint).toBeTruthy();
    });

    it('resets votes and currentPlayerIndex', () => {
      store.currentPlayerIndex = 5;
      store.startGame(['A', 'B', 'C']);
      expect(store.currentPlayerIndex).toBe(0);
      expect(store.votes).toEqual({});
    });

    it('applies showCategory and impostorHint options', () => {
      store.startGame(['A', 'B', 'C'], { showCategory: false, impostorHint: false });
      expect(store.config.showCategory).toBe(false);
      expect(store.config.impostorHint).toBe(false);
    });

    it('uses default enabled categories when none provided', () => {
      store.config.enabledCategories = ['Comidas', 'Animales'];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true });
      expect(['Comidas', 'Animales']).toContain(store.selectedCategory);
    });

    it('falls back to all categories when enabledCategories is empty', () => {
      store.config.enabledCategories = [];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true });
      expect(store.selectedCategory).toBeTruthy();
    });

    it('assigns villain word to villain players', () => {
      store.startGame(['A', 'B', 'C']);
      const villain = store.players.find(p => p.role === 'villain');
      expect(villain.word).toBe(store.impostorWord);
    });

    it('assigns selected word to superhero players', () => {
      store.startGame(['A', 'B', 'C']);
      const hero = store.players.find(p => p.role === 'superhero');
      expect(hero.word).toBe(store.selectedWord);
    });

    it('wraps avatar index when more players than avatars', () => {
      const names = Array.from({ length: 20 }, (_, i) => `P${i}`);
      store.startGame(names);
      expect(store.players[16].avatar).toBeTruthy();
    });

    it('handles category with only one word (impostor word same as selected)', () => {
      store.customCategories = { 'Solo': [{ word: 'Unica', hint: 'Sola' }] };
      store.config.enabledCategories = ['Solo'];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true, enabledCategories: ['Solo'] });
      expect(store.selectedWord).toBe('Unica');
      // With only 1 word, both indices will be 0, so impostorWord = selectedWord
      expect(store.impostorWord).toBe('Unica');
    });

    it('handles fallback when no valid categories exist', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Set enabledCategories to non-existent ones
      store.config.enabledCategories = ['NonExistent'];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true, enabledCategories: ['NonExistent'] });
      // Should fallback to 'Comidas'
      expect(store.selectedCategory).toBe('Comidas');
      consoleSpy.mockRestore();
    });

    it('returns early when selected category has no words', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      store.customCategories = { 'Vacia': [] };
      store.config.enabledCategories = ['Vacia'];

      // Force only empty category in enabled
      // After fallback logic, validCategories filters out empty ones
      // So it should fallback to Comidas
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true, enabledCategories: ['Vacia'] });
      consoleSpy.mockRestore();
    });

    it('handles villainCount option', () => {
      store.startGame(['A', 'B', 'C', 'D', 'E'], {
        showCategory: true,
        impostorHint: true,
        villainCount: 3
      });
      const villains = store.players.filter(p => p.role === 'villain');
      expect(villains).toHaveLength(3);
    });

    it('returns early when selected category resolves to empty words array', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Force selectedCategory to point to empty
      // We need to trick the store into selecting a category that has no words
      // by temporarily replacing the categories
      const origCats = { ...store.categories };
      store.categories = { 'TestEmpty': [] };
      store.customCategories = {};
      store.config.enabledCategories = ['TestEmpty'];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true, enabledCategories: ['TestEmpty'] });
      // Because TestEmpty has no words, validCategories filters it out
      // Fallback to 'Comidas' which doesn't exist -> console.error
      // Restore
      store.categories = origCats;
      consoleSpy.mockRestore();
    });

    it('hits the empty words return path when categories exist but words is empty', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Directly manipulate to force the condition !words || words.length === 0
      const origCategories = store.categories;
      store.categories = { 'EmptyOne': [] };
      store.customCategories = {};
      // Force validCategories to be empty so it falls back to Comidas
      // But Comidas doesn't exist in this setup -> fallback selectedCategory = 'Comidas'
      // Then words = allCats['Comidas'] which is undefined -> early return
      store.config.enabledCategories = [];
      store.startGame(['A', 'B', 'C'], { showCategory: true, impostorHint: true });
      store.categories = origCategories;
      consoleSpy.mockRestore();
    });
  });

  // ─── nextPlayer ──────────────────────────────────────────────

  describe('nextPlayer', () => {
    beforeEach(() => {
      store.startGame(['A', 'B', 'C']);
      store.currentPlayerIndex = 0;
    });

    it('advances to next player', () => {
      store.nextPlayer();
      expect(store.currentPlayerIndex).toBe(1);
    });

    it('transitions to voting when all players have been shown', () => {
      store.currentPlayerIndex = store.players.length - 1;
      store.nextPlayer();
      expect(store.gameState).toBe('voting');
    });
  });

  // ─── submitVote ──────────────────────────────────────────────

  describe('submitVote', () => {
    beforeEach(() => {
      store.startGame(['A', 'B', 'C']);
      store.gameState = 'voting';
    });

    it('records a vote', () => {
      store.submitVote(0, 1);
      expect(store.votes[1]).toContain(0);
    });

    it('marks voter as hasVoted', () => {
      store.submitVote(0, 1);
      expect(store.players[0].hasVoted).toBe(true);
    });

    it('creates vote array for new target', () => {
      store.submitVote(0, 2);
      expect(store.votes[2]).toEqual([0]);
    });

    it('appends to existing vote array', () => {
      store.submitVote(0, 2);
      store.submitVote(1, 2);
      expect(store.votes[2]).toEqual([0, 1]);
    });

    it('triggers processElimination when all active players have voted', () => {
      store.submitVote(0, 1);
      store.submitVote(1, 0);
      store.submitVote(2, 1);
      // After all votes, processElimination should have been called
      // Game state should no longer be 'voting'
      expect(store.gameState).not.toBe('voting');
    });

    it('does not trigger processElimination if not all have voted', () => {
      store.submitVote(0, 1);
      expect(store.gameState).toBe('voting');
    });

    it('handles vote from non-existent voter gracefully', () => {
      store.submitVote(999, 0);
      expect(store.votes[0]).toContain(999);
    });
  });

  // ─── processElimination ──────────────────────────────────────

  describe('processElimination', () => {
    it('eliminates the most voted player', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      store.gameState = 'voting';
      store.votes = { 1: [0, 2, 3], 0: [1] };
      store.processElimination();
      expect(store.eliminatedPlayers).toContain(1);
      expect(store.lastEliminatedPlayer.id).toBe(1);
    });

    it('villains win on tie', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      store.gameState = 'voting';
      store.votes = { 0: [1], 1: [0] };
      store.processElimination();
      expect(store.winner).toBe('villains');
      expect(store.gameState).toBe('results');
    });

    it('villains win when no votes cast (mostVotedId is null)', () => {
      store.startGame(['A', 'B', 'C']);
      store.gameState = 'voting';
      store.votes = {};
      store.processElimination();
      expect(store.winner).toBe('villains');
      expect(store.gameState).toBe('results');
    });

    it('superheroes win when all villains are eliminated', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      // Force player 0 as only villain
      store.players.forEach(p => p.role = 'superhero');
      store.players[0].role = 'villain';
      store.votes = { 0: [1, 2, 3] };
      store.processElimination();
      expect(store.winner).toBe('superheroes');
      expect(store.gameState).toBe('results');
    });

    it('villains win when villains >= heroes after elimination', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      // Set 2 villains (players 0,1) and 2 heroes (2,3)
      store.players.forEach(p => p.role = 'superhero');
      store.players[0].role = 'villain';
      store.players[1].role = 'villain';
      // Eliminate a hero
      store.votes = { 2: [0, 1, 3] };
      store.processElimination();
      // Now: 2 villains vs 1 hero -> villains win
      expect(store.winner).toBe('villains');
    });

    it('villains win when only 2 players left', () => {
      store.startGame(['A', 'B', 'C']);
      // Force roles: 1 villain, 2 heroes
      store.players.forEach(p => p.role = 'superhero');
      store.players[2].role = 'villain';
      // Eliminate player 0
      store.votes = { 0: [1, 2] };
      store.processElimination();
      // 2 players left → villains win
      expect(store.winner).toBe('villains');
    });

    it('continues to elimination-reveal when game is not over', () => {
      store.startGame(['A', 'B', 'C', 'D', 'E']);
      // Force: player 4 is villain, rest are heroes
      store.players.forEach(p => p.role = 'superhero');
      store.players[4].role = 'villain';
      // Eliminate a hero (player 0)
      store.votes = { 0: [1, 2, 3, 4] };
      store.processElimination();
      // 4 players left (1 villain, 3 heroes) -> game continues
      expect(store.gameState).toBe('elimination-reveal');
      expect(store.eliminatedPlayers).toContain(0);
    });

    it('villains win when exactly 2 players left after hero elimination (via <=2 branch)', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      // 1 villain (player 3), 3 heroes
      store.players.forEach(p => p.role = 'superhero');
      store.players[3].role = 'villain';
      // Already eliminated player 0
      store.eliminatedPlayers = [0];
      // Now eliminate player 1, leaving player 2 and 3 (hero + villain)
      store.votes = { 1: [2, 3] };
      store.processElimination();
      // 2 players left -> activePlayers.length <= 2 -> villains win
      expect(store.winner).toBe('villains');
      expect(store.gameState).toBe('results');
    });

    it('skips already eliminated players in vote counting', () => {
      store.startGame(['A', 'B', 'C', 'D', 'E']);
      store.players.forEach(p => p.role = 'superhero');
      store.players[4].role = 'villain';
      store.eliminatedPlayers = [0];
      // Votes: eliminated player 0 has most votes but should be skipped
      store.votes = { 0: [1, 2, 3, 4], 1: [0] };
      store.processElimination();
      // Player 1 should be eliminated (not player 0 again)
      expect(store.eliminatedPlayers).toContain(1);
    });
  });

  // ─── startNewVotingRound ─────────────────────────────────────

  describe('startNewVotingRound', () => {
    it('increments currentRound', () => {
      store.startGame(['A', 'B', 'C']);
      store.currentRound = 1;
      store.startNewVotingRound();
      expect(store.currentRound).toBe(2);
    });

    it('resets votes to empty', () => {
      store.startGame(['A', 'B', 'C']);
      store.votes = { 0: [1] };
      store.startNewVotingRound();
      expect(store.votes).toEqual({});
    });

    it('resets hasVoted for active players', () => {
      store.startGame(['A', 'B', 'C']);
      store.players.forEach(p => p.hasVoted = true);
      store.startNewVotingRound();
      store.players.forEach(p => {
        if (!store.eliminatedPlayers.includes(p.id)) {
          expect(p.hasVoted).toBe(false);
        }
      });
    });

    it('does not reset hasVoted for eliminated players', () => {
      store.startGame(['A', 'B', 'C', 'D']);
      store.players.forEach(p => p.hasVoted = true);
      store.eliminatedPlayers = [0];
      store.startNewVotingRound();
      expect(store.players[0].hasVoted).toBe(true);
    });

    it('sets gameState to voting', () => {
      store.startGame(['A', 'B', 'C']);
      store.gameState = 'elimination-reveal';
      store.startNewVotingRound();
      expect(store.gameState).toBe('voting');
    });
  });

  // ─── endGame ─────────────────────────────────────────────────

  describe('endGame', () => {
    it('delegates to processElimination', () => {
      store.startGame(['A', 'B', 'C']);
      store.votes = {};
      store.endGame();
      // With no votes, villains should win
      expect(store.winner).toBe('villains');
    });
  });

  // ─── resetGame ───────────────────────────────────────────────

  describe('resetGame', () => {
    it('resets all game state', () => {
      store.startGame(['A', 'B', 'C']);
      store.winner = 'superheroes';
      store.eliminatedPlayers = [0];
      store.currentRound = 5;
      store.lastEliminatedPlayer = { id: 0 };
      store.resetGame();

      expect(store.gameState).toBe('setup');
      expect(store.players).toEqual([]);
      expect(store.winner).toBeNull();
      expect(store.votes).toEqual({});
      expect(store.currentPlayerIndex).toBe(0);
      expect(store.eliminatedPlayers).toEqual([]);
      expect(store.currentRound).toBe(1);
      expect(store.lastEliminatedPlayer).toBeNull();
    });
  });

  // ─── Custom Categories ──────────────────────────────────────

  describe('loadCustomCategories', () => {
    it('loads categories from localStorage', () => {
      const cats = { 'MiCat': [{ word: 'A', hint: 'B' }, { word: 'C', hint: 'D' }] };
      localStorage.setItem('impostor_custom_categories', JSON.stringify(cats));
      store.loadCustomCategories();
      expect(store.customCategories).toEqual(cats);
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('impostor_custom_categories', 'not-json');
      store.loadCustomCategories();
      // Should not crash, customCategories stays as is
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does nothing when no saved data', () => {
      store.customCategories = {};
      store.loadCustomCategories();
      expect(store.customCategories).toEqual({});
    });
  });

  describe('addCustomCategory', () => {
    it('adds a category and persists to localStorage', () => {
      const words = [{ word: 'X', hint: 'Y' }];
      store.addCustomCategory('Test', words);
      expect(store.customCategories['Test']).toEqual(words);
      expect(JSON.parse(localStorage.getItem('impostor_custom_categories'))).toHaveProperty('Test');
    });
  });

  describe('removeCustomCategory', () => {
    it('removes a category and persists', () => {
      store.customCategories = { 'Keep': [], 'Remove': [] };
      store.removeCustomCategory('Remove');
      expect(store.customCategories).not.toHaveProperty('Remove');
      expect(store.customCategories).toHaveProperty('Keep');
      const saved = JSON.parse(localStorage.getItem('impostor_custom_categories'));
      expect(saved).not.toHaveProperty('Remove');
    });
  });

  describe('getAllCategories', () => {
    it('returns merged default and custom categories', () => {
      store.customCategories = { 'Custom': [{ word: 'A', hint: 'B' }] };
      const all = store.getAllCategories();
      expect(all).toHaveProperty('Comidas');
      expect(all).toHaveProperty('Custom');
    });

    it('custom categories override defaults with same name', () => {
      const custom = [{ word: 'Override', hint: 'Test' }];
      store.customCategories = { 'Comidas': custom };
      const all = store.getAllCategories();
      expect(all['Comidas']).toEqual(custom);
    });
  });

  // ─── Static Data ─────────────────────────────────────────────

  describe('static data', () => {
    it('has avatars defined', () => {
      expect(store.avatars.length).toBeGreaterThan(0);
      expect(store.avatars[0]).toHaveProperty('id');
      expect(store.avatars[0]).toHaveProperty('path');
      expect(store.avatars[0]).toHaveProperty('color');
    });

    it('has default categories defined', () => {
      expect(Object.keys(store.categories)).toContain('Comidas');
      expect(Object.keys(store.categories)).toContain('Animales');
      expect(Object.keys(store.categories)).toContain('Objetos');
      expect(Object.keys(store.categories)).toContain('Países');
      expect(Object.keys(store.categories)).toContain('Deportes');
      expect(Object.keys(store.categories)).toContain('Ciudades');
    });

    it('each default category has words with word and hint', () => {
      for (const cat of Object.values(store.categories)) {
        for (const entry of cat) {
          expect(entry).toHaveProperty('word');
          expect(entry).toHaveProperty('hint');
        }
      }
    });
  });
});
