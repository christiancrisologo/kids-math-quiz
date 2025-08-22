
import type { animationClasses as AnimationClassesType } from '../../utils/enhanced-animations';
import { QuizSettings, Question } from '../../store/quiz-store';
import { SystemSettings } from '../../contexts/system-settings-context';
import Timer from './Timer';

interface HeaderContentProps {
    settings: QuizSettings;
    currentQuestionIndex: number;
    questions: Question[];
    correctAnswersCount: number;
    incorrectAnswersCount: number;
    timeRemaining: number;
    overallTimeRemaining: number;
    animationClasses: typeof AnimationClassesType;
    systemSettings: SystemSettings;
    progress: number;
}

const HeaderContent: React.FC<HeaderContentProps> = ({
    settings,
    currentQuestionIndex,
    questions,
    correctAnswersCount,
    incorrectAnswersCount,
    timeRemaining,
    overallTimeRemaining,
    animationClasses,
    systemSettings,
    progress,
}) => (
    <>
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
            <div className="flex-1 text-center">
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {settings.username}
                </h1>
            </div>
            <div className="flex items-center space-x-3">
                <Timer // If this fails, try '../quiz/Timer' or adjust as needed
                    timeRemaining={timeRemaining}
                    overallTimeRemaining={overallTimeRemaining}
                    timerEnabled={settings.timerEnabled}
                    overallTimerEnabled={settings.overallTimerEnabled}
                />
            </div>
        </div>
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
        {settings.overallTimerEnabled && overallTimeRemaining <= 5 && overallTimeRemaining > 0 && (
            <div className={`bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-2 text-center ${animationClasses.pulse(systemSettings)}`}>
                <p className="text-red-700 dark:text-red-300 font-bold text-sm">
                    ⚠️ Time&apos;s Almost Up! {overallTimeRemaining} seconds remaining!
                </p>
            </div>
        )}
    </>
);

export default HeaderContent;