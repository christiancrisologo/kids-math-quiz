'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quiz-store';
import { useIsMobile } from '../../utils/responsive';
import { playSound, vibrate } from '../../utils/enhanced-sounds';
import { useSystemSettings } from '../../contexts/system-settings-context';
import { animationClasses } from '../../utils/enhanced-animations';
import { useQuestionTransition, getBlockingOverlayClasses } from '../../utils/question-transitions';
import { getChallengeMode } from '../../utils/challengeModes';
import QuestionDisplay from '../../components/quiz/QuestionDisplay';
import AnswerInput from '../../components/quiz/AnswerInput';
import OptionSelector from '../../components/quiz/OptionSelector';
import Timer from '../../components/quiz/Timer';
import QuizActions from '../../components/quiz/QuizActions';
import { FractionInput } from '../../components/ui/FractionInput';
import { MobileTile } from '../../components/ui/MobileTile';

export default function QuizPage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { settings: systemSettings } = useSystemSettings();
    const {
        settings,
        questions,
        currentQuestionIndex,
        timeRemaining,
        isQuizActive,
        isQuizCompleted,
        correctAnswersCount,
        incorrectAnswersCount,
        overallTimeRemaining,
        overallTimerActive,
        startQuiz,
        nextQuestion,
        submitAnswer,
        submitFractionAnswer,
        submitCurrencyAnswer,
        submitTimeAnswer,
        setTimeRemaining,
        setOverallTimeRemaining,
        completeQuiz,
    } = useQuizStore();

    const [userInput, setUserInput] = useState('');
    const [userFractionInput, setUserFractionInput] = useState('');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [selectedFractionOption, setSelectedFractionOption] = useState<string | null>(null);
    const [selectedCurrencyOption, setSelectedCurrencyOption] = useState<string | null>(null);
    const [selectedTimeOption, setSelectedTimeOption] = useState<string | null>(null);

    // Refs for auto-focus
    const inputRef = useRef<HTMLInputElement>(null);
    const fractionInputRef = useRef<HTMLInputElement>(null);

    // Question transition animations
    const {
        transitionClasses,
        isUserInteractionBlocked,
        animationKey,
    } = useQuestionTransition(currentQuestionIndex, systemSettings.animations);

    const currentQuestion = questions[currentQuestionIndex];

    // Helper functions to check question types
    const isFractionQuestion = currentQuestion && currentQuestion.fractionAnswer !== undefined;
    const isCurrencyQuestion = currentQuestion && currentQuestion.currencyOptions !== undefined;
    const isTimeQuestion = currentQuestion && currentQuestion.timeOptions !== undefined;

    // Start quiz when component mounts
    useEffect(() => {
        if (questions.length > 0 && !isQuizActive && !isQuizCompleted) {
            startQuiz();
        }
    }, [questions, isQuizActive, isQuizCompleted, startQuiz]);

    // Clear all inputs and selections when question changes
    useEffect(() => {
        setUserInput('');
        setUserFractionInput('');
        setSelectedOption(null);
        setSelectedFractionOption(null);
        setSelectedCurrencyOption(null);
        setSelectedTimeOption(null);
    }, [currentQuestionIndex]);

    // Timer logic - pause during animations and check if timer is enabled
    useEffect(() => {
        if (!isQuizActive || !settings.timerEnabled || timeRemaining <= 0 || isUserInteractionBlocked) return;

        const timer = setInterval(() => {
            setTimeRemaining(timeRemaining - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isQuizActive, timeRemaining, setTimeRemaining, isUserInteractionBlocked, settings.timerEnabled]);

    // Overall timer logic - separate from question timer
    useEffect(() => {
        if (!isQuizActive || !settings.overallTimerEnabled || !overallTimerActive || overallTimeRemaining <= 0) return;

        const overallTimer = setInterval(() => {
            setOverallTimeRemaining(overallTimeRemaining - 1);
        }, 1000);

        return () => clearInterval(overallTimer);
    }, [isQuizActive, overallTimeRemaining, setOverallTimeRemaining, settings.overallTimerEnabled, overallTimerActive]);

    // Auto-advance when timer reaches 0 (only if timer is enabled)
    useEffect(() => {
        if (settings.timerEnabled && timeRemaining === 0 && isQuizActive) {
            handleTimeUp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRemaining, isQuizActive, settings.timerEnabled]);

    // Handle overall timer timeout
    useEffect(() => {
        if (settings.overallTimerEnabled && overallTimeRemaining === 0 && isQuizActive) {
            // Force end the quiz when overall timer reaches 0
            playSound('incorrect', systemSettings); // Play warning sound
            vibrate(300, systemSettings); // Strong vibration
            completeQuiz();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overallTimeRemaining, isQuizActive, settings.overallTimerEnabled]);

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

    // Global Enter key handler
    useEffect(() => {
        const handleGlobalKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !isUserInteractionBlocked && isQuizActive) {
                // Check if user can submit based on question type
                let canSubmit = false;

                if (isFractionQuestion) {
                    canSubmit = settings.questionType === 'expression'
                        ? userFractionInput.trim().length > 0
                        : selectedFractionOption !== null;
                } else if (isCurrencyQuestion) {
                    canSubmit = settings.questionType === 'expression'
                        ? userInput.trim().length > 0
                        : selectedCurrencyOption !== null;
                } else if (isTimeQuestion) {
                    canSubmit = settings.questionType === 'expression'
                        ? userInput.trim().length > 0
                        : selectedTimeOption !== null;
                } else {
                    // Regular questions (integers, decimals)
                    canSubmit = settings.questionType === 'expression'
                        ? userInput.trim().length > 0
                        : selectedOption !== null;
                }

                if (canSubmit) {
                    e.preventDefault();
                    handleSubmitAnswer();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyPress);
        return () => window.removeEventListener('keydown', handleGlobalKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isUserInteractionBlocked,
        isQuizActive,
        isFractionQuestion,
        isCurrencyQuestion,
        isTimeQuestion,
        settings.questionType,
        userInput,
        userFractionInput,
        selectedOption,
        selectedFractionOption,
        selectedCurrencyOption,
        selectedTimeOption
    ]);

    const handleTimeUp = () => {
        // Submit empty/null answer when time runs out
        if (isFractionQuestion) {
            if (settings.questionType === 'expression') {
                submitAnswer(0); // Submit 0 for timeout on fraction expression
            } else {
                submitAnswer(-1); // Submit -1 for timeout on fraction multiple choice
            }
        } else if (isCurrencyQuestion) {
            if (settings.questionType === 'expression') {
                submitCurrencyAnswer(userInput || '');
            } else {
                submitCurrencyAnswer(''); // Submit empty string for timeout
            }
        } else if (isTimeQuestion) {
            if (settings.questionType === 'expression') {
                submitTimeAnswer(userInput || '');
            } else {
                submitTimeAnswer(''); // Submit empty string for timeout
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
        setSelectedCurrencyOption(null);
        setSelectedTimeOption(null);

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
        } else if (isCurrencyQuestion) {
            // Handle currency questions
            if (settings.questionType === 'expression') {
                // For expression, user enters currency value
                submitCurrencyAnswer(userInput.trim());
            } else {
                // Multiple choice currency question
                submitCurrencyAnswer(selectedCurrencyOption || '');
            }
        } else if (isTimeQuestion) {
            // Handle time questions
            if (settings.questionType === 'expression') {
                // For expression, user enters time value
                submitTimeAnswer(userInput.trim());
            } else {
                // Multiple choice time question
                submitTimeAnswer(selectedTimeOption || '');
            }
        } else {
            // Handle regular questions (integers, decimals)
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
                    playSound('correct', systemSettings);
                    vibrate([100, 50, 100], systemSettings);
                } else {
                    playSound('incorrect', systemSettings);
                    vibrate(200, systemSettings);
                }
            }, 100);
        }

        // Clear all inputs
        setUserInput('');
        setUserFractionInput('');
        setSelectedOption(null);
        setSelectedFractionOption(null);
        setSelectedCurrencyOption(null);
        setSelectedTimeOption(null);

        if (currentQuestionIndex >= questions.length - 1) {
            setTimeout(() => {
                playSound('completion', systemSettings);
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
        if (e.key === 'Enter' && !isUserInteractionBlocked) {
            // Check if user can submit based on question type
            let canSubmit = false;

            if (isFractionQuestion) {
                canSubmit = settings.questionType === 'expression'
                    ? userFractionInput.trim().length > 0
                    : selectedFractionOption !== null;
            } else if (isCurrencyQuestion) {
                canSubmit = settings.questionType === 'expression'
                    ? userInput.trim().length > 0
                    : selectedCurrencyOption !== null;
            } else if (isTimeQuestion) {
                canSubmit = settings.questionType === 'expression'
                    ? userInput.trim().length > 0
                    : selectedTimeOption !== null;
            } else {
                // Regular questions (integers, decimals)
                canSubmit = settings.questionType === 'expression'
                    ? userInput.trim().length > 0
                    : selectedOption !== null;
            }

            if (canSubmit) {
                handleSubmitAnswer();
            }
        }
    };

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 flex items-center justify-center p-4">
                <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl text-center ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'}`}>
                    <div className={`${animationClasses.spin(systemSettings)} rounded-full h-16 w-16 border-b-2 border-purple-500 dark:border-purple-400 mx-auto`}></div>
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
                            {/* Left side - Question number and score display */}
                            <div className="flex items-center space-x-4">
                                {settings.questionsEnabled ? (
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {currentQuestionIndex + 1}/{questions.length}
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Question {currentQuestionIndex + 1}
                                    </span>
                                )}

                                {/* Minimalist Score Display */}
                                <div className="flex items-center space-x-3 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-green-600 dark:text-green-400">✓</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">{correctAnswersCount}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-red-500 dark:text-red-400">✗</span>
                                        <span className="font-medium text-red-500 dark:text-red-400">{incorrectAnswersCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center - Username */}
                            <div className="flex-1 text-center">
                                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {settings.username}
                                </h1>
                            </div>

                            {/* Right side - Timer */}
                            <div className="flex items-center space-x-3">
                                <Timer
                                    timeRemaining={timeRemaining}
                                    overallTimeRemaining={overallTimeRemaining}
                                    timerEnabled={settings.timerEnabled}
                                    overallTimerEnabled={settings.overallTimerEnabled}
                                />
                            </div>
                        </div>

                        {/* Enhanced Progress Bar - Only for questions enabled mode */}
                        {settings.questionsEnabled ? (
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        ) : (
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, (correctAnswersCount / Math.max(1, correctAnswersCount + incorrectAnswersCount)) * 100)}%` }}
                                />
                            </div>
                        )}

                        {/* Countdown Warning - Show when time is low */}
                        {settings.overallTimerEnabled && overallTimeRemaining <= 5 && overallTimeRemaining > 0 && (
                            <div className={`bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-2 text-center ${animationClasses.pulse(systemSettings)}`}>
                                <p className="text-red-700 dark:text-red-300 font-bold text-sm">
                                    ⚠️ Time&apos;s Almost Up! {overallTimeRemaining} seconds remaining!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Content Area */}
                    <div className="flex-1 flex flex-col p-4">
                        <QuestionDisplay currentQuestion={currentQuestion} />
                        {settings.questionType === 'expression' ? (
                            <AnswerInput
                                value={isFractionQuestion ? userFractionInput : userInput}
                                onChange={isFractionQuestion ? setUserFractionInput : setUserInput}
                                placeholder={
                                    currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` :
                                        currentQuestion.variables && currentQuestion.variables.length > 0 ? `Enter value for ${currentQuestion.variables[0]}` :
                                            "Your answer"
                                }
                            />
                        ) : (
                            <OptionSelector
                                options={
                                    isFractionQuestion && currentQuestion.fractionOptions ? currentQuestion.fractionOptions :
                                        isCurrencyQuestion && currentQuestion.currencyOptions ? currentQuestion.currencyOptions :
                                            isTimeQuestion && currentQuestion.timeOptions ? currentQuestion.timeOptions :
                                                currentQuestion.options || []
                                }
                                selectedOption={
                                    isFractionQuestion ? selectedFractionOption :
                                        isCurrencyQuestion ? selectedCurrencyOption :
                                            isTimeQuestion ? selectedTimeOption :
                                                selectedOption
                                }
                                onSelect={(option) => {
                                    if (isFractionQuestion) setSelectedFractionOption(option as string);
                                    else if (isCurrencyQuestion) setSelectedCurrencyOption(option as string);
                                    else if (isTimeQuestion) setSelectedTimeOption(option as string);
                                    else setSelectedOption(option as number);
                                }}
                            />
                        )}
                        <QuizActions
                            onSubmit={handleSubmitAnswer}
                            onNext={currentQuestionIndex >= questions.length - 1 ? completeQuiz : nextQuestion}
                            isSubmitDisabled={
                                settings.questionType === 'expression'
                                    ? (isFractionQuestion ? !userFractionInput.trim() : !userInput.trim())
                                    : (isFractionQuestion ? selectedFractionOption === null :
                                        isCurrencyQuestion ? selectedCurrencyOption === null :
                                            isTimeQuestion ? selectedTimeOption === null :
                                                selectedOption === null)
                            }
                            isNextDisabled={false}
                        />
                        {/* Challenge Mode Container - Bottom */}
                        {settings.challengeMode && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 border-t border-purple-200 dark:border-purple-700">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">🏆 Challenge:</span>
                                        <span className="font-bold text-purple-800 dark:text-purple-300 text-sm">{settings.challengeMode}</span>
                                    </div>
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                        📋 {getChallengeMode(settings.challengeMode)?.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Desktop Layout */
                <div className="flex items-center justify-center p-4 min-h-screen">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl relative">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-between items-center mb-4">
                                {/* Left side - Question number and score */}
                                <div className="flex items-center space-x-6">
                                    {settings.questionsEnabled ? (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Question {currentQuestionIndex + 1}
                                        </span>
                                    )}

                                    {/* Minimalist Score Display */}
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-green-600 dark:text-green-400">✓</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">{correctAnswersCount}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-red-500 dark:text-red-400">✗</span>
                                            <span className="font-medium text-red-500 dark:text-red-400">{incorrectAnswersCount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center - Username */}
                                <div className="flex-1 text-center">
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {settings.username}
                                    </h1>
                                </div>

                                {/* Right side - Timer */}
                                <div className="flex items-center space-x-6">
                                    <Timer
                                        timeRemaining={timeRemaining}
                                        overallTimeRemaining={overallTimeRemaining}
                                        timerEnabled={settings.timerEnabled}
                                        overallTimerEnabled={settings.overallTimerEnabled}
                                    />
                                </div>
                            </div>

                            {/* Enhanced Progress Bar - Only for questions enabled mode */}
                            {settings.questionsEnabled ? (
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            ) : (
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(100, (correctAnswersCount / Math.max(1, correctAnswersCount + incorrectAnswersCount)) * 100)}%` }}
                                    />
                                </div>
                            )}

                            {/* Countdown Warning for Desktop - Show when time is low */}
                            {settings.overallTimerEnabled && overallTimeRemaining <= 5 && overallTimeRemaining > 0 && (
                                <div className={`bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-3 text-center mb-4 ${animationClasses.pulse(systemSettings)}`}>
                                    <p className="text-red-700 dark:text-red-300 font-bold">
                                        ⚠️ Time&apos;s Almost Up! {overallTimeRemaining} seconds remaining!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Question */}
                        <div className="text-center mb-8">
                            <div key={animationKey} className={`text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl ${transitionClasses}`}>
                                {currentQuestion.variable ? (
                                    <div>
                                        <div className="text-xl text-purple-600 dark:text-purple-400 mb-2">Solve for {currentQuestion.variable}:</div>
                                        <div>{currentQuestion.question}</div>
                                    </div>
                                ) : currentQuestion.variables && currentQuestion.variables.length > 0 ? (
                                    <div>
                                        <div className="text-xl text-purple-600 dark:text-purple-400 mb-2">Solve for {currentQuestion.variables.join(' and ')}:</div>
                                        <div>{currentQuestion.question}</div>
                                    </div>
                                ) : (
                                    `${currentQuestion.question} = ?`
                                )}
                            </div>
                        </div>

                        {/* Answer Input */}
                        <div className={`mb-8 ${getBlockingOverlayClasses(isUserInteractionBlocked)}`}>
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
                                            placeholder={
                                                currentQuestion.variable ? `Enter value for ${currentQuestion.variable}` :
                                                    currentQuestion.variables && currentQuestion.variables.length > 0 ? `Enter value for ${currentQuestion.variables[0]}` :
                                                        "Enter your answer"
                                            }
                                            autoFocus
                                            inputMode="numeric"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    ) : isCurrencyQuestion && currentQuestion.currencyOptions ? (
                                        // Currency multiple choice options
                                        currentQuestion.currencyOptions.map((option, index) => (
                                            <MobileTile
                                                key={index}
                                                title={`${String.fromCharCode(65 + index)}. ${option}`}
                                                isSelected={selectedCurrencyOption === option}
                                                onClick={() => setSelectedCurrencyOption(option)}
                                                compact={true}
                                            />
                                        ))
                                    ) : isTimeQuestion && currentQuestion.timeOptions ? (
                                        // Time multiple choice options
                                        currentQuestion.timeOptions.map((option, index) => (
                                            <MobileTile
                                                key={index}
                                                title={`${String.fromCharCode(65 + index)}. ${option}`}
                                                isSelected={selectedTimeOption === option}
                                                onClick={() => setSelectedTimeOption(option)}
                                                compact={true}
                                            />
                                        ))
                                    ) : (
                                        // Regular multiple choice options (integers and decimals)
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
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-4">
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={
                                    isFractionQuestion
                                        ? (settings.questionType === 'expression'
                                            ? !userFractionInput.trim()
                                            : selectedFractionOption === null)
                                        : isCurrencyQuestion
                                            ? (settings.questionType === 'expression'
                                                ? !userInput.trim()
                                                : selectedCurrencyOption === null)
                                            : isTimeQuestion
                                                ? (settings.questionType === 'expression'
                                                    ? !userInput.trim()
                                                    : selectedTimeOption === null)
                                                : (settings.questionType === 'expression'
                                                    ? !userInput.trim()
                                                    : selectedOption === null)
                                }
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {currentQuestionIndex >= questions.length - 1 ? '🏁 Finish Quiz' : '➡️ Next Question'}
                            </button>

                            {/* Finish Quiz Button - Show when timer and questions are disabled or set to 0 */}
                            {(!settings.timerEnabled && (!settings.questionsEnabled || settings.numberOfQuestions === 0)) && (
                                <button
                                    onClick={() => completeQuiz()}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 dark:hover:from-orange-700 dark:hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    🏁 Finish Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
