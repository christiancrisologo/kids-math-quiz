import React, { useEffect, useState } from 'react';

interface ConfettiProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiProps> = ({ isVisible, onComplete }) => {
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

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
        const emojis = ['⭐', '🎉', '🌟', '✨', '🎊', '🎈', '🎁', '🏆'];

        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            emoji: emojis[Math.floor(Math.random() * emojis.length)]
        }));

        setParticles(newParticles);

        const animationDuration = 3000;
        const interval = setInterval(() => {
            setParticles(prevParticles =>
                prevParticles.map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    vy: particle.vy + 0.1 // gravity
                })).filter(particle => particle.y < window.innerHeight + 10)
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
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute text-2xl animate-bounce-gentle"
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
