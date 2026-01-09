<template>
    <div class="game-card elimination-card container-fluid text-center">
        <div class="row pt-4 mb-5">
            <div class="col-12">
                <div class="elimination-icon-wrapper mx-auto mb-4" :class="store.lastEliminatedPlayer?.role">
                    <ion-icon
                        :icon="store.lastEliminatedPlayer?.role === 'villain' ? skullOutline : shieldCheckmarkOutline"></ion-icon>
                </div>

                <h3 class="text-uppercase fw-bold mb-2 letter-spacing-lg">JUGADOR ELIMINADO</h3>

                <div class="eliminated-player-card mx-auto mb-4">
                    <div class="player-avatar-large mb-3"
                        :style="{ backgroundColor: store.lastEliminatedPlayer?.avatar?.color || '#6366f1' }">
                        <img v-if="store.lastEliminatedPlayer?.avatar?.path"
                            :src="store.lastEliminatedPlayer.avatar.path" alt="Avatar" class="avatar-img-large">
                        <span v-else class="avatar-initial-xl">{{
                            store.lastEliminatedPlayer?.name.charAt(0).toUpperCase() }}</span>
                    </div>

                    <h1 class="display-4 fw-900 mb-3">{{ store.lastEliminatedPlayer?.name }}</h1>

                    <div class="role-reveal-badge mb-3" :class="store.lastEliminatedPlayer?.role">
                        <ion-icon :icon="store.lastEliminatedPlayer?.role === 'villain' ? flameOutline : shieldOutline"
                            class="me-2"></ion-icon>
                        {{ store.lastEliminatedPlayer?.role === 'villain' ? 'ERA UN VILLANO' : 'ERA UN SUPERHÉROE' }}
                    </div>
                </div>

                <div v-if="remainingVillains > 0" class="alert-box mb-4">
                    <ion-icon :icon="alertCircleOutline" class="me-2"></ion-icon>
                    <span>Aún quedan <strong>{{ remainingVillains }}</strong> villano{{ remainingVillains > 1 ? 's' : ''
                        }} oculto{{ remainingVillains > 1 ? 's' : '' }}</span>
                </div>

                <div class="stats-row row g-3 mb-4">
                    <div class="col-6">
                        <div class="stat-card">
                            <span class="stat-label">RONDA</span>
                            <span class="stat-value">{{ store.currentRound }}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stat-card">
                            <span class="stat-label">JUGADORES ACTIVOS</span>
                            <span class="stat-value">{{ activePlayers.length }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-auto">
            <div class="col-12">
                <button @click="store.startNewVotingRound()" class="btn btn-continue w-100 py-3 shadow-lg">
                    <span class="fw-bold h5 mb-0">CONTINUAR A SIGUIENTE RONDA</span>
                    <ion-icon :icon="arrowForwardOutline" class="ms-2"></ion-icon>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
    skullOutline,
    shieldCheckmarkOutline,
    flameOutline,
    shieldOutline,
    alertCircleOutline,
    arrowForwardOutline
} from 'ionicons/icons';
import { store } from '../store';

const activePlayers = computed(() => store.players.filter(p => !store.eliminatedPlayers.includes(p.id)));
const remainingVillains = computed(() => activePlayers.value.filter(p => p.role === 'villain').length);
</script>

<style scoped>
.elimination-card {
    display: flex;
    flex-direction: column;
}

.elimination-icon-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background: rgba(255, 255, 255, 0.05);
}

.elimination-icon-wrapper.superhero {
    color: var(--success);
    box-shadow: 0 0 50px rgba(16, 185, 129, 0.3);
    border: 4px solid rgba(16, 185, 129, 0.2);
}

.elimination-icon-wrapper.villain {
    color: var(--danger);
    box-shadow: 0 0 50px rgba(244, 63, 94, 0.3);
    border: 4px solid rgba(244, 63, 94, 0.2);
}

.eliminated-player-card {
    max-width: 400px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    padding: 2rem;
}

.player-avatar-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.avatar-img-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initial-xl {
    color: white;
    font-weight: 900;
    font-size: 3rem;
}

.role-reveal-badge {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 100px;
    font-weight: 900;
    font-size: 1rem;
    letter-spacing: 0.1em;
    color: white;
}

.role-reveal-badge.superhero {
    background: var(--success);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
}

.role-reveal-badge.villain {
    background: var(--danger);
    box-shadow: 0 0 30px rgba(244, 63, 94, 0.4);
}

.alert-box {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #fbbf24;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    display: inline-flex;
    align-items: center;
    font-weight: 700;
}

.stat-card {
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
    font-size: 1.5rem;
    font-weight: 900;
    color: white;
}

.btn-continue {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    border: none;
    border-radius: 1.5rem;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-continue:active {
    transform: scale(0.96);
}

.fw-900 {
    font-weight: 900;
}

.letter-spacing-lg {
    letter-spacing: 0.2em;
}
</style>
