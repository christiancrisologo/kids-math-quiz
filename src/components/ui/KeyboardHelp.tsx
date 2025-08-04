import React, { useState } from 'react';

interface KeyboardHelpProps {
    className?: string;
}

export const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                title="Keyboard shortcuts"
            >
                ⌨️
            </button>

            {isVisible && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 p-4 min-w-64 z-50">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Keyboard Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Submit answer:</span>
                            <kbd className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">Enter</kbd>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Number input:</span>
                            <kbd className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">0-9</kbd>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Fractions:</span>
                            <kbd className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">/</kbd>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};
