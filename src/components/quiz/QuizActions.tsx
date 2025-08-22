
import React from 'react';
import { MobileButton } from '../ui/MobileButton';

interface QuizActionsProps {
    onSubmit: () => void;
    onNext: () => void;
    isSubmitDisabled?: boolean;
    isNextDisabled?: boolean;
}

const QuizActions: React.FC<QuizActionsProps> = ({ onSubmit, onNext, isSubmitDisabled, isNextDisabled }) => {
    return (
        <div className="flex gap-4 w-full">
            <MobileButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={onSubmit}
                disabled={isSubmitDisabled}
            >
                Submit
            </MobileButton>
            <MobileButton
                variant="secondary"
                size="lg"
                fullWidth
                onClick={onNext}
                disabled={isNextDisabled}
            >
                Next
            </MobileButton>
        </div>
    );
};

export default QuizActions;
