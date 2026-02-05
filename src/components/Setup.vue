<template>
  <div class="setup-container">
    <div class="game-card setup-card container-fluid px-3">
      <div class="row text-center mb-2">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-center gap-3">
            <h1 class="gradient-text h3 mb-2 fw-900">El villano</h1>
          </div>
          <button class="btn btn-sm btn-primary" @click="showTutorial = true" style="border-radius: 25px;">
            <span>Tutorial</span>
          </button>
        </div>
      </div>

      <!-- Step 1: Config -->
      <GameConfig
        v-model:showCategory="showCategory"
        v-model:impostorHint="impostorHint"
        v-model:villainCount="villainCount"
        :maxVillains="playerNames.length - 1"
      />

      <!-- Step 2: Categories -->
      <CategorySelection
        v-model:isEditMode="isEditMode"
        v-model:selectedCategories="selectedCategories"
      />

      <!-- Step 3: Players -->
      <PlayerInput
        v-model:playerNames="playerNames"
      />

      <!-- Footer CTA -->
      <div class="footer-cta bg-blur">
        <button @click="start" :disabled="!isValid" class="btn btn-start-game w-100 py-3">
          <span class="fw-bold mb-0">{{ isValid ? '¡COMENZAR!' : 'Faltan completar nombres' }}</span>
          <ion-icon :icon="rocketOutline" class="ms-2"></ion-icon>
        </button>
      </div>
    </div>

    <!-- Tutorial Overlay -->
    <Tutorial v-if="showTutorial" @close="showTutorial = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { IonIcon } from '@ionic/vue';
import { rocketOutline } from 'ionicons/icons';
import { store } from '../store';
import Tutorial from './Tutorial.vue';
import GameConfig from './setup/GameConfig.vue';
import CategorySelection from './setup/CategorySelection.vue';
import PlayerInput from './setup/PlayerInput.vue';

const playerNames = ref(['', '', '']);
const showCategory = ref(true);
const impostorHint = ref(true);
const villainCount = ref(1);
const showTutorial = ref(false);

const selectedCategories = ref(Object.keys(store.getAllCategories()));
const isEditMode = ref(false);

// Load saved names on mount
onMounted(() => {
  const savedNames = localStorage.getItem('impostor_player_names');
  if (savedNames) {
    try {
      const parsedNames = JSON.parse(savedNames);
      if (Array.isArray(parsedNames) && parsedNames.length >= 3) {
        playerNames.value = parsedNames;
      }
    } catch (e) {
      console.error('Error loading saved names', e);
    }
  }

  // Check Tutorial
  if (!localStorage.getItem('tutorial_seen')) {
    setTimeout(() => {
      showTutorial.value = true;
    }, 500);
  }
});

// Save names whenever they change
watch(playerNames, (newNames) => {
  localStorage.setItem('impostor_player_names', JSON.stringify(newNames));
}, { deep: true });

// Watch player count and adjust villain count if needed
watch(() => playerNames.value.length, (newLength) => {
  const maxVillains = newLength - 1;
  if (villainCount.value > maxVillains) {
    villainCount.value = Math.max(1, maxVillains);
  }
});

const isValid = computed(() => {
  return playerNames.value.length >= 3 && playerNames.value.every(name => name.trim() !== '');
});

const start = () => {
  if (isValid.value) {
    store.startGame(playerNames.value.map(n => n.trim()), {
      showCategory: showCategory.value,
      impostorHint: impostorHint.value,
      enabledCategories: selectedCategories.value,
      villainCount: villainCount.value
    });
  }
};
</script>

<style scoped>
.setup-card {
  padding-bottom: 90px;
}

.footer-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  z-index: 100;
  background: linear-gradient(to top, var(--bg-dark) 80%, transparent);
}

.bg-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.btn-start-game {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--bg-dark);
  border: none;
  font-size: 1rem;
  letter-spacing: 0.05em;
  border-radius: 1rem;
  box-shadow: 0 15px 40px -10px var(--primary-glow);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-start-game:active {
  transform: scale(0.97);
  box-shadow: 0 5px 15px -5px var(--primary-glow);
}

.btn-start-game:disabled {
  background: #1e293b;
  color: var(--text-muted);
  opacity: 0.6;
  box-shadow: none;
}
</style>
