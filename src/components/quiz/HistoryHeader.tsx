import React from 'react';

interface HistoryHeaderProps {
    username?: string;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ username }) => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🏆 {username ? `${username} Game History` : 'Game History'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
            Review your quiz performance and track your progress
        </p>
    </div>
);

export default HistoryHeader;
