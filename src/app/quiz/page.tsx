'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quiz-store';
import { useIsMobile } from '../../utils/responsive';
import { MobileButton } from '../../components/ui/MobileButton';
import { MobileTile } from '../../components/ui/MobileTile';
import { MobileInput } from '../../components/ui/MobileInput';
import { FractionInput } from '../../components/ui/FractionInput';
import { FunProgressBar } from '../../components/ui/FunProgressBar';
import { playSound, vibrate } from '../../utils/sounds';

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
        currentStreak,
        startQuiz,
        nextQuestion,
        submitAnswer,
        submitFractionAnswer,
        setTimeRemaining,
        completeQuiz,
    } = useQuizStore();

    const [userInput, setUserInput] = useState('');
    const [userFractionInput, setUserFractionInput] = useState('');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [selectedFractionOption, setSelectedFractionOption] = useState<string | null>(null);

    // Refs for auto-focus
    const inputRef = useRef<HTMLInputElement>(null);
    const fractionInputRef = useRef<HTMLInputElement>(null);

    const currentQuestion = questions[currentQuestionIndex];

    // Helper function to check if current question is a fraction question
    const isFractionQuestion = currentQuestion && currentQuestion.fractionAnswer !== undefined;

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

    // Auto-focus input when new question starts or settings change
    useEffect(() => {
        if (currentQuestion && isQuizActive) {
            setTimeout(() => {
                if (settings.questionType === 'expression') {
                    if (isFractionQuestion && fractionInputRef.current) {
                        fractionInputRef.current.focus();
                    } else if (!isFractionQuestion && inputRef.current) {
                        inputRef.current.focus();
                    }
                }
            }, 100); // Small delay to ensure rendering is complete
        }
    }, [currentQuestion, isQuizActive, settings.questionType, isFractionQuestion]);

    const handleTimeUp = () => {
        // Submit empty/null answer when time runs out
        if (isFractionQuestion) {
            if (settings.questionType === 'expression') {
                submitAnswer(0); // Submit 0 for timeout on fraction expression
            } else {
                submitAnswer(-1); // Submit -1 for timeout on fraction multiple choice
            }
        } else if (settings.questionType === 'expression') {
            submitAnswer(userInput ? parseFloat(userInput) || 0 : 0);
        } else {
            submitAnswer(selectedOption || -1);
        }

        // Clear all inputs
        setUserInput('');
        setUserFractionInput('');
        setSelectedOption(null);
        setSelectedFractionOption(null);

        if (currentQuestionIndex >= questions.length - 1) {
            completeQuiz();
        } else {
            nextQuestion();
        }
    };

    const handleSubmitAnswer = () => {
        let isCorrect = false;

        if (isFractionQuestion) {
            // Handle fraction questions
            if (settings.questionType === 'expression') {
                submitFractionAnswer(userFractionInput.trim());
            } else {
                // Multiple choice fraction question
                submitFractionAnswer(selectedFractionOption || '');
            }
        } else {
            // Handle regular questions
            let answer: number;

            if (settings.questionType === 'expression') {
                answer = parseFloat(userInput) || 0;
            } else {
                answer = selectedOption !== null ? selectedOption : -1;
            }

            submitAnswer(answer);
        }

        // Check if answer was correct (we need to check the updated question)
        const updatedQuestion = questions[currentQuestionIndex];
        if (updatedQuestion) {
            setTimeout(() => {
                const question = useQuizStore.getState().questions[currentQuestionIndex];
                isCorrect = question?.isCorrect || false;

                // Show visual and audio feedback
                if (isCorrect) {
                    playSound('correct');
                    vibrate([100, 50, 100]);
                } else {
                    playSound('incorrect');
                    vibrate(200);
                }
            }, 100);
        }

        // Clear all inputs
        setUserInput('');
        setUserFractionInput('');
        setSelectedOption(null);
        setSelectedFractionOption(null);

        if (currentQuestionIndex >= questions.length - 1) {
            setTimeout(() => {
                playSound('completion');
                completeQuiz();
            }, 1500);
        } else {
            setTimeout(() => {
                nextQuestion();
                // Auto-focus after moving to next question
                setTimeout(() => {
                    if (settings.questionType === 'expression') {
                        if (isFractionQuestion && fractionInputRef.current) {
                            fractionInputRef.current.focus();
                        } else if (!isFractionQuestion && inputRef.current) {
                            inputRef.current.focus();
                        }
                    }
                }, 100);
            }, 1500);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Check if user can submit
            const canSubmit = isFractionQuestion
                ? (settings.questionType === 'expression'
                    ? userFractionInput.trim()
                    : selectedFractionOption !== null)
                : (settings.questionType === 'expression'
                    ? userInput.trim()
                    : selectedOption !== null);

            if (canSubmit) {
                handleSubmitAnswer();
            }
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
                        <FunProgressBar
                            progress={progress}
                            currentStreak={currentStreak}
                            className="mb-4"
                        />
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
                                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
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
                        <div className="bg-white dark:bg-slate-800 rounded-t-3xl shadow-lg p-6 pb-8" onKeyDown={handleKeyPress}>
                            {settings.questionType === 'expression' ? (
                                <div className="space-y-4">
                                    {isFractionQuestion ? (
                                        <FractionInput
                                            ref={fractionInputRef}
                                            value={userFractionInput}
                                            onChange={setUserFractionInput}
                                            placeholder="Enter fraction (e.g., 3/4 or 1 2/3)"
                                            fullWidth
                                        />
                                    ) : (
                                        <MobileInput
                                            ref={inputRef}
                                            type="number"
                                            placeholder={currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` : "Your answer"}
                                            value={userInput}
                                            onChange={setUserInput}
                                            inputMode="numeric"
                                            fullWidth
                                            onKeyDown={handleKeyPress}
                                        />
                                    )}
                                    <MobileButton
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={handleSubmitAnswer}
                                        disabled={isFractionQuestion ? !userFractionInput.trim() : !userInput.trim()}
                                        icon={currentQuestionIndex >= questions.length - 1 ? '🏁' : '➡️'}
                                    >
                                        {currentQuestionIndex >= questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    </MobileButton>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {isFractionQuestion && currentQuestion.fractionOptions ? (
                                            // Fraction multiple choice options
                                            currentQuestion.fractionOptions.map((option, index) => (
                                                <MobileTile
                                                    key={index}
                                                    title={`${String.fromCharCode(65 + index)}. ${option}`}
                                                    isSelected={selectedFractionOption === option}
                                                    onClick={() => setSelectedFractionOption(option)}
                                                    compact={true}
                                                />
                                            ))
                                        ) : (
                                            // Regular multiple choice options
                                            currentQuestion.options?.map((option, index) => (
                                                <MobileTile
                                                    key={index}
                                                    title={`${String.fromCharCode(65 + index)}. ${option}`}
                                                    isSelected={selectedOption === option}
                                                    onClick={() => setSelectedOption(option)}
                                                    compact={true}
                                                />
                                            ))
                                        )}
                                    </div>
                                    <MobileButton
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={handleSubmitAnswer}
                                        disabled={isFractionQuestion ? selectedFractionOption === null : selectedOption === null}
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
                /* Desktop Layout */
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
                            <FunProgressBar
                                progress={progress}
                                currentStreak={currentStreak}
                                className="mb-6"
                            />
                        </div>

                        {/* Question */}
                        <div className="text-center mb-8">
                            <div className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                {currentQuestion.variable ? (
                                    <div>
                                        <div className="text-xl text-purple-600 dark:text-purple-400 mb-2">Solve for {currentQuestion.variable}:</div>
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
                                    {isFractionQuestion ? (
                                        <FractionInput
                                            ref={fractionInputRef}
                                            value={userFractionInput}
                                            onChange={setUserFractionInput}
                                            placeholder="Enter fraction (e.g., 3/4 or 1 2/3)"
                                            fullWidth
                                        />
                                    ) : (
                                        <input
                                            ref={inputRef}
                                            type="number"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            className="w-full px-6 py-4 text-3xl text-center border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                                            placeholder={currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` : "Enter your answer"}
                                            autoFocus
                                            inputMode="numeric"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {isFractionQuestion && currentQuestion.fractionOptions ? (
                                        // Fraction multiple choice options
                                        currentQuestion.fractionOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedFractionOption(option)}
                                                onKeyDown={handleKeyPress}
                                                className={`px-6 py-6 text-xl rounded-xl border-2 transition-all hover:scale-102 shadow-sm min-h-[80px] flex items-center justify-center ${selectedFractionOption === option
                                                    ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md'
                                                    : 'border-gray-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="font-semibold">{String.fromCharCode(65 + index)}. {option}</span>
                                            </button>
                                        ))
                                    ) : (
                                        // Regular multiple choice options
                                        currentQuestion.options?.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedOption(option)}
                                                onKeyDown={handleKeyPress}
                                                className={`px-6 py-6 text-xl rounded-xl border-2 transition-all hover:scale-102 shadow-sm min-h-[80px] flex items-center justify-center ${selectedOption === option
                                                    ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md'
                                                    : 'border-gray-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="font-semibold">{String.fromCharCode(65 + index)}. {option}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={
                                isFractionQuestion
                                    ? (settings.questionType === 'expression'
                                        ? !userFractionInput.trim()
                                        : selectedFractionOption === null)
                                    : (settings.questionType === 'expression'
                                        ? !userInput.trim()
                                        : selectedOption === null)
                            }
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {currentQuestionIndex >= questions.length - 1 ? '🏁 Finish Quiz' : '➡️ Next Question'}
                        </button>

                        {/* Quiz Info */}
                        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Difficulty: {settings.difficulty} | Operations: {settings.mathOperations.map(op =>
                                op.charAt(0).toUpperCase() + op.slice(1)
                            ).join(', ')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
