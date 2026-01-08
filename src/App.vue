<template>
  <ion-app>
    <ion-content class="ion-padding">
      <div class="app-wrapper">
        <transition name="fade" mode="out-in">
          <Setup v-if="store.gameState === 'setup'" />
          <PlayerView v-else-if="store.gameState === 'show-word'" />
          <Voting v-else-if="store.gameState === 'voting'" />
          <EliminationReveal v-else-if="store.gameState === 'elimination-reveal'" />
          <Result v-else-if="store.gameState === 'results'" />
        </transition>
      </div>
    </ion-content>
  </ion-app>
</template>

<script setup>
import { IonApp, IonContent } from '@ionic/vue';
import { store } from './store';
import Setup from './components/Setup.vue';
import PlayerView from './components/PlayerView.vue';
import Voting from './components/Voting.vue';
import EliminationReveal from './components/EliminationReveal.vue';
import Result from './components/Result.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');

:root {
  --app-font: 'Outfit', sans-serif;
  --primary: #6366f1;
  --primary-rgb: 99, 102, 241;
  --primary-glow: rgba(99, 102, 241, 0.4);
  --secondary: #a855f7;
  --bg-dark: #070912;
  --bg-surface: #0f172a;
  --card-bg: rgba(15, 23, 42, 0.7);
  --card-border: rgba(255, 255, 255, 0.08);
  --text-light: #f8fafc;
  --text-muted: #94a3b8;
  --danger: #f43f5e;
  --success: #10b981;
  --warning: #f59e0b;
}

body {
  font-family: var(--app-font);
  background: var(--bg-dark);
  color: var(--text-light);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ion-content {
  --background: radial-gradient(circle at 50% -20%, #312e81 0%, var(--bg-dark) 85%);
  --color: var(--text-light);
}

.app-wrapper {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.game-card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 2.5rem;
  border: 1px solid var(--card-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  padding: 2rem 1.5rem;
}

h1,
h2,
h3 {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-10px);
}
</style>
