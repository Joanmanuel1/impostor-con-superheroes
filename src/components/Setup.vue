<template>
  <div class="game-card setup-card container-fluid">
    <div class="row text-center mb-2">
      <div class="col-12">
        <div class="logo-wrapper-glow mx-auto mb-3">
          <img src="/superhero.jpg" alt="Logo" class="logo-img">
        </div>
        <div class="d-flex align-items-center justify-content-center gap-3">
          <h1 class="gradient-text display-4 mb-2 fw-900">El villano</h1>
          <button class="btn btn-sm btn-outline-light rounded-circle help-btn" @click="showTutorial = true">
            <ion-icon :icon="helpCircleOutline"></ion-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 1: Config -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="row g-3">
          <div class="col-6">
            <div class="option-card-premium text-center" :class="{ active: showCategory }"
              @click="showCategory = !showCategory">
              <div class="option-content text-center">
                <span class="option-label">Categoría</span>
                <span class="option-status">{{ showCategory ? 'Visible' : 'Oculta' }}</span>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="option-card-premium text-center" :class="{ active: impostorHint }"
              @click="impostorHint = !impostorHint">
              <div class="option-content text-center">
                <span class="option-label">Pistas</span>
                <span class="option-status">{{ impostorHint ? 'Activada' : 'Desactivada' }}</span>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="villain-control-card">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="villain-icon-bg me-3">
                    <ion-icon :icon="skullOutline"></ion-icon>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">Número de Villanos</h6>
                    <small class="">Desafío para los héroes</small>
                  </div>
                </div>
                <span class="villain-count-badge">{{ villainCount }}</span>
              </div>

              <div class="d-flex align-items-center gap-3">
                <button class="btn btn-villain-step" @click.stop="decrementVillains" :disabled="villainCount <= 1">
                  <ion-icon :icon="removeCircleOutline"></ion-icon>
                </button>
                <div class="progress flex-grow-1" style="height: 6px; background: rgba(255,255,255,0.05)">
                  <div class="progress-bar bg-danger shadow-danger"
                    :style="{ width: (villainCount / (playerNames.length - 1) * 100) + '%' }"></div>
                </div>
                <button class="btn btn-villain-step" @click.stop="incrementVillains"
                  :disabled="villainCount >= playerNames.length - 1">
                  <ion-icon :icon="addCircleOutline"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Categories -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="section-header d-flex align-items-center mb-4">
          <h5 class="section-title mb-0">Temáticas</h5>
          <div class="ms-auto d-flex align-items-center gap-2">
            <span class="small text-white fw-bold">{{ isEditMode ? 'MODO EDICIÓN' : 'MODO JUEGO' }}</span>
            <div class="form-check form-switch custom-switch">
              <input class="form-check-input" type="checkbox" role="switch" v-model="isEditMode">
            </div>
          </div>
        </div>

        <!-- Category Chips -->
        <div class="category-scroll-container d-flex flex-wrap gap-2 mb-3">
          <!-- All Categories (Merged) -->
          <button v-for="cat in Object.keys(store.getAllCategories())" :key="cat" class="btn btn-sm category-chip"
            :class="{
              'active': selectedCategories.includes(cat) && !isEditMode,
              'custom': store.customCategories[cat],
              'editing': isEditMode
            }" @click="handleCategoryClick(cat)">
            {{ cat }}
            <ion-icon v-if="isEditMode" :icon="pencilOutline" class="ms-1 edit-indicator"></ion-icon>
            <ion-icon v-else-if="selectedCategories.includes(cat)" :icon="checkmarkCircle" class="ms-1"></ion-icon>
          </button>

          <!-- Create Button (Always visible) -->
          <button class="btn btn-sm category-chip add-new" @click="openCreateModal">
            <ion-icon :icon="addCircleOutline" class="me-1"></ion-icon>
            Crear
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Category Modal -->
    <div v-if="showAddModal" class="custom-modal-overlay animate__animated animate__fadeIn">
      <div class="custom-modal-card">
        <h4 class="fw-900 mb-3">{{ editingCategoryName ? 'Editar Pack' : 'Crear Pack' }}</h4>

        <input v-model="newCategoryName" type="text" class="form-control mb-3 category-name-input text-white"
          placeholder="Nombre (Ej: Jugadores de futbol)">

        <div class="words-list mb-3">
          <div v-for="(item, idx) in newWords" :key="idx" class="d-flex gap-2 mb-2 text-white">
            <input v-model="item.word" type="text" class="form-control form-control-sm text-white"
              placeholder="Palabra">
            <input v-model="item.hint" type="text" class="form-control form-control-sm" placeholder="Pista">
            <button @click="removeNewWord(idx)" class="btn btn-sm btn-link text-danger p-0">
              <ion-icon :icon="closeCircleOutline"></ion-icon>
            </button>
          </div>
          <button @click="addNewWordField" class="btn btn-sm btn-link text-primary ps-0 text-decoration-none fw-bold">
            + Agregar Palabra
          </button>
        </div>

        <div class="d-flex gap-2">
          <button @click="showAddModal = false" class="btn btn-outline-light flex-grow-1">Cancelar</button>
          <button v-if="editingCategoryName && store.customCategories[editingCategoryName]"
            @click="confirmRemoveCategory(editingCategoryName)" class="btn btn-outline-danger">
            <ion-icon :icon="trashOutline"></ion-icon>
          </button>
          <button @click="saveCustomCategory" class="btn btn-primary flex-grow-1"
            :disabled="!isValidCategory">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Step 3: Players -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="section-header d-flex align-items-center mb-4">
          <h5 class="section-title mb-0">Escuadrón</h5>
          <span class="section-count ms-auto">
            {{ playerNames.length }} héroe{{ playerNames.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <div class="players-list-modern">
          <transition-group name="list">
            <div v-for="(name, index) in playerNames" :key="index"
              class="player-row animate__animated animate__fadeInLeft">
              <!-- Avatar Preview -->
              <div class="player-avatar-preview" :style="{ backgroundColor: store.avatars[index]?.color || '#6366f1' }">
                <img v-if="store.avatars[index]?.path" :src="store.avatars[index].path" alt="Avatar" class="avatar-img">
                <span v-else class="avatar-initial">{{ name ? name.charAt(0).toUpperCase() : index + 1 }}</span>
              </div>
              <div class="player-number">{{ index + 1 }}</div>
              <input v-model="playerNames[index]" type="text" class="form-control player-input-field"
                :placeholder="'Jugador ' + (index + 1)">
              <button v-if="playerNames.length > 3" @click="removePlayer(index)" class="btn btn-remove-player">
                <ion-icon :icon="closeCircleOutline"></ion-icon>
              </button>
            </div>
          </transition-group>
        </div>
        <button @click="addPlayer" v-if="playerNames.length < 15"
          class="btn btn-add-player mt-3 p-3 btn-sm btn-outline-success">
          <ion-icon :icon="addCircleOutline" class="me-2"></ion-icon>
          <span>Sumar un nuevo héroe</span>
        </button>

      </div>
    </div>

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

</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  closeCircleOutline,
  addCircleOutline,
  rocketOutline,
  skullOutline,
  removeCircleOutline,
  pencilOutline,
  trashOutline,
  checkmarkCircle,
  helpCircleOutline
} from 'ionicons/icons';
import { store } from '../store';
import { soundManager } from '../utils/SoundManager';
import Tutorial from './Tutorial.vue';

const playerNames = ref(['', '', '']);
const showCategory = ref(true);
const impostorHint = ref(true);
const villainCount = ref(1);
const showTutorial = ref(false);

const selectedCategories = ref(Object.keys(store.getAllCategories()));
const isEditMode = ref(false);

// Custom Category Modal State
const showAddModal = ref(false);
const editingCategoryName = ref(null);
const newCategoryName = ref('');
const newWords = ref([{ word: '', hint: '' }, { word: '', hint: '' }]);

const isValidCategory = computed(() => {
  return newCategoryName.value.trim().length > 0 &&
    newWords.value.filter(w => w.word.trim() && w.hint.trim()).length >= 2;
});

const addNewWordField = () => {
  newWords.value.push({ word: '', hint: '' });
};

const removeNewWord = (idx) => {
  if (newWords.value.length > 2) {
    newWords.value.splice(idx, 1);
  }
};

const handleCategoryClick = (cat) => {
  if (isEditMode.value) {
    openEditModal(cat);
  } else {
    toggleCategory(cat);
  }
};

const openCreateModal = () => {
  editingCategoryName.value = null;
  newCategoryName.value = '';
  newWords.value = [{ word: '', hint: '' }, { word: '', hint: '' }];
  showAddModal.value = true;
};

const openEditModal = (name) => {
  editingCategoryName.value = name;
  newCategoryName.value = name;

  // Check if it's a custom category or default
  const allCats = store.getAllCategories();
  const words = allCats[name];

  if (words) {
    newWords.value = words.map(w => ({ ...w }));
  } else {
    newWords.value = [{ word: '', hint: '' }, { word: '', hint: '' }];
  }
  showAddModal.value = true;
};

const saveCustomCategory = () => {
  const validWords = newWords.value
    .filter(w => w.word.trim() && w.hint.trim())
    .map(w => ({ word: w.word.trim(), hint: w.hint.trim() }));

  if (newCategoryName.value.trim() && validWords.length >= 2) {
    const newName = newCategoryName.value.trim();

    // If editing and name changed, remove old one first
    if (editingCategoryName.value && editingCategoryName.value !== newName) {
      store.removeCustomCategory(editingCategoryName.value);
      // Update selected categories: remove old name
      const idx = selectedCategories.value.indexOf(editingCategoryName.value);
      if (idx > -1) selectedCategories.value.splice(idx, 1);
    }

    store.addCustomCategory(newName, validWords);

    // Select it automatically if not already
    if (!selectedCategories.value.includes(newName)) {
      selectedCategories.value.push(newName);
    }

    // Reset and close
    openCreateModal(); // Reset state
    showAddModal.value = false;

    soundManager.play('click');
    soundManager.vibrate('success');
  }
};

const confirmRemoveCategory = (name) => {
  if (confirm(`¿Eliminar el pack "${name}"?`)) {
    store.removeCustomCategory(name);

    // If it was a default category shadowed, it will revert to default automatically
    // If it was purely custom, it's gone.

    // Update selection if needed (remove if not in merged list anymore)
    const allCats = store.getAllCategories();
    if (!allCats[name]) {
      const idx = selectedCategories.value.indexOf(name);
      if (idx > -1) selectedCategories.value.splice(idx, 1);
    }

    soundManager.vibrate('medium');
    showAddModal.value = false; // Close modal if open
  }
};

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

const isValid = computed(() => {
  return playerNames.value.length >= 3 && playerNames.value.every(name => name.trim() !== '');
});

const addPlayer = () => {
  if (playerNames.value.length < 15) {
    soundManager.play('click');
    soundManager.vibrate('light');
    playerNames.value.push('');
  }
};

const removePlayer = (index) => {
  soundManager.vibrate('medium');
  playerNames.value.splice(index, 1);
};

const toggleCategory = (cat) => {
  const index = selectedCategories.value.indexOf(cat);
  if (index > -1) {
    if (selectedCategories.value.length > 1) {
      selectedCategories.value.splice(index, 1);
    }
  } else {
    selectedCategories.value.push(cat);
  }
};

const incrementVillains = () => {
  if (villainCount.value < playerNames.value.length - 1) {
    soundManager.play('click');
    soundManager.vibrate('light');
    villainCount.value++;
  }
};

const decrementVillains = () => {
  if (villainCount.value > 1) {
    soundManager.play('click');
    soundManager.vibrate('light');
    villainCount.value--;
  }
};

// Watch player count and adjust villain count if needed
watch(() => playerNames.value.length, (newLength) => {
  const maxVillains = newLength - 1;
  if (villainCount.value > maxVillains) {
    villainCount.value = Math.max(1, maxVillains);
  }
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

.logo-wrapper-glow {
  position: relative;
  border-radius: 25px;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.section-badge {
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
}

.section-title {
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-light);
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.section-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  letter-spacing: 0.05em;
}

.option-card-premium {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.option-card-premium.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05));
  border-color: var(--primary);
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
}

.option-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
}

