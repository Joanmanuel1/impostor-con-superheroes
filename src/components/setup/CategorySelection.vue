<template>
  <div class="row mb-5">
    <div class="col-12">
      <div class="section-header d-flex align-items-center mb-4">
        <h5 class="section-title mb-0">Temáticas</h5>
        <div class="ms-auto d-flex align-items-center gap-2">
          <span class="small text-white fw-bold">{{ isEditMode ? 'MODO EDICIÓN' : 'MODO JUEGO' }}</span>
          <div class="form-check form-switch custom-switch">
             <input class="form-check-input" type="checkbox" role="switch" :checked="isEditMode" @change="$emit('update:isEditMode', $event.target.checked)">
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

  <!-- Confirmation Modal -->
  <div v-if="showConfirmDelete" class="custom-modal-overlay animate__animated animate__fadeIn">
    <div class="custom-modal-card confirm-modal text-center animate__animated animate__zoomIn">
      <div class="confirm-icon-wrapper mb-3">
        <ion-icon :icon="trashOutline"></ion-icon>
      </div>
      <h4 class="fw-900 mb-2">¿Eliminar Pack?</h4>
      <p class="text-white-50 mb-4">¿Estás seguro de que quieres eliminar "{{ categoryToDelete }}"? Esta acción no se
        puede deshacer.</p>

      <div class="d-flex gap-2 w-100">
        <button @click="showConfirmDelete = false" class="btn btn-outline-light flex-grow-1 py-2">
          Cancelar
        </button>
        <button @click="executeDelete" class="btn btn-danger flex-grow-1 py-2 shadow-danger-btn">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  pencilOutline,
  checkmarkCircle,
  addCircleOutline,
  closeCircleOutline,
  trashOutline
} from 'ionicons/icons';
import { store } from '../../store';

const props = defineProps({
  isEditMode: Boolean,
  selectedCategories: Array
});

const emit = defineEmits(['update:isEditMode', 'update:selectedCategories']);

// Custom Category Modal State
const showAddModal = ref(false);
const editingCategoryName = ref(null);
const newCategoryName = ref('');
const newWords = ref([{ word: '', hint: '' }, { word: '', hint: '' }]);

const isValidCategory = computed(() => {
  return newCategoryName.value.trim().length > 0 &&
    newWords.value.filter(w => w.word.trim() && w.hint.trim()).length >= 2;
});

const showConfirmDelete = ref(false);
const categoryToDelete = ref(null);

const addNewWordField = () => {
  newWords.value.push({ word: '', hint: '' });
};

const removeNewWord = (idx) => {
  if (newWords.value.length > 2) {
    newWords.value.splice(idx, 1);
  }
};

const handleCategoryClick = (cat) => {
  if (props.isEditMode) {
    openEditModal(cat);
  } else {
    toggleCategory(cat);
  }
};

const toggleCategory = (cat) => {
  const index = props.selectedCategories.indexOf(cat);
  const newSelection = [...props.selectedCategories];
  if (index > -1) {
    if (newSelection.length > 1) {
      newSelection.splice(index, 1);
    }
  } else {
    newSelection.push(cat);
  }
  emit('update:selectedCategories', newSelection);
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
      const idx = props.selectedCategories.indexOf(editingCategoryName.value);
      if (idx > -1) {
         const newSelection = [...props.selectedCategories];
         newSelection.splice(idx, 1);
         emit('update:selectedCategories', newSelection);
      }
    }

    store.addCustomCategory(newName, validWords);

    // Select it automatically if not already
    if (!props.selectedCategories.includes(newName)) {
         const newSelection = [...props.selectedCategories];
         newSelection.push(newName);
         emit('update:selectedCategories', newSelection);
    }

    // Reset and close
    openCreateModal(); // Reset state
    showAddModal.value = false;
  }
};

const confirmRemoveCategory = (name) => {
  categoryToDelete.value = name;
  showConfirmDelete.value = true;
};

const executeDelete = () => {
  const name = categoryToDelete.value;
  if (!name) return;

  store.removeCustomCategory(name);

  // Update selection if needed
  const allCats = store.getAllCategories();
  if (!allCats[name]) {
    const idx = props.selectedCategories.indexOf(name);
    if (idx > -1) {
         const newSelection = [...props.selectedCategories];
         newSelection.splice(idx, 1);
         emit('update:selectedCategories', newSelection);
    }
  }

  // soundManager.vibrate('medium'); // Removed as soundManager is not available here or needs import
  showConfirmDelete.value = false;
  showAddModal.value = false;
  categoryToDelete.value = null;
};
</script>

<style scoped>
.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-light);
  letter-spacing: 0.15em;
  opacity: 0.95;
}

.custom-switch .form-check-input {
  background-color: var(--primary);
  border-color: var(--primary);
  cursor: pointer;
}

.custom-switch .form-check-input:checked {
  background-color: var(--warning);
  border-color: var(--warning);
}

.category-chip {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  color: var(--text-light);
}

.category-chip.active {
  background: linear-gradient(135deg, var(--primary), #0891b2);
  color: var(--bg-dark);
  font-weight: 800;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px var(--primary-glow);
}

.category-chip.custom {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.category-chip.custom.active {
  background: linear-gradient(135deg, var(--secondary), #d97706);
  color: var(--bg-dark);
  border-color: transparent;
  box-shadow: 0 8px 20px -8px var(--secondary-glow);
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

.category-chip.add-new {
  border-style: dashed;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
}

.category-chip.add-new:active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
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
  color: rgba(255, 255, 255, 0.3);
}

.confirm-modal {
  max-width: 320px;
}

.confirm-icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(244, 63, 94, 0.1);
  color: var(--danger);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto;
}

.shadow-danger-btn {
  box-shadow: 0 10px 20px -5px rgba(244, 63, 94, 0.4);
}
</style>
