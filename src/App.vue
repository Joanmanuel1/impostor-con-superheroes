<template>
  <ion-app>
    <ion-content>
      <div class="app-wrapper">
        <Transition name="fade" mode="out-in">
          <component :is="currentComponent" />
        </Transition>
      </div>
    </ion-content>
  </ion-app>
</template>

<script setup>
import { computed } from 'vue';
import { IonApp, IonContent } from '@ionic/vue';
import { store } from './store';
import WelcomeView from './components/WelcomeView.vue';
import Setup from './components/Setup.vue';
import PlayerView from './components/PlayerView.vue';
import Voting from './components/Voting.vue';
import EliminationReveal from './components/EliminationReveal.vue';
import Result from './components/Result.vue';

const currentComponent = computed(() => {
  switch (store.gameState) {
    case 'welcome': return WelcomeView;
    case 'setup': return Setup;
    case 'show-word': return PlayerView;
    case 'voting': return Voting;
    case 'elimination-reveal': return EliminationReveal;
    case 'results': return Result;
    default: return WelcomeView;
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');

:root {
  --app-font: 'Outfit', sans-serif;

  /* Modern Cyan/Teal & Amber/Gold Palette */
  --primary: #06b6d4;
  /* Cyan 500 */
  --primary-rgb: 6, 182, 212;
  --primary-glow: rgba(6, 182, 212, 0.4);
  --secondary: #fbbf24;
  /* Amber 400 */
  --secondary-glow: rgba(251, 191, 36, 0.4);

  --bg-dark: #020617;
  /* Slate 950 */
  --bg-surface: #0f172a;
  /* Slate 900 */
  --card-bg: rgba(15, 23, 42, 0.6);
  --card-border: rgba(255, 255, 255, 0.05);

  --text-light: #f8fafc;
  --text-muted: #94a3b8;
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;

  /* Fluid Design System - Balanced Mobile First */
  --container-padding: 12px;
  --border-radius-lg: clamp(0.75rem, 1.5vw, 1.25rem);
  --font-size-base: clamp(0.85rem, 0.8vw + 0.4rem, 1rem);
  --h1-size: clamp(1.75rem, 7vw, 2.5rem);
  --h2-size: clamp(1.25rem, 5vw, 2rem);
}

body {
  font-family: var(--app-font);
  background: var(--bg-dark);
  color: var(--text-light);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ion-content {
  --background: radial-gradient(circle at 50% 0%, #083344 0%, var(--bg-dark) 100%);
  --color: var(--text-light);

}

.app-wrapper {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
}

.game-card {
  background: var(--card-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 1.25rem 0.6rem;
  width: 100%;
}

@media (min-width: 576px) {
  .game-card {
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--card-border);
    padding: 2.5rem;
    max-width: 500px;
    margin: 2rem auto;
  }
}

h1 {
  font-size: var(--h1-size);
  font-weight: 900;
  letter-spacing: -0.04em;
}

h2 {
  font-size: var(--h2-size);
  font-weight: 800;
  letter-spacing: -0.02em;
}

h3 {
  font-weight: 700;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%);
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
