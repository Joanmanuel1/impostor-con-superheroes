<template>
    <div class="tutorial-overlay animate__animated animate__fadeIn">
        <div class="tutorial-card">
            <div class="tutorial-content text-center">
                <!-- Icon/Image -->
                <div class="icon-wrapper mb-4 animate__animated animate__bounceIn delay-1s" :key="currentSlide">
                    <ion-icon :icon="slides[currentSlide].icon" class="slide-icon"
                        :style="{ color: slides[currentSlide].color }"></ion-icon>
                </div>

                <!-- Text -->
                <h2 class="fw-900 mb-4 gradient-text">{{ slides[currentSlide].title }}</h2>
                <p class="tutorial-description mb-5 px-3">{{ slides[currentSlide].description }}</p>

                <!-- Indicators -->
                <div class="indicators mb-4 d-flex justify-content-center gap-2">
                    <div v-for="(_, idx) in slides" :key="idx" class="indicator-dot"
                        :class="{ active: idx === currentSlide }"></div>
                </div>

                <!-- Controls -->
                <button v-if="currentSlide < slides.length - 1" @click="nextSlide"
                    class="btn btn-primary w-100 py-3 mb-3 fw-bold shadow-lg">
                    SIGUIENTE
                </button>
                <button v-else @click="finishTutorial" class="btn btn-success w-100 py-3 mb-3 fw-bold shadow-lg">
                    ¡ENTENDIDO!
                </button>

                <button @click="finishTutorial"
                    class="btn btn-link text-white-50 text-decoration-none btn-sm fw-bold tracking-wider">
                    OMITIR
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
    peopleOutline,
    eyeOffOutline,
    chatbubblesOutline,
    skullOutline
} from 'ionicons/icons';
import { soundManager } from '../utils/SoundManager';

const emit = defineEmits(['close']);

const currentSlide = ref(0);

const slides = [
    {
        title: 'Objetivo: Encontrar al villano',
        description: 'Todos los superhéroes conocen la palabra secreta, excepto el villano, el cual solo tiene una pista, la cual es una palabra que lo aproxima a desucbrir la palabra secreta.',
        icon: peopleOutline,
        color: '#6366f1' // Primary
    },
    {
        title: 'Roles: Superhéroes vs Villano',
        description: 'Los superhéroes deben encontrar al villano. El cual debe pasar desapercibido y adivinar la palabra.',
        icon: eyeOffOutline,
        color: '#f43f5e' // Danger
    },
    {
        title: 'Dinámica',
        description: 'Cada participante debe decir una palabra o una frase relacionada a la palabra secreta en su turno. ¡No seas muy obvio para que el villano no adivine la palabra secreta! ¡Tampoco seas muy rebuscado para que los superheroes puedan deducir que vos no sos el villano.',
        icon: chatbubblesOutline,
        color: '#eab308' // Warning
    },
    {
        title: 'Votación',
        description: 'Al final de cada ronda pueden ser 1, 2 o las rondas que los participantes decidan, votan para eliminar a alguien. Si el villano es descubierto pierde y ganan los superheroes. En cambio si el villano ganara si logra llegar hasta la ultima ronda sin ser descubierto. Nadie debe revelar la palabra secreta hasta que queden la misma cantidad de superhéroes que de villanos.',
        icon: skullOutline,
        color: '#10b981' // Success
    }
];

const nextSlide = () => {
    soundManager.play('click');
    soundManager.vibrate('light');
    currentSlide.value++;
};

const finishTutorial = () => {
    soundManager.play('click');
    soundManager.vibrate('medium');
    localStorage.setItem('tutorial_seen', 'true');
    emit('close');
};
</script>

<style scoped>
.tutorial-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(15px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.tutorial-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.slide-icon {
    font-size: 5rem;
    filter: drop-shadow(0 0 20px currentColor);
}

.tutorial-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.7;
    font-weight: 500;
}

.indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.indicator-dot.active {
    background: white;
    transform: scale(1.2);
}

.gradient-text {
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
