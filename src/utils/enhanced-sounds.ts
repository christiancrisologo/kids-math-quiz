// Enhanced sound effects utility that respects system settings
import { SystemSettings } from '../contexts/system-settings-context';

export const playSound = (
  type: 'correct' | 'incorrect' | 'button' | 'completion',
  settings?: SystemSettings
) => {
  // Don't play sound if sounds are disabled
  if (settings && !settings.sounds) return;
  
  // Only play sounds if user has interacted with the page (browser requirement)
  if (typeof window === 'undefined') return;

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (type) {
      case 'correct':
        // Happy ascending tone
        playTone(523, 0.15); // C5
        setTimeout(() => playTone(659, 0.15), 100); // E5
        setTimeout(() => playTone(784, 0.2), 200); // G5
        break;
        
      case 'incorrect':
        // Gentle descending tone
        playTone(400, 0.2, 'triangle');
        setTimeout(() => playTone(350, 0.3, 'triangle'), 150);
        break;
        
      case 'button':
        // Quick pop sound
        playTone(800, 0.1, 'square');
        break;
        
      case 'completion':
        // Celebration melody
        playTone(523, 0.15); // C5
        setTimeout(() => playTone(659, 0.15), 100); // E5
        setTimeout(() => playTone(784, 0.15), 200); // G5
        setTimeout(() => playTone(1047, 0.3), 300); // C6
        break;
    }
  } catch (error) {
    console.warn('Failed to play sound:', error);
  }
};

// Haptic feedback for mobile devices (respects system settings)
export const vibrate = (pattern: number | number[], settings?: SystemSettings) => {
  // Don't vibrate if sounds are disabled (treating haptic as part of sound feedback)
  if (settings && !settings.sounds) return;
  
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Failed to vibrate:', error);
    }
  }
};

// Audio context utility for better performance
let audioContextInstance: AudioContext | null = null;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  
  if (!audioContextInstance) {
    try {
      audioContextInstance = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (error) {
      console.warn('Failed to create audio context:', error);
      return null;
    }
  }
  
  return audioContextInstance;
};
