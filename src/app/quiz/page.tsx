'use client';

import { useEffect, useState } from 'react';
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

    const handleTimeUp = () => {
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
    };

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
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
                <div className={`bg-white rounded-2xl shadow-2xl text-center ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
            {/* Mobile Layout */}
            {isMobile ? (
                <div className="flex flex-col min-h-screen">
                    {/* Mobile Header - Fixed Top */}
                    <div className="bg-white shadow-lg p-4 sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600">
                                {currentQuestionIndex + 1}/{questions.length}
                            </span>
                            <div className={`text-xl font-bold px-3 py-1 rounded-lg ${timeRemaining <= 5
                                    ? 'text-red-500 bg-red-50 animate-pulse'
                                    : 'text-purple-600 bg-purple-50'
                                }`}>
                                ⏰ {timeRemaining}s
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Mobile Content Area */}
                    <div className="flex-1 flex flex-col p-4">
                        {/* Greeting */}
                        <div className="text-center mb-6">
                            <h1 className="text-lg font-bold text-white">
                                Hi {settings.username}! 👋
                            </h1>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 mb-4">
                                    {currentQuestion.question} = ?
                                </div>
                            </div>
                        </div>

                        {/* Mobile Answer Area - Bottom Sheet Style */}
                        <div className="bg-white rounded-t-3xl shadow-lg p-6 pb-8">
                            {settings.questionType === 'expression' ? (
                                <div className="space-y-4">
                                    <MobileInput
                                        type="number"
                                        placeholder="Your answer"
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
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Hi {settings.username}! 👋
                            </h1>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-600">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                                <div className={`text-2xl font-bold ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
                                    ⏰ {timeRemaining}s
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="text-center mb-8">
                            <div className="text-4xl font-bold text-gray-800 mb-6 p-6 bg-gray-50 rounded-xl">
                                {currentQuestion.question} = ?
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
                                        className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter your answer"
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
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
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
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {currentQuestionIndex >= questions.length - 1 ? '🏁 Finish Quiz' : '➡️ Next Question'}
                        </button>

                        {/* Quiz Info */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>Difficulty: {settings.difficulty} | Operation: {settings.mathOperation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
