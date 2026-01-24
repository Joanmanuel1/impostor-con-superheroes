<template>
    <div class="game-card debate-card container-fluid animate__animated animate__fadeIn">
        <div class="row text-center mb-4">
            <div class="col-12">
                <h1 class="gradient-text display-4 mb-2 fw-900">Debate</h1>
                <p class="text-secondary small fw-bold text-uppercase letter-spacing-sm">ENCUENTREN AL VILLANO</p>
            </div>
        </div>

        <!-- Timer Circle -->
        <div class="row mb-5">
            <div class="col-12 d-flex justify-content-center">
                <div class="timer-wrapper">
                    <svg class="timer-svg" viewBox="0 0 100 100">
                        <!-- Background Circle -->
                        <circle cx="50" cy="50" r="45" class="timer-bg" />
                        <!-- Progress Circle -->
                        <circle cx="50" cy="50" r="45" class="timer-progress" :stroke-dasharray="circumference"
                            :stroke-dashoffset="dashOffset" :class="{ 'urgent': isUrgent }" />
                    </svg>
                    <div class="timer-content">
                        <h2 class="display-3 fw-900 mb-0 timer-text" :class="{ 'urgent-text': isUrgent }">
                            {{ formattedTime }}
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="footer-action px-3">
            <button @click="skipDebate" class="btn btn-vote-now w-100 py-3 shadow-lg">
                <span class="me-2">¡VOTAR AHORA!</span>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { IonIcon } from '@ionic/vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { store } from '../store';

const timeLeft = ref(store.config.debateTime || 180);
const totalTime = store.config.debateTime || 180;
const circumference = 2 * Math.PI * 45;
let timerInterval = null;

const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60);
    const s = timeLeft.value % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
});

const dashOffset = computed(() => {
    return circumference - (timeLeft.value / totalTime) * circumference;
});

const isUrgent = computed(() => timeLeft.value <= 30);

// Watch for urgency to trigger effects
watch(isUrgent, (newVal) => {
    if (newVal) {
        // Alternatively, we play a ticking sound every second in the urgent phase
    }
});

const tick = () => {
    if (timeLeft.value > 0) {
        timeLeft.value--;

        // Play tick sound every second in last 10 seconds
        if (timeLeft.value <= 10 && timeLeft.value > 0) {
        }

    } else {
        clearInterval(timerInterval);
        // Auto-proceed shortly after? Or wait for user?
        // Let's wait for user or maybe auto-proceed after 3s
    }
};

const skipDebate = () => {
    store.gameState = 'voting';
};

onMounted(() => {
    timerInterval = setInterval(tick, 1000);
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.timer-wrapper {
    position: relative;
    width: 250px;
    height: 250px;
}

.timer-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.timer-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 6;
}

.timer-progress {
    fill: none;
    stroke: var(--primary);
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
}

.timer-progress.urgent {
    stroke: var(--danger);
    filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.5));
}

.timer-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.timer-text {
    font-variant-numeric: tabular-nums;
    letter-spacing: -2px;
}

.urgent-text {
    color: var(--danger);
    animation: pulse-text 1s infinite;
}

.btn-vote-now {
    background: linear-gradient(135deg, var(--secondary), var(--primary));
    color: white;
    border-radius: 1rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    border: none;
}

.btn-vote-now:active {
    transform: scale(0.95);
}

@keyframes pulse-text {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(0.98);
    }
}
</style>
