import React, { useEffect, useState } from 'react';
import { useSystemSettings } from '../../contexts/system-settings-context';
import { shouldAnimate, getAnimationClasses } from '../../utils/enhanced-animations';

interface ConfettiProps {
    isVisible: boolean;
    onComplete?: () => void;
    intensity?: 'low' | 'medium' | 'high';
}

export const EnhancedConfettiEffect: React.FC<ConfettiProps> = ({
    isVisible,
    onComplete,
    intensity = 'medium'
}) => {
    const { settings } = useSystemSettings();
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        emoji: string;
    }>>([]);

    useEffect(() => {
        if (!isVisible) return;

        // Don't show confetti if animations are disabled
        if (!shouldAnimate(settings)) {
            onComplete?.();
            return;
        }

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
        const emojis = ['⭐', '🎉', '🌟', '✨', '🎊', '🎈', '🎁', '🏆'];

        // Determine particle count based on intensity
        const getParticleCount = () => {
            switch (intensity) {
                case 'low': return 10;
                case 'medium': return 20;
                case 'high': return 40;
                default: return 20;
            }
        };

        const particleCount = getParticleCount();

        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            emoji: emojis[Math.floor(Math.random() * emojis.length)]
        }));

        setParticles(newParticles);

        // Determine animation duration based on intensity
        const getAnimationDuration = () => {
            switch (intensity) {
                case 'low': return 2500;
                case 'medium': return 3000;
                case 'high': return 4000;
                default: return 3000;
            }
        };

        const animationDuration = getAnimationDuration();
        const interval = setInterval(() => {
            setParticles(prevParticles =>
                prevParticles.map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    vy: particle.vy + 0.1 // gravity
                })).filter(particle =>
                    particle.y < (typeof window !== 'undefined' ? window.innerHeight : 800) + 10
                )
            );
        }, 16);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setParticles([]);
            onComplete?.();
        }, animationDuration);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isVisible, onComplete, intensity, settings]);

    if (!isVisible || !shouldAnimate(settings)) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={`absolute text-2xl ${getAnimationClasses('animate-bounce-gentle', settings)}`}
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        transform: 'translate(-50%, -50%)',
                        color: particle.color
                    }}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    );
};
