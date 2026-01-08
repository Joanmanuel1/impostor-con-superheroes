import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('/sounds/click.mp3'),
            reveal: new Audio('/sounds/reveal.mp3'),
            alarm: new Audio('/sounds/alarm.mp3'),
            start: new Audio('/sounds/start.mp3')
        };

        // Volume control
        Object.values(this.sounds).forEach(s => s.volume = 0.5);
    }

    /**
     * Play a sound file
     * @param {string} soundName - Key from this.sounds
     */
    async play(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                await sound.play();
            }
        } catch (e) {
            // Audio play might fail if user hasn't interacted with document yet
            console.warn('Audio play failed', e);
        }
    }

    /**
     * Trigger haptic feedback
     * @param {string} style - light, medium, heavy, success, warning, error
     */
    async vibrate(style = 'light') {
        try {
            switch (style) {
                case 'heavy':
                    await Haptics.impact({ style: ImpactStyle.Heavy });
                    break;
                case 'medium':
                    await Haptics.impact({ style: ImpactStyle.Medium });
                    break;
                case 'success':
                    await Haptics.notification({ type: NotificationType.Success });
                    break;
                case 'warning':
                    await Haptics.notification({ type: NotificationType.Warning });
                    break;
                case 'error':
                    await Haptics.notification({ type: NotificationType.Error });
                    break;
                case 'light':
                default:
                    await Haptics.impact({ style: ImpactStyle.Light });
                    break;
            }
        } catch (e) {
            console.warn('Haptics failed (plugin might not be active)', e);
        }
    }
}

export const soundManager = new SoundManager();
