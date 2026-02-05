<template>
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
              <span v-else class="avatar-initial">{{ playerNames[index] ? playerNames[index].charAt(0).toUpperCase() : index + 1 }}</span>
            </div>
            <div class="player-number">{{ index + 1 }}</div>
            <input :value="playerNames[index]" @input="updateName(index, $event.target.value)" type="text"
              class="form-control player-input-field" :placeholder="'Jugador ' + (index + 1)">
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
</template>

<script setup>
import { IonIcon } from '@ionic/vue';
import { closeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { store } from '../../store';

const props = defineProps({
  playerNames: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:playerNames']);

const updateName = (index, value) => {
  const newNames = [...props.playerNames];
  newNames[index] = value;
  emit('update:playerNames', newNames);
};

const addPlayer = () => {
  if (props.playerNames.length < 15) {
    const newNames = [...props.playerNames, ''];
    emit('update:playerNames', newNames);
  }
};

const removePlayer = (index) => {
  const newNames = [...props.playerNames];
  newNames.splice(index, 1);
  emit('update:playerNames', newNames);
};
</script>

<style scoped>
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
  padding: 0.25rem 0.6rem;
  border-radius: 0.85rem;
  transition: border-color 0.3s;
  gap: 0.75rem;
  width: 100%;
}

.player-row:focus-within {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.04);
}

.player-avatar-preview {
  width: 32px;
  height: 32px;
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
  font-size: 0.9rem;
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
  font-size: 0.9rem !important;
  padding: 0.6rem 0 !important;
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
  border-radius: 20px;
  font-size: 0.8rem;
  padding: 0.5rem !important;
}

.btn-add-player:active {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  color: var(--primary);
}

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

.section-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  letter-spacing: 0.05em;
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
</style>
