'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quiz-store';
import { useIsMobile } from '../../utils/responsive';
import { MobileButton } from '../../components/ui/MobileButton';
import { ConfettiEffect } from '../../components/ui/ConfettiEffect';
import { playSound } from '../../utils/sounds';
import { checkAchievements } from '../../utils/achievements';
import { generateQuestions } from '../../utils/math/question-generator';

export default function ResultsPage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { settings, questions, resetQuiz, bestStreak, retryQuiz } = useQuizStore();

    // Redirect if no questions (shouldn't happen, but safety check)
    useEffect(() => {
        if (questions.length === 0) {
            router.push('/');
        } else {
            // Play completion sound when results load
            setTimeout(() => playSound('completion'), 500);
        }
    }, [questions.length, router]);

    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const achievements = checkAchievements(correctAnswers, totalQuestions, bestStreak, settings);

    const getGradeMessage = (percentage: number) => {
        const funnyQuotes = [
            "You're like a calculator, but way cooler! 🧮✨",
            "Math wizard in training! Your powers are growing! 🧙‍♂️📚",
            "Houston, we have a math genius! 🚀🌟",
            "You're making numbers dance! 💃🔢",
            "Math superhero alert! 🦸‍♂️🔥",
            "You're sharper than a pencil! ✏️⚡",
            "Number ninja in action! 🥷🔢",
            "You're solving problems faster than a cheetah! 🐆💨",
            "Math magician extraordinaire! 🎩✨",
            "You're cooking up some serious math skills! 👨‍🍳🔥"
        ];

        const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

        if (percentage >= 90) return { emoji: '�', message: randomQuote };
        if (percentage >= 80) return { emoji: '🎉', message: randomQuote };
        if (percentage >= 70) return { emoji: '👏', message: randomQuote };
        if (percentage >= 60) return { emoji: '👍', message: randomQuote };
        return { emoji: '💪', message: randomQuote };
    };

    const gradeInfo = getGradeMessage(percentage);

    const handleRetryQuiz = () => {
        // Generate new questions with the same settings and go directly to quiz
        const newQuestions = generateQuestions(
            settings.numberOfQuestions,
            settings.difficulty,
            settings.mathOperations,
            settings.questionType,
            settings.numberTypes // Add number types parameter
        );
        retryQuiz(newQuestions);
        // Reset current streak for the new quiz
        // Note: we keep bestStreak to maintain the user's record
        router.push('/quiz');
    };

    const handleNewQuiz = () => {
        resetQuiz();
        router.push('/');
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 dark:from-emerald-900 dark:via-blue-800 dark:to-violet-900 flex items-center justify-center p-4">
                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 dark:border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-green-400 to-blue-500 dark:from-amber-900 dark:via-emerald-800 dark:to-blue-900">
            <div className={`${isMobile ? 'p-4' : 'flex items-center justify-center p-4 min-h-screen'}`}>
                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${isMobile ? 'max-w-md mx-auto' : 'max-w-4xl'
                    } ${isMobile ? 'p-6' : 'p-8'} relative`}>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`font-bold text-gray-800 dark:text-gray-200 mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                            🎯 Matherific Results!
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {gradeInfo.message}
                        </p>
                    </div>

                    {/* Score Summary */}
                    <div className={`bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-900/30 dark:via-pink-900/30 dark:to-purple-900/30 rounded-2xl text-center mb-8 animate-float border-4 border-gradient-to-r from-rainbow-200 to-rainbow-400 ${isMobile ? 'p-6' : 'p-8'
                        }`}>
                        <div className={`mb-4 ${isMobile ? 'text-4xl' : 'text-6xl'} animate-bounce-gentle`}>{gradeInfo.emoji}</div>
                        <div className={`font-bold text-gray-800 dark:text-gray-200 mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'} animate-shimmer`}>
                            {correctAnswers} / {totalQuestions}
                        </div>
                        <div className={`font-semibold text-purple-600 dark:text-purple-400 mb-3 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                            {percentage}% Correct
                        </div>
                        <div className={`text-gray-700 dark:text-gray-300 ${isMobile ? 'text-base' : 'text-lg'}`}>
                            Great job, {settings.username}! 🎉
                        </div>

                        {/* Best Streak Display */}
                        {bestStreak > 0 && (
                            <div className="mt-4">
                                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
                                    <span className="text-xl">🔥</span>
                                    <span className="font-bold">Best Streak: {bestStreak}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Question Details */}
                    <div className="mb-8">
                        <h2 className={`font-bold text-gray-800 dark:text-gray-200 mb-4 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                            📋 Question Review
                        </h2>
                        <div className={`space-y-3 ${isMobile ? 'max-h-64' : 'max-h-96'} overflow-y-auto`}>
                            {questions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className={`rounded-lg border-2 ${question.isCorrect
                                        ? 'border-green-300 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                                        : 'border-red-300 dark:border-red-600 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
                                        } ${isMobile ? 'p-3' : 'p-4'} animate-bounce-gentle hover:shadow-lg transition-all duration-200`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {isMobile ? (
                                        /* Mobile Layout - Stacked */
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    Q{index + 1}: {
                                                        question.variable && question.equation
                                                            ? `${question.equation} (${question.variable} = ${question.fractionAnswer || question.answer})`
                                                            : `${question.question} = ${question.fractionAnswer || question.answer}`
                                                    }
                                                </span>
                                                <span className="text-xl">
                                                    {question.isCorrect ? '✅' : '❌'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                Your answer: {
                                                    question.userFractionAnswer !== undefined
                                                        ? question.userFractionAnswer || 'No answer'
                                                        : question.userAnswer !== undefined
                                                            ? question.userAnswer === -1
                                                                ? 'No answer'
                                                                : question.userAnswer
                                                            : 'No answer'
                                                }
                                            </div>
                                            {question.timeSpent !== undefined && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                    Time: {question.timeSpent}s
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Desktop Layout - Horizontal */
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        Q{index + 1}: {
                                                            question.variable && question.equation
                                                                ? `${question.equation} (${question.variable} = ${question.fractionAnswer || question.answer})`
                                                                : `${question.question} = ${question.fractionAnswer || question.answer}`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Your answer: {
                                                            question.userFractionAnswer !== undefined
                                                                ? question.userFractionAnswer || 'No answer'
                                                                : question.userAnswer !== undefined
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
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    Time spent: {question.timeSpent}s
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    {achievements.length > 0 && (
                        <div className="mb-8">
                            <h2 className={`font-bold text-gray-800 dark:text-gray-200 mb-4 text-center ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                                🏆 Achievements Unlocked! 🏆
                            </h2>
                            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {achievements.map((achievement, index) => (
                                    <div
                                        key={achievement.id}
                                        className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-3 text-center border-2 border-yellow-300 dark:border-yellow-600 animate-bounce-gentle"
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                    >
                                        <div className="text-2xl mb-1">{achievement.emoji}</div>
                                        <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{achievement.title}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quiz Summary */}
                    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl mb-8 ${isMobile ? 'p-4' : 'p-6'}`}>
                        <h3 className={`font-bold text-gray-800 dark:text-gray-200 mb-3 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                            📋 Quiz Settings
                        </h3>
                        <div className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            <div className="mb-2">
                                <span className="font-medium">Difficulty:</span> {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Operations:</span> {settings.mathOperations.map(op => op.charAt(0).toUpperCase() + op.slice(1)).join(', ')}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Number Types:</span> {settings.numberTypes?.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ') || 'Integers'}
                            </div>
                            <div>
                                <span className="font-medium">Question Type:</span> {settings.questionType.charAt(0).toUpperCase() + settings.questionType.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`space-y-4 ${!isMobile ? 'md:grid md:grid-cols-2 md:gap-4 md:space-y-0' : ''}`}>
                        <MobileButton
                            variant="secondary"
                            size="lg"
                            fullWidth
                            onClick={handleRetryQuiz}
                            icon="🔄"
                        >
                            Try Again
                        </MobileButton>
                        <MobileButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleNewQuiz}
                            icon="�"
                        >
                            Back to Home
                        </MobileButton>
                    </div>
                </div>
            </div>

            {/* Confetti Effect for great results */}
            <ConfettiEffect isVisible={percentage >= 80} />
        </div>
    );
}
