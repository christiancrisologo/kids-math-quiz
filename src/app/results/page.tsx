'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quiz-store';

export default function ResultsPage() {
    const router = useRouter();
    const { settings, questions, resetQuiz } = useQuizStore();

    // Redirect if no questions (shouldn't happen, but safety check)
    useEffect(() => {
        if (questions.length === 0) {
            router.push('/');
        }
    }, [questions.length, router]);

    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const getGradeMessage = (percentage: number) => {
        if (percentage >= 90) return { emoji: '🌟', message: 'Outstanding! You\'re a math superstar!' };
        if (percentage >= 80) return { emoji: '🎉', message: 'Excellent work! Keep it up!' };
        if (percentage >= 70) return { emoji: '👏', message: 'Great job! You\'re doing well!' };
        if (percentage >= 60) return { emoji: '👍', message: 'Good effort! Keep practicing!' };
        return { emoji: '💪', message: 'Don\'t give up! Practice makes perfect!' };
    };

    const gradeInfo = getGradeMessage(percentage);

    const handleRetryQuiz = () => {
        // Keep the same settings but generate new questions
        router.push('/');
    };

    const handleNewQuiz = () => {
        resetQuiz();
        router.push('/');
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🎯 Quiz Results
                    </h1>
                    <p className="text-gray-600">Great job, {settings.username}!</p>
                </div>

                {/* Score Summary */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8 text-center">
                    <div className="text-6xl mb-4">{gradeInfo.emoji}</div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                        {correctAnswers} / {totalQuestions}
                    </div>
                    <div className="text-2xl font-semibold text-purple-600 mb-3">
                        {percentage}% Correct
                    </div>
                    <div className="text-lg text-gray-700">
                        {gradeInfo.message}
                    </div>
                </div>

                {/* Question Details */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Question Review</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`p-4 rounded-lg border-2 ${question.isCorrect
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-red-300 bg-red-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-700">
                                            Q{index + 1}: {question.question} = {question.answer}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">
                                            Your answer: {
                                                question.userAnswer !== undefined
                                                    ? question.userAnswer === -1
                                                        ? 'No answer'
                                                        : question.userAnswer
                                                    : 'No answer'
                                            }
                                        </span>
                                        <span className="text-2xl">
                                            {question.isCorrect ? '✅' : '❌'}
                                        </span>
                                    </div>
                                </div>
                                {question.timeSpent !== undefined && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Time spent: {question.timeSpent}s
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quiz Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{settings.difficulty}</div>
                        <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{settings.mathOperation}</div>
                        <div className="text-sm text-gray-600">Operation</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-pink-600">{settings.questionType}</div>
                        <div className="text-sm text-gray-600">Question Type</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleRetryQuiz}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        🔄 Try Again (Same Settings)
                    </button>
                    <button
                        onClick={handleNewQuiz}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                        🆕 New Quiz (Change Settings)
                    </button>
                </div>
            </div>
        </div>
    );
}
