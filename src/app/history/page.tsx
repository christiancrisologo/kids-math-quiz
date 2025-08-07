'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gameHistoryStorage, GameResult } from '../../utils/storage';
import { useQuizStore } from '../../store/quiz-store';
import { useIsMobile } from '../../utils/responsive';
import { MobileButton } from '../../components/ui/MobileButton';

export default function HistoryPage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { settings } = useQuizStore();
    const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
    const [loading, setLoading] = useState(true);

    // Load game history on component mount
    useEffect(() => {
        try {
            const history = gameHistoryStorage.loadAll();
            setGameHistory(history);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load game history:', error);
            setLoading(false);
        }
    }, []);

    // Get unique usernames for filter dropdown - removed since we're showing single user history

    // Sort history based on selected sort option
    const sortedHistory = [...gameHistory].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        } else {
            return b.score - a.score;
        }
    });

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (seconds: number) => {
        if (seconds < 60) {
            return `${Math.round(seconds)}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all game history? This action cannot be undone.')) {
            try {
                gameHistoryStorage.clear();
                setGameHistory([]);
            } catch (error) {
                console.error('Failed to clear history:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading history...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
            <div className={`container mx-auto px-4 py-8 ${isMobile ? 'max-w-full' : 'max-w-6xl'}`}>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        🏆 {settings.username ? `${settings.username} Game History` : 'Game History'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Review your quiz performance and track your progress
                    </p>
                </div>

                {/* Controls */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 ${isMobile ? 'space-y-4' : 'flex justify-between items-center'
                    }`}>
                    <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'items-center'}`}>
                        {/* Sort Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Sort by:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="date">Date</option>
                                <option value="score">Score</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex gap-2 ${isMobile ? 'justify-center' : ''}`}>
                        <MobileButton
                            variant="secondary"
                            size="sm"
                            onClick={clearHistory}
                            icon="🗑️"
                        >
                            Clear All History
                        </MobileButton>
                    </div>
                </div>

                {/* Game History List */}
                {sortedHistory.length === 0 ? (
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
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quiz History</h3>
                        </div>

                        {/* Table Content */}
                        <div className={`${isMobile ? 'overflow-x-auto' : ''}`}>
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Year Level
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Game Settings
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Performance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                    {sortedHistory.map((game: GameResult) => (
                                        <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {formatDate(game.completedAt)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`text-lg font-bold ${getScoreColor(game.score)}`}>
                                                    {game.score}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {game.settings.difficulty.charAt(0).toUpperCase() + game.settings.difficulty.slice(1)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="space-y-1">
                                                    <div>📝 {game.settings.questionType?.charAt(0).toUpperCase() + game.settings.questionType?.slice(1) || 'Multiple Choice'}</div>
                                                    <div>🔢 {game.settings.numberTypes?.map((type: string) =>
                                                        type.charAt(0).toUpperCase() + type.slice(1)
                                                    ).join(', ') || 'Integers'}</div>
                                                    <div>➕ {game.settings.mathOperations.map((op: string) =>
                                                        op.charAt(0).toUpperCase() + op.slice(1)
                                                    ).join(', ')}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="space-y-1">
                                                    <div>{game.correctAnswers}/{game.totalQuestions} correct</div>
                                                    {game.timeSpent > 0 && <div>⏱️ {formatTime(game.timeSpent)}</div>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <MobileButton
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/')}
                        icon="🏠"
                    >
                        Back to Home
                    </MobileButton>
                </div>
            </div>
        </div>
    );
}