.active .option-icon {
  color: var(--primary);
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.option-status {
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--text-light);
}

.active .option-label {
  color: var(--primary);
  opacity: 0.8;
}

.villain-control-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.8rem;
  padding: 1.5rem;
}

.villain-icon-bg {
  width: 44px;
  height: 44px;
  background: rgba(244, 63, 94, 0.1);
  color: var(--danger);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.villain-count-badge {
  background: var(--danger);
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
}

.btn-villain-step {
  color: var(--danger);
  font-size: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  transition: transform 0.2s;
}

.btn-villain-step:active:not(:disabled) {
  transform: scale(1.2);
}

.shadow-danger {
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.4);
}

.category-chip {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-weight: 800;
  transition: all 0.3s ease;
  color: white;
}

.category-chip.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.players-list-modern {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 1.2rem;
  transition: border-color 0.3s;
  gap: 0.75rem;
}

.player-row:focus-within {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.04);
}

.player-avatar-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial {
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
}

.player-number {
  width: 24px;
  height: 24px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.player-input-field {
  background: transparent !important;
  border: none !important;
  color: white !important;
  font-weight: 700 !important;
  padding: 0.75rem 0 !important;
  box-shadow: none !important;
}

.btn-remove-player {
  color: var(--danger);
  opacity: 0.5;
  font-size: 1.5rem;
  padding: 0;
}

.btn-remove-player:hover {
  opacity: 1;
}

.btn-add-player {
  font-weight: 800;
  transition: all 0.3s;
  border-radius: 25px;
}

.btn-add-player:active {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  color: var(--primary);
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
  color: white;
  border: none;
  border-radius: 1.2rem;
  box-shadow: 0 15px 35px -10px var(--primary-glow);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-start-game:active {
  transform: scale(0.96);
}

.btn-start-game:disabled {
  background: #1e293b;
  opacity: 0.6;
  box-shadow: none;
}

.fw-900 {
  font-weight: 900;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
}


.category-chip.custom {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
}

.category-chip.custom.active {
  background: var(--secondary);
  border-color: var(--secondary);
}

.category-chip.add-new {
  border-style: dashed;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
}

.category-chip.add-new:active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.remove-cat-icon {
  opacity: 0.6;
  font-size: 1.1rem;
}

.remove-cat-icon:active {
  opacity: 1;
  color: var(--danger);
}

.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.custom-modal-card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.category-name-input {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  font-weight: 700;
  border-radius: 0.8rem;
}

.words-list {
  max-height: 300px;
  overflow-y: auto;
}

.form-control-sm {
  background: rgba(255, 255, 255, 0.05) !important;
  border: none !important;
  color: white !important;
}

.category-name-input::placeholder,
.form-control-sm::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Edit Mode Styles */
.custom-switch .form-check-input {
  background-color: var(--primary);
  border-color: var(--primary);
  cursor: pointer;
}

.custom-switch .form-check-input:checked {
  background-color: var(--warning);
  border-color: var(--warning);
}

.category-chip.editing {
  background: rgba(245, 158, 11, 0.15) !important;
  border-color: var(--warning) !important;
  border-style: dashed !important;
  color: white !important;
}

.edit-indicator {
  color: var(--warning);
  font-size: 0.9em;
}

.help-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}
</style>
