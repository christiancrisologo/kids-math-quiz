import React from 'react';

interface EnhancedProgressBarProps {
    progress: number; // 0-100
    currentStreak?: number;
    correctCount?: number;
    incorrectCount?: number;
    totalQuestions?: number;
    showQuestionProgress?: boolean;
    showEmojis?: boolean;
    className?: string;
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
    progress,
    currentStreak = 0,
    correctCount = 0,
    incorrectCount = 0,
    totalQuestions = 0,
    showQuestionProgress = true,
    showEmojis = true,
    className = ''
}) => {
    const emojis = ['🌱', '🌿', '🌳', '🌟', '🎉'];
    const currentEmojiIndex = Math.min(Math.floor(progress / 20), emojis.length - 1);
    const currentEmoji = emojis[currentEmojiIndex];

    const getProgressColor = () => {
        if (progress < 20) return 'from-red-400 to-orange-400';
        if (progress < 40) return 'from-orange-400 to-yellow-400';
        if (progress < 60) return 'from-yellow-400 to-lime-400';
        if (progress < 80) return 'from-lime-400 to-green-400';
        return 'from-green-400 to-emerald-500';
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Question Progress Counts */}
            {showQuestionProgress && totalQuestions > 0 && (
                <div className="flex justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">✅</span>
                        <span className="text-green-800 dark:text-green-300 text-xs font-medium">
                            {correctCount}/{totalQuestions}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                        <span className="text-red-600 dark:text-red-400 text-sm font-bold">❌</span>
                        <span className="text-red-800 dark:text-red-300 text-xs font-medium">
                            {incorrectCount}/{totalQuestions}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out relative`}
                    style={{ width: `${progress}%` }}
                >
                    {/* Sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>

                {/* Moving emoji */}
                {showEmojis && progress > 0 && (
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-xl transition-all duration-500 ease-out animate-bounce-gentle"
                        style={{ left: `${Math.max(8, progress)}%` }}
                    >
                        {currentEmoji}
                    </div>
                )}
            </div>

            {/* Streak indicator */}
            {currentStreak > 0 && (
                <div className="flex items-center justify-center mt-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        🔥 {currentStreak} streak!
                    </div>
                </div>
            )}
        </div>
    );
};
