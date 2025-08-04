import React from 'react';

interface FunProgressBarProps {
    progress: number; // 0-100
    currentStreak?: number;
    showEmojis?: boolean;
    className?: string;
}

export const FunProgressBar: React.FC<FunProgressBarProps> = ({
    progress,
    currentStreak = 0,
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
