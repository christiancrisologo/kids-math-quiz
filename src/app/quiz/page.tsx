'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quiz-store';
import { useIsMobile } from '../../utils/responsive';
import { MobileButton } from '../../components/ui/MobileButton';
import { MobileInput } from '../../components/ui/MobileInput';

export default function QuizPage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const {
        settings,
        questions,
        currentQuestionIndex,
        timeRemaining,
        isQuizActive,
        isQuizCompleted,
        startQuiz,
        nextQuestion,
        submitAnswer,
        setTimeRemaining,
        completeQuiz,
    } = useQuizStore();

    const [userInput, setUserInput] = useState('');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const currentQuestion = questions[currentQuestionIndex];

    const handleTimeUp = useCallback(() => {
        // Submit empty/null answer when time runs out
        if (settings.questionType === 'expression') {
            submitAnswer(userInput ? parseFloat(userInput) || 0 : 0);
        } else {
            submitAnswer(selectedOption || -1);
        }

        setUserInput('');
        setSelectedOption(null);

        if (currentQuestionIndex >= questions.length - 1) {
            completeQuiz();
        } else {
            nextQuestion();
        }
    }, [settings.questionType, userInput, selectedOption, submitAnswer, currentQuestionIndex, questions.length, completeQuiz, nextQuestion]);

    // Start quiz when component mounts
    useEffect(() => {
        if (questions.length > 0 && !isQuizActive && !isQuizCompleted) {
            startQuiz();
        }
    }, [questions, isQuizActive, isQuizCompleted, startQuiz]);

    // Timer logic
    useEffect(() => {
        if (!isQuizActive || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(timeRemaining - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isQuizActive, timeRemaining, setTimeRemaining]);

    // Auto-advance when timer reaches 0
    useEffect(() => {
        if (timeRemaining === 0 && isQuizActive) {
            handleTimeUp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRemaining, isQuizActive]);

    // Redirect if no questions
    useEffect(() => {
        if (questions.length === 0) {
            router.push('/');
        }
    }, [questions.length, router]);

    // Redirect to results when quiz is completed
    useEffect(() => {
        if (isQuizCompleted) {
            router.push('/results');
        }
    }, [isQuizCompleted, router]);

    const handleSubmitAnswer = () => {
        let answer: number;

        if (settings.questionType === 'expression') {
            answer = parseFloat(userInput) || 0;
        } else {
            answer = selectedOption !== null ? selectedOption : -1;
        }

        submitAnswer(answer);
        setUserInput('');
        setSelectedOption(null);

        if (currentQuestionIndex >= questions.length - 1) {
            completeQuiz();
        } else {
            nextQuestion();
        }
    };

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 flex items-center justify-center p-4">
                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 dark:border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-blue-500 dark:from-violet-900 dark:via-purple-800 dark:to-indigo-900">
            {/* Mobile Layout */}
            {isMobile ? (
                <div className="flex flex-col min-h-screen">
                    {/* Mobile Header - Fixed Top */}
                    <div className="bg-white dark:bg-slate-800 shadow-lg p-4 sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {currentQuestionIndex + 1}/{questions.length}
                            </span>
                            <div className={`text-xl font-bold px-3 py-1 rounded-lg ${timeRemaining <= 5
                                ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 animate-pulse'
                                : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                                }`}>
                                ⏰ {timeRemaining}s
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 dark:from-yellow-300 dark:via-pink-400 dark:to-purple-400 h-2 rounded-full transition-all duration-500 animate-shimmer"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Mobile Content Area */}
                    <div className="flex-1 flex flex-col p-4">
                        {/* Greeting */}
                        <div className="text-center mb-6">
                            <h1 className="text-lg font-bold text-white">
                                Hi {settings.username}! 👋🌟 Let&apos;s solve some fun problems! 🎲✨
                            </h1>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 flex-1 flex items-center justify-center animate-bounce-gentle">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                                    {currentQuestion.variable ? (
                                        <div>
                                            <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">Solve for {currentQuestion.variable}:</div>
                                            <div>{currentQuestion.question}</div>
                                        </div>
                                    ) : (
                                        `${currentQuestion.question} = ?`
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Answer Area - Bottom Sheet Style */}
                        <div className="bg-white dark:bg-slate-800 rounded-t-3xl shadow-lg p-6 pb-8">
                            {settings.questionType === 'expression' ? (
                                <div className="space-y-4">
                                    <MobileInput
                                        type="number"
                                        placeholder={currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` : "Your answer"}
                                        value={userInput}
                                        onChange={setUserInput}
                                        inputMode="numeric"
                                        fullWidth
                                    />
                                    <MobileButton
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={handleSubmitAnswer}
                                        disabled={!userInput.trim()}
                                        icon={currentQuestionIndex >= questions.length - 1 ? '🏁' : '➡️'}
                                    >
                                        {currentQuestionIndex >= questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    </MobileButton>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {currentQuestion.options?.map((option, index) => (
                                            <MobileButton
                                                key={index}
                                                variant={selectedOption === option ? 'primary' : 'tile'}
                                                size="lg"
                                                fullWidth
                                                onClick={() => setSelectedOption(option)}
                                            >
                                                {String.fromCharCode(65 + index)}. {option}
                                            </MobileButton>
                                        ))}
                                    </div>
                                    <MobileButton
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={handleSubmitAnswer}
                                        disabled={selectedOption === null}
                                        icon={currentQuestionIndex >= questions.length - 1 ? '🏁' : '➡️'}
                                    >
                                        {currentQuestionIndex >= questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    </MobileButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Desktop Layout - Keep existing */
                <div className="flex items-center justify-center p-4 min-h-screen">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                Hi {settings.username}! 👋
                            </h1>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                                <div className={`text-2xl font-bold ${timeRemaining <= 5 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-purple-600 dark:text-purple-400'}`}>
                                    ⏰ {timeRemaining}s
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 mb-6">
                                <div
                                    className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-300 dark:via-blue-400 dark:to-purple-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="text-center mb-8">
                            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                {currentQuestion.variable ? (
                                    <div>
                                        <div className="text-lg text-purple-600 dark:text-purple-400 mb-2">Solve for {currentQuestion.variable}:</div>
                                        <div>{currentQuestion.question}</div>
                                    </div>
                                ) : (
                                    `${currentQuestion.question} = ?`
                                )}
                            </div>
                        </div>

                        {/* Answer Input */}
                        <div className="mb-8">
                            {settings.questionType === 'expression' ? (
                                <div>
                                    <input
                                        type="number"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                                        className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                                        placeholder={currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` : "Enter your answer"}
                                        autoFocus
                                        inputMode="numeric"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {currentQuestion.options?.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedOption(option)}
                                            className={`px-6 py-4 text-xl rounded-xl border-2 transition-all ${selectedOption === option
                                                ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100'
                                                }`}
                                        >
                                            {String.fromCharCode(65 + index)}. {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={
                                settings.questionType === 'expression'
                                    ? !userInput.trim()
                                    : selectedOption === null
                            }
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {currentQuestionIndex >= questions.length - 1 ? '🏁 Finish Quiz' : '➡️ Next Question'}
                        </button>

                        {/* Quiz Info */}
                        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Difficulty: {settings.difficulty} | Operation: {settings.mathOperation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
