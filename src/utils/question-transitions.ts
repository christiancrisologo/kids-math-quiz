'use client';

import { useState, useEffect, useRef } from 'react';

export type TransitionType = 'fadeIn' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'scaleIn';

export interface TransitionConfig {
    type: TransitionType;
    duration: number;
    delay?: number;
}

// Random transition generator
export const getRandomTransition = (): TransitionConfig => {
    const transitions: TransitionType[] = ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'scaleIn'];
    const randomType = transitions[Math.floor(Math.random() * transitions.length)];
    
    return {
        type: randomType,
        duration: 1000, // 1 second duration
        delay: 50
    };
};

// CSS classes for smooth transitions without freeze
export const getTransitionClasses = (config: TransitionConfig, animationPhase: 'idle' | 'exiting' | 'entering', animationKey: string) => {
    const baseClasses = 'transition-all duration-1000 ease-in-out';
    
    switch (animationPhase) {
        case 'idle':
            // Normal visible state
            return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
        
        case 'exiting':
            // Exiting state - apply the specific transition effect
            switch (config.type) {
                case 'fadeIn':
                    return `${baseClasses} opacity-10`;
                case 'slideLeft':
                    return `${baseClasses} opacity-10 transform -translate-x-4`;
                case 'slideRight':
                    return `${baseClasses} opacity-10 transform translate-x-4`;
                case 'slideUp':
                    return `${baseClasses} opacity-10 transform -translate-y-4`;
                case 'slideDown':
                    return `${baseClasses} opacity-10 transform translate-y-4`;
                case 'scaleIn':
                    return `${baseClasses} opacity-10 transform scale-95`;
                default:
                    return `${baseClasses} opacity-10`;
            }
        
        case 'entering':
            // Entering state - coming back to normal
            return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
        
        default:
            return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
    }
};

// Hook for managing question transitions
export const useQuestionTransition = (
    currentQuestionIndex: number,
    animationsEnabled: boolean = true
) => {
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
    const [transitionConfig, setTransitionConfig] = useState<TransitionConfig>(getRandomTransition());
    const [isUserInteractionBlocked, setIsUserInteractionBlocked] = useState(false);
    const [animationKey, setAnimationKey] = useState(`transition-${Date.now()}`);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Only animate when animations are enabled and it's not the first question
        if (animationsEnabled && currentQuestionIndex > 0) {
            // Clear any existing timeouts
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
            
            // Block user interactions
            setIsUserInteractionBlocked(true);
            
            // Generate new random transition
            const newTransition = getRandomTransition();
            setTransitionConfig(newTransition);
            
            // Create new animation key to help with React re-rendering
            setAnimationKey(`transition-${currentQuestionIndex}-${Date.now()}`);
            
            // Start exit animation (subtle fade/move)
            setAnimationPhase('exiting');
            
            // After exit animation, start enter animation
            timeoutRef.current = setTimeout(() => {
                setAnimationPhase('entering');
                
                // After enter animation, return to idle and unblock interactions
                enterTimeoutRef.current = setTimeout(() => {
                    setAnimationPhase('idle');
                    setIsUserInteractionBlocked(false);
                }, 500); // 500ms duration for enter phase
            }, 500); // 500ms duration for exit phase
        } else if (!animationsEnabled) {
            setAnimationPhase('idle');
            setIsUserInteractionBlocked(false);
        } else {
            // First question - just show it
            setAnimationPhase('idle');
            setIsUserInteractionBlocked(false);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
        };
    }, [currentQuestionIndex, animationsEnabled]);

    return {
        transitionClasses: getTransitionClasses(transitionConfig, animationPhase, animationKey),
        isUserInteractionBlocked,
        transitionConfig,
        animationKey,
        animationPhase,
        isAnimating: animationPhase !== 'idle'
    };
};

// Utility to create a blocking overlay during animations
export const getBlockingOverlayClasses = (isBlocked: boolean) => {
    return isBlocked 
        ? 'pointer-events-none select-none' 
        : '';
};
