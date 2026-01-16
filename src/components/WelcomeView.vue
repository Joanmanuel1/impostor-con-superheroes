<template>
    <div class="welcome-screen" @click="startSetup">
        <div class="splash-container animate__animated animate__fadeIn">
            <img src="/assets/splash.png" alt="Splash Screen" class="splash-img">

            <div class="tap-overlay">
                <div class="tap-hint animate__animated animate__pulse animate__infinite">
                    TOCAR PARA COMENZAR
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { store } from '../store';
import { soundManager } from '../utils/SoundManager';

const startSetup = () => {
    soundManager.play('click');
    soundManager.vibrate('light');
    store.gameState = 'setup';
};
</script>

<style scoped>
.welcome-screen {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    z-index: 9999;
    cursor: pointer;
}

.splash-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.splash-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tap-overlay {
    position: absolute;
    bottom: 30%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
}

.tap-hint {
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--text-light);
    text-shadow: 0 0 20px var(--primary-glow), 0 0 40px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.25em;
    background: rgba(15, 23, 42, 0.6);
    padding: 1rem 2.5rem;
    border-radius: 100px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px -10px var(--primary-glow);
}
</style>
