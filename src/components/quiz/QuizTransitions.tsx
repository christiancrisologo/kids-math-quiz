import React from 'react';

interface QuizTransitionsProps {
    transitionClasses: string;
    isUserInteractionBlocked: boolean;
    animationKey: string | number;
}

const QuizTransitions: React.FC<QuizTransitionsProps> = ({ transitionClasses, isUserInteractionBlocked, animationKey }) => {
    return (
        <div className={transitionClasses} key={animationKey}>
            {isUserInteractionBlocked && (
                <div className="overlay">Animation in progress...</div>
            )}
            {/* Add more animation/overlay logic as needed */}
        </div>
    );
};

export default QuizTransitions;
