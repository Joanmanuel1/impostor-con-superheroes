<template>
  <div class="game-card voting-card container-fluid">
    <div class="row text-center mb-4">
      <div class="col-12">
        <div class="header-icon-glow mx-auto mb-3">
          <div class="icon-inner">
            <ion-icon :icon="checkboxOutline"></ion-icon>
          </div>
        </div>
        <h1 class="gradient-text h2 mb-1">Fase de Votación</h1>
        <p class="text-secondary small fw-bold text-uppercase letter-spacing-sm mb-3">Ronda {{ store.currentRound }}</p>

        <div v-if="store.eliminatedPlayers.length > 0" class="eliminated-pill mt-2">
          <ion-icon :icon="skullOutline" class="me-1"></ion-icon>
          <span>{{ store.eliminatedPlayers.length }} caído{{ store.eliminatedPlayers.length > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div v-for="voter in activePlayers" :key="voter.id" class="col-12">
        <div class="voter-card-premium" :class="{ 'has-voted': voter.hasVoted }">
          <div class="voter-header d-flex align-items-center">
            <div class="voter-avatar me-3" :style="{ backgroundColor: voter.avatar?.color || '#6366f1' }">
              <img v-if="voter.avatar?.path" :src="voter.avatar.path" alt="Avatar" class="voter-avatar-img">
              <span v-else class="voter-initial">{{ voter.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="voter-meta flex-grow-1">
              <h5 class="mb-0 fw-bold">{{ voter.name }}</h5>
              <span class="status-badge" :class="voter.hasVoted ? 'voted' : 'pending'">
                {{ voter.hasVoted ? 'Voto Emitido' : 'Esperando...' }}
              </span>
            </div>
            <div class="voted-tick" v-if="voter.hasVoted">
              <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
            </div>
          </div>

          <transition name="expand-fade">
            <div v-if="!voter.hasVoted" class="voting-actions mt-3 pt-3 border-top border-secondary border-opacity-10">
              <p class="small fw-bold">SELECCIONA PARA ACUSAR:</p>
              <div class="voting-grid">
                <button v-for="target in activePlayers.filter(p => p.id !== voter.id)" :key="target.id"
                  class="btn vote-target-card d-flex flex-column align-items-center justify-content-center gap-2"
                  @click="store.submitVote(voter.id, target.id)">
                  <div class="vote-target-avatar-wrapper">
                    <div class="vote-target-avatar" :style="{ backgroundColor: target.avatar?.color || '#6366f1' }">
                      <img v-if="target.avatar?.path" :src="target.avatar.path" alt="Avatar" class="vote-avatar-img">
                      <span v-else class="vote-avatar-initial">{{ target.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <span class="target-name">{{ target.name }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import {
  checkboxOutline,
  checkmarkCircleOutline,
  skullOutline
} from 'ionicons/icons';
import { store } from '../store';

const activePlayers = computed(() => store.players.filter(p => !store.eliminatedPlayers.includes(p.id)));
</script>

<style scoped>
.voting-card {}

.header-icon-glow {
  width: 70px;
  height: 70px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary);
  filter: blur(25px);
  opacity: 0.4;
  border-radius: 50%;
  z-index: 0;
}

.icon-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: var(--primary);
  z-index: 1;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.eliminated-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fb7185;
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.voter-card-premium {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 1.25rem;
  transition: all 0.4s ease;
}

.voter-card-premium.has-voted {
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);
  opacity: 0.8;
}

.voter-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.voter-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.voter-initial {
  font-weight: 800;
  color: white;
  font-size: 1.2rem;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge.pending {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.status-badge.voted {
  color: var(--success);
  background: rgba(34, 197, 94, 0.1);
}

.voted-tick {
  color: var(--success);
  font-size: 1.8rem;
}

/* Voting Grid */
.voting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
  gap: 0.75rem;
}

.vote-target-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 0.75rem 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-light);
  width: 100%;
  height: 100%;
}

.vote-target-card:active {
  background: var(--primary);
  border-color: var(--primary);
  transform: scale(0.95);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

.vote-target-avatar-wrapper {
  position: relative;
}

.vote-target-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.target-name {
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.vote-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vote-avatar-initial {
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
}

/* Animations */
.expand-fade-enter-active {
  transition: all 0.4s ease-out;
}

.expand-fade-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-fade-enter-to {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}
</style>
