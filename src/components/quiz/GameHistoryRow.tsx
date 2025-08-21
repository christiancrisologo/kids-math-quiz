import React from 'react';
import { GameResult } from '../../utils/storage';

interface GameHistoryRowProps {
    game: GameResult;
    formatDate: (date: Date) => string;
    formatTime: (seconds: number) => string;
    getScoreColor: (score: number) => string;
}

const GameHistoryRow: React.FC<GameHistoryRowProps> = ({ game, formatDate, formatTime, getScoreColor }) => (
    <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatDate(game?.created_at ? new Date(game.created_at) : game.completedAt)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
            <span className={`text-lg font-bold ${getScoreColor(game.score)}`}>{game.score}%</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {game.settings.difficulty.charAt(0).toUpperCase() + game.settings.difficulty.slice(1)}
        </td>
        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
            <div className="space-y-1">
                <div>📝 {game.settings.questionType?.charAt(0).toUpperCase() + game.settings.questionType?.slice(1) || 'Multiple Choice'}</div>
                <div>🔢 {game.settings.numberTypes?.map((type: string) => type.charAt(0).toUpperCase() + type.slice(1)).join(', ') || 'Integers'}</div>
                <div>➕ {game.settings.mathOperations.map((op: string) => op.charAt(0).toUpperCase() + op.slice(1)).join(', ')}</div>
            </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
            <div className="space-y-1">
                <div>{game.correctAnswers}/{game.totalQuestions} correct</div>
                {game.timeSpent > 0 && <div>⏱️ {formatTime(game.timeSpent)}</div>}
            </div>
        </td>
    </tr>
);

export default GameHistoryRow;
