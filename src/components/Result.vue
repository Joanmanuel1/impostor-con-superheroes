<template>
  <div class="game-card result-card container-fluid text-center">
    <div class="row">
      <div class="col-12">
        <h5 class="display-6 fw-900 victory-message" :class="store.winner">
          {{ store.winner === 'superheroes' ? '¡HÉROES VENCEN!' : '¡VILLANOS GANAN!' }}
        </h5>
        <p class="lead opacity-75">
          {{ store.winner === 'superheroes' ? 'La verdad ha prevalecido hoy.' : 'El mal ha triunfado esta vez.' }}
        </p>
      </div>
    </div>

    <div class="row mb-2 g-3">
      <div class="col-12">
        <div class="result-stat-card">
          <span class="stat-label">LA PALABRA ERA</span>
          <span class="stat-value text-success fw-bold">{{ store.selectedWord }}</span>
        </div>
      </div>
      <div class="col-12" v-if="store.config.impostorHint">
        <div class="result-stat-card">
          <span class="stat-label">LA PISTA ERA</span>
          <span class="stat-value text-danger fw-bold">{{ store.hint }}</span>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12 px-2">

        <!-- Villains Section -->
        <div class="revelation-box villain-box mb-4">
          <div class="revelation-chip mb-3">
            {{ store.winner === 'villains' ? 'VILLANOS GANADORES' :
              'VILLANOS DERROTADOS' }}</div>
          <div class="villains-grid">
            <div v-for="villain in villains" :key="villain.id" class="villain-card-result">
              <div class="villain-avatar-reveal" :style="{ backgroundColor: villain.avatar?.color || '#f43f5e' }">
                <img v-if="villain.avatar?.path" :src="villain.avatar.path" alt="Avatar" class="villain-avatar-img">
                <span v-else class="villain-avatar-initial">{{ villain.name.charAt(0).toUpperCase() }}</span>
              </div>
              <h5 class="mb-0 fw-900 mt-2">{{ villain.name }}</h5>
              <span v-if="store.eliminatedPlayers.includes(villain.id)" class="eliminated-badge">Eliminado en ronda {{
                getEliminationRound(villain.id) }}</span>
            </div>
          </div>
        </div>

        <!-- Superheroes Section -->
        <div class="revelation-box superhero-box">
          <div class="revelation-chip superhero-chip mb-3">
            {{ store.winner === 'superheroes' ? 'HÉROES VICTORIOSOS' :
              'HÉROES CAÍDOS' }}</div>
          <div class="villains-grid">
            <div v-for="hero in superheroes" :key="hero.id" class="villain-card-result">
              <div class="villain-avatar-reveal superhero-avatar-reveal"
                :style="{ backgroundColor: hero.avatar?.color || '#10b981' }">
                <img v-if="hero.avatar?.path" :src="hero.avatar.path" alt="Avatar" class="villain-avatar-img">
                <span v-else class="villain-avatar-initial">{{ hero.name.charAt(0).toUpperCase() }}</span>
              </div>
              <h5 class="mb-0 fw-900 mt-2">{{ hero.name }}</h5>
              <span v-if="store.eliminatedPlayers.includes(hero.id)" class="eliminated-badge">Eliminado </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="row mt-auto border-top border-secondary border-opacity-10">
      <div class="col-12">
        <button @click="store.resetGame()" class="btn start-action-btn w-100 py-3 mb-3 shadow-lg">
          <ion-icon :icon="refreshOutline" class="me-2"></ion-icon>
          <span class="fw-bold h5 mb-0">Jugar de nuevo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  shieldCheckmarkOutline,
  flameOutline,
  refreshOutline,
  skullOutline
} from 'ionicons/icons';
import { store } from '../store';

const villains = computed(() => store.players.filter(p => p.role === 'villain'));
const superheroes = computed(() => store.players.filter(p => p.role === 'superhero'));

const getEliminationRound = (playerId) => {
  const eliminationIndex = store.eliminatedPlayers.indexOf(playerId);
  return eliminationIndex >= 0 ? eliminationIndex + 1 : null;
};
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
}

.victory-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 1.5rem;
}

.victory-icon-wrapper.superheroes {
  color: var(--success);
  box-shadow: 0 0 50px rgba(34, 197, 94, 0.3);
  border: 4px solid rgba(34, 197, 94, 0.2);
}

.victory-icon-wrapper.villains {
  color: var(--danger);
  box-shadow: 0 0 50px rgba(239, 68, 68, 0.3);
  border: 4px solid rgba(239, 68, 68, 0.2);
}

.victory-message.superheroes {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.victory-message.villains {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 1.1rem;
  text-transform: uppercase;
  color: white;
}

.revelation-box {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 2rem 1.5rem;
  position: relative;
}

.revelation-box.superhero-box {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
  border: 1px solid rgba(16, 185, 129, 0.08);
}

.revelation-box.villain-box {
  background: linear-gradient(180deg, rgba(244, 63, 94, 0.05) 0%, transparent 100%);
  border: 1px solid rgba(244, 63, 94, 0.08);
}

.revelation-chip {
  background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
  display: inline-block;
}

.revelation-chip.superhero-chip {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.villain-avatar-reveal {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.4);
}

.superhero-avatar-reveal {
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.villain-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.villain-avatar-initial {
  color: white;
  font-weight: 900;
  font-size: 1.8rem;
}

.villains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.villain-card-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.eliminated-badge {
  display: inline-block;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.start-action-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border: none;
  color: white;
  border-radius: 1.5rem;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.start-action-btn:active {
  transform: scale(0.96);
}

.fw-900 {
  font-weight: 900;
}

.letter-spacing-lg {
  letter-spacing: 0.2em;
}
</style>
