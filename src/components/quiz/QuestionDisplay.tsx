

import React from 'react';
import type { Question } from '../../store/quiz-store';

interface QuestionDisplayProps {
    currentQuestion: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ currentQuestion }) => {
    if (!currentQuestion) return <div>No question available.</div>;
    return (
        <div>
            <h2>{currentQuestion.question}</h2>
        </div>
    );
};

export default QuestionDisplay;
