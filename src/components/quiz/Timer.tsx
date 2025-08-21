import React from 'react';

interface TimerProps {
    timeRemaining: number;
    overallTimeRemaining: number;
    timerEnabled: boolean;
    overallTimerEnabled: boolean;
}

const Timer: React.FC<TimerProps> = ({
    timeRemaining,
    overallTimeRemaining,
    timerEnabled,
    overallTimerEnabled,
}) => {
    return (
        <div>
            {timerEnabled && (
                <div>Time Remaining: {timeRemaining}s</div>
            )}
            {overallTimerEnabled && (
                <div>Overall Time Remaining: {overallTimeRemaining}s</div>
            )}
        </div>
    );
};

export default Timer;
