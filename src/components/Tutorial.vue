<template>
    <div class="tutorial-overlay animate__animated animate__fadeIn">
        <div class="tutorial-card">
            <div class="tutorial-content text-center">
                <div class="tutorial-scroll-area">
                    <!-- Icon/Image -->
                    <div class="icon-wrapper mb-3 animate__animated animate__bounceIn delay-1s" :key="currentSlide">
                        <ion-icon :icon="slides[currentSlide].icon" class="slide-icon"
                            :style="{ color: slides[currentSlide].color }"></ion-icon>
                    </div>

                    <!-- Text -->
                    <h2 class="h4 fw-900 mb-2 gradient-text">{{ slides[currentSlide].title }}</h2>
                    <p class="tutorial-description mb-4 px-2">{{ slides[currentSlide].description }}</p>
                </div>

                <!-- Indicators -->
                <div class="indicators mb-3 d-flex justify-content-center gap-2">
                    <div v-for="(_, idx) in slides" :key="idx" class="indicator-dot"
                        :class="{ active: idx === currentSlide }"></div>
                </div>

                <!-- Controls -->
                <button v-if="currentSlide < slides.length - 1" @click="nextSlide"
                    class="btn btn-primary w-100 py-2 mb-2 fw-bold shadow-lg">
                    SIGUIENTE
                </button>
                <button v-else @click="finishTutorial" class="btn btn-success w-100 py-2 mb-2 fw-bold shadow-lg">
                    ¡ENTENDIDO!
                </button>

                <button @click="finishTutorial"
                    class="btn btn-link text-white-50 text-decoration-none btn-sm fw-bold tracking-wider py-1">
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

const emit = defineEmits(['close']);

const currentSlide = ref(0);

const slides = [
    {
        title: 'Objetivo',
        description: 'Debes encontrar al villano. Todos los héroes conocen la palabra secreta. El villano solo tiene una pista para intentar deducirla.',
        icon: peopleOutline,
        color: '#6366f1'
    },
    {
        title: 'Roles',
        description: 'Héroes vs Villano. Los héroes deben desenmascarar al villano antes de que este logre adivinar la palabra secreta.',
        icon: eyeOffOutline,
        color: '#f43f5e'
    },
    {
        title: 'Dinámica',
        description: 'Di una palabra relacionada en tu turno. ¡Sé sutil! No seas obvio para no ayudar al villano, ni tan complejo para parecer sospechoso.',
        icon: chatbubblesOutline,
        color: '#eab308'
    },
    {
        title: 'Votación',
        description: 'Voten para expulsar al sospechoso. El villano gana si llega al final o adivina la palabra. Si es descubierto antes, ganan los héroes.',
        icon: skullOutline,
        color: '#10b981'
    }
];

const nextSlide = () => {
    currentSlide.value++;
};

const finishTutorial = () => {
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
    border-radius: 1.5rem;
    padding: 1.5rem 1.25rem;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}

.tutorial-scroll-area {
    max-height: 50vh;
    overflow-y: auto;
    margin-bottom: 1rem;
    scrollbar-width: none;
}

.tutorial-scroll-area::-webkit-scrollbar {
    display: none;
}

.slide-icon {
    font-size: 3.5rem;
    filter: drop-shadow(0 0 15px currentColor);
}

.tutorial-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.5;
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
