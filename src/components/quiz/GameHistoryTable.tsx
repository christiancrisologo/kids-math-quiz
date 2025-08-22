import React from 'react';
import { GameResult } from '../../utils/storage';
import GameHistoryRow from './GameHistoryRow';

interface GameHistoryTableProps {
    history: GameResult[];
    formatDate: (date: Date) => string;
    formatTime: (seconds: number) => string;
    getScoreColor: (score: number) => string;
}

const GameHistoryTable: React.FC<GameHistoryTableProps> = ({ history, formatDate, formatTime, getScoreColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quiz History</h3>
        </div>
        {/* Table Content */}
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Game Settings</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {history.map((game: GameResult) => (
                        <GameHistoryRow
                            key={game.id}
                            game={game}
                            formatDate={formatDate}
                            formatTime={formatTime}
                            getScoreColor={getScoreColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default GameHistoryTable;
