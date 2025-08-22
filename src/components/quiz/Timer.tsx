import React from 'react';

interface TimerProps {
    timeRemaining: number;
    overallTimeRemaining: number;
    timerEnabled: boolean;
    overallTimerEnabled: boolean;
    useIcon?: boolean; // Option flag for icon or label
    warningSeconds?: number; // Flag for warning time left
}

const Timer: React.FC<TimerProps> = ({
    timeRemaining,
    overallTimeRemaining,
    timerEnabled,
    overallTimerEnabled,
    useIcon = true, // Default to icon
    warningSeconds = 5, // Default warning threshold
}) => {
    // Helper for warning style
        // Removed unused variable getWarningStyle

    return (
        <div>
            {timerEnabled && (
                <div style={{ ...(timeRemaining <= warningSeconds ? { color: '#ef4444', animation: 'blink 1s steps(2, start) infinite' } : {}) }}>
                    {useIcon ? (
                        <span role="img" aria-label="timer">⏰</span>
                    ) : (
                        <span>Time Remaining:</span>
                    )} {timeRemaining}s
                </div>
            )}
            {overallTimerEnabled && (
                <div style={{ ...(overallTimeRemaining <= warningSeconds ? { color: '#ef4444', animation: 'blink 1s steps(2, start) infinite' } : {}) }}>
                    {useIcon ? (
                        <span role="img" aria-label="timer">🕐</span>
                    ) : (
                        <span>Overall Time Remaining:</span>
                    )} {overallTimeRemaining}s
                </div>
            )}
            <style>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Timer;
