<template>
  <div class="row mb-5">
    <div class="col-12">
      <div class="row g-3">
        <div class="col-6">
          <div class="option-card-premium text-center" :class="{ active: showCategory }"
            @click="$emit('update:showCategory', !showCategory)">
            <div class="option-content text-center">
              <span class="option-label">Categoría</span>
              <span class="option-status">{{ showCategory ? 'Visible' : 'Oculta' }}</span>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="option-card-premium text-center" :class="{ active: impostorHint }"
            @click="$emit('update:impostorHint', !impostorHint)">
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
                  :style="{ width: (villainCount / maxVillains * 100) + '%' }"></div>
              </div>
              <button class="btn btn-villain-step" @click.stop="incrementVillains"
                :disabled="villainCount >= maxVillains">
                <ion-icon :icon="addCircleOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IonIcon } from '@ionic/vue';
import { skullOutline, removeCircleOutline, addCircleOutline } from 'ionicons/icons';

const props = defineProps({
  showCategory: Boolean,
  impostorHint: Boolean,
  villainCount: Number,
  maxVillains: Number
});

const emit = defineEmits(['update:showCategory', 'update:impostorHint', 'update:villainCount']);

const incrementVillains = () => {
  if (props.villainCount < props.maxVillains) {
    emit('update:villainCount', props.villainCount + 1);
  }
};

const decrementVillains = () => {
  if (props.villainCount > 1) {
    emit('update:villainCount', props.villainCount - 1);
  }
};
</script>

<style scoped>
.option-card-premium {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.85rem;
  padding: 0.5rem 0.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-card-premium.active {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(251, 191, 36, 0.1));
  border-color: var(--primary);
  box-shadow: 0 10px 30px -10px var(--primary-glow);
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.option-status {
  font-size: 0.75rem;
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
  border-radius: 1.2rem;
  padding: 1.2rem;
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
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}
</style>
