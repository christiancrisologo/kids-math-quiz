import React from 'react';
import { MobileButton } from '../ui/MobileButton';
import { useRouter } from 'next/navigation';

const NoHistory: React.FC = () => {
    const router = useRouter();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Game History Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start playing quizzes to see your history here!
            </p>
            <MobileButton
                variant="primary"
                size="lg"
                onClick={() => router.push('/')}
                icon="🎯"
            >
                Start a Quiz
            </MobileButton>
        </div>
    );
};

export default NoHistory;
