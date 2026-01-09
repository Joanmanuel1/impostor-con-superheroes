<template>
  <div class="game-card player-view-card container-fluid">


    <!-- Header Section -->
    <div class="row text-center">
      <div class="col-12">
        <div class="player-avatar-wrapper mx-auto mb-3">
          <div class="avatar-ring"></div>
          <div class="avatar-core" :style="{ backgroundColor: currentPlayer.avatar?.color || '#6366f1' }">
            <img v-if="currentPlayer.avatar?.path" :src="currentPlayer.avatar.path" alt="Avatar"
              class="avatar-character-img">
            <span v-else class="avatar-initial-large">{{ currentPlayer.name.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <h2 class="display-6 fw-900 mb-1 text-gradient-silver">{{ currentPlayer.name }}</h2>
        <p class="small letter-spacing-sm">OPERACIÓN EN CURSO</p>
      </div>
    </div>
    <!-- Top Indicator -->
    <div v-if="store.config.showCategory" class="d-flex align-items-center justify-content-center">
      <div class="status-glass font-900 mb-3">
        <span class="ms-1 fw-900 text-primary"> La categoría es {{ store.selectedCategory }}</span>
      </div>
    </div>
    <!-- Reveal Area -->
    <div class="row mb-5">
      <div class="col-12 d-flex justify-content-center px-4">
        <div
          class="reveal-box-premium flex-column d-flex align-items-center justify-content-center w-100 p-4 animate__animated animate__pulse animate__infinite"
          :class="[currentPlayer.role, { 'revealed': showWord }]" @click="handleInteraction"
          style="animation-duration: 2s;">
          <transition name="reveal-transition" mode="out-in">
            <!-- REVEALED STATE -->
            <div v-if="showWord" key="content" class="revealed-ui text-center animate__animated animate__zoomIn">
              <div class="role-badge mb-4" :class="currentPlayer.role">
                <ion-icon :icon="currentPlayer.role === 'villain' ? flameOutline : shieldOutline"></ion-icon>
                <span>{{ currentPlayer.role === 'villain' ? 'VILLANO' : 'SUPERHÉROE' }}</span>
              </div>

              <div class="word-card-glamour">
                <template v-if="currentPlayer.role === 'superhero'">
                  <h1 class="display-1 fw-900 gradient-text mb-0">{{ currentPlayer.word }}</h1>
                </template>
                <template v-else-if="currentPlayer.role === 'villain'">
                  <div v-if="store.config.impostorHint">
                    <h1 class="display-2 fw-900 villain-text-glow mb-0">{{ store.hint }}</h1>
                    <p class="text-danger-premium small fw-900 mt-3 mb-0">USA ESTA PISTA PARA CAMUFLARTE </p>
                    <p class="text-danger-premium small fw-900 mt-3 mb-0">Recuerda que es solo para darte una
                      aproximación
                      a la palabra verdadera </p>
                  </div>
                  <div v-else>
                    <h1 class="display-4 fw-900 villain-text-glow mb-0">SIN PISTA</h1>
                    <p class="text-danger-premium small fw-900 mt-3 mb-0">CONFÍA EN TU INSTINTO</p>
                  </div>
                </template>
              </div>
            </div>

            <!-- HIDDEN STATE -->
            <div v-else key="hidden" class="hidden-ui text-center">
              <div class="biometric-area mb-4">
                <div class="scan-line"></div>
                <div class="pulsing-circles">
                  <div class="circle"></div>
                  <div class="circle"></div>
                </div>
                <ion-icon :icon="fingerPrintOutline" class="fingerprint-icon"></ion-icon>
              </div>
              <h5 class="fw-900 mb-2">Toca sobre la huella</h5>
              <p class="small opacity-50 px-5">Revela tu identidad secreta</p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="footer-action px-3">
      <button @click="showWord ? next() : toggleReveal()" class="btn btn-reveal-action w-100 py-3 shadow-lg"
        :class="{ 'btn-primary-gradient': showWord, 'btn-outline-success': !showWord }">
        <template v-if="showWord">
          <span>ENTENDIDO, CONTINUAR</span>
          <ion-icon :icon="arrowForwardOutline" class="ms-2"></ion-icon>
        </template>
        <template v-else>
          <ion-icon :icon="eyeOutline" class="me-2"></ion-icon>
          <span>REVELAR MISIÓN</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import {
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  personCircleOutline,
  fingerPrintOutline,
  bulbOutline,
  bookOutline,
  flameOutline,
  shieldOutline
} from 'ionicons/icons';
import { store } from '../store';
import { soundManager } from '../utils/SoundManager';

const showWord = ref(false);
const currentPlayer = computed(() => store.players[store.currentPlayerIndex]);

const handleInteraction = () => {
  if (showWord.value) {
    next();
  } else {
    toggleReveal();
  }
};

const toggleReveal = () => {
  soundManager.play('click');
  soundManager.vibrate('light');
  showWord.value = !showWord.value;
  if (showWord.value) {
    soundManager.play('reveal');
    soundManager.vibrate('heavy');
  }
};

const next = () => {
  soundManager.play('click');
  soundManager.vibrate('light');
  showWord.value = false;
  store.nextPlayer();
};
</script>

<style scoped>
.player-view-card {
  display: flex;
  flex-direction: column;
  position: relative;
}

.status-glass {
  background: rgba(37, 56, 101, 0.6);
  backdrop-filter: blur(12px);
  padding: 10px 24px;
  border-radius: 0 0 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
  font-size: 0.85rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.player-avatar-wrapper {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
  opacity: 0.3;
  animation: rotate-slow 10s linear infinite;
}

.avatar-core {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.avatar-character-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial-large {
  color: white;
  font-weight: 900;
  font-size: 2.5rem;
}

.text-gradient-silver {
  background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.reveal-box-premium {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 3rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.reveal-box-premium.revealed.superhero {
  border-color: var(--success);
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent);
  box-shadow: inset 0 0 60px rgba(16, 185, 129, 0.1);
}

.reveal-box-premium.revealed.villain {
  border-color: var(--danger);
  background: radial-gradient(circle at center, rgba(244, 63, 94, 0.1), transparent);
  box-shadow: inset 0 0 60px rgba(244, 63, 94, 0.1);
}

.biometric-area {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fingerprint-icon {
  font-size: 6rem;
  color: var(--primary);
  opacity: 0.7;
  z-index: 2;
  transition: transform 0.3s ease;
}

.reveal-box-premium:active .fingerprint-icon {
  transform: scale(0.9);
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary);
  box-shadow: 0 0 15px var(--primary);
  z-index: 3;
  animation: scan-move 2.5s infinite linear;
}

.pulsing-circles .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--primary);
  border-radius: 50%;
  opacity: 0;
  animation: pulse-out 2s infinite;
}

.pulsing-circles .circle:nth-child(2) {
  animation-delay: 1s;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-radius: 100px;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  color: white;
}

.role-badge.superhero {
  background: var(--success);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
}

.role-badge.villain {
  background: var(--danger);
  box-shadow: 0 0 30px rgba(244, 63, 94, 0.4);
}

.word-card-glamour {
  perspective: 1000px;
}

.villain-text-glow {
  color: var(--danger);
  text-shadow: 0 0 30px rgba(244, 63, 94, 0.6);
}

.text-danger-premium {
  color: #fb7185;
  letter-spacing: 0.05em;
}

.btn-reveal-action {
  border-radius: 1rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-primary-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 15px 35px -10px var(--primary-glow);
}


.btn-reveal-action:active {
  transform: scale(0.95);
}

/* Animations */
@keyframes scan-move {
  0% {
    top: 0%;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    top: 100%;
    opacity: 0;
  }
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-out {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }

  100% {
    width: 140px;
    height: 140px;
    opacity: 0;
  }
}

.reveal-transition-enter-active {
  transition: all 0.5s ease;
}

.reveal-transition-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fw-900 {
  font-weight: 900;
}

.letter-spacing-sm {
  letter-spacing: 0.2em;
}
</style>
