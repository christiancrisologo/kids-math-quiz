
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../store/quiz-store';
import { generateQuestions } from '../utils/math/question-generator';
import { useIsMobile } from '../utils/responsive';
import { MobileButton } from '../components/ui/MobileButton';
import { MobileTile } from '../components/ui/MobileTile';
import { MobileInput } from '../components/ui/MobileInput';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { SliderWithToggle } from '../components/ui/SliderWithToggle';
import { SystemSettingsPanel } from '../components/ui/SystemSettings';
import { useSystemSettings } from '../contexts/system-settings-context';
import { animationClasses } from '../utils/enhanced-animations';
import {
  Difficulty,
  QuestionType,
  MathOperation,
  NumberType
} from '../store/quiz-store';
import { YearLevel, yearLevelPresets, applyYearLevelPreset } from '../utils/yearLevelPresets';
import { ChallengeMode, getChallengeModes, applyChallengeMode } from '../utils/challengeModes';
import { handleToggle, handleSliderChange } from '../utils/helpers';
import { initialFormData } from '../constants/initialFormData';

export default function Home() {
  const router = useRouter();
  const { updateSettings, setQuestions, saveUserPreferences, resetQuiz } = useQuizStore();
  const isMobile = useIsMobile();
  const { settings: systemSettings } = useSystemSettings();
  const [hasExistingUser, setHasExistingUser] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    difficulty: 'easy' as Difficulty,
    numberOfQuestions: 5,
    timerPerQuestion: 10,
    questionType: 'expression' as QuestionType,
    mathOperations: ['addition'] as MathOperation[],
    numberTypes: ['integers'] as NumberType[],
    timerEnabled: true,
    questionsEnabled: true,
    minCorrectAnswers: 0,
    maxCorrectAnswers: 5,
    correctAnswersEnabled: false,
    minIncorrectAnswers: 0,
    maxIncorrectAnswers: 5,
    incorrectAnswersEnabled: false,
    overallTimerEnabled: false,
    overallTimerDuration: 180,
    challengeMode: undefined as string | undefined,
  });
  const [selectedYearLevel, setSelectedYearLevel] = useState<YearLevel | ''>('primary');
  const [selectedChallengeMode, setSelectedChallengeMode] = useState<string>('');
  const [availableChallengeModes] = useState<ChallengeMode[]>(getChallengeModes());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('math_quiz_user');
      setHasExistingUser(!!userRaw);
      let show = false;
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          if (userObj.userName && userObj.userName.trim() !== '') {
            show = true;
          }
        } catch { }
      }
      setShowWelcome(show);
    }
  }, [formData.username]);

  // Handler for new user button
  const handleNewUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setFormData({ ...initialFormData, challengeMode: undefined });
    setSelectedYearLevel('primary');
    setSelectedChallengeMode('');
    setErrors({});
    resetQuiz();
  };

  // Only log what's currently in localStorage for debugging (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('localStorage check:', {
        math_quiz_user: localStorage.getItem('math_quiz_user'),
        gameHistory: localStorage.getItem('gameHistory')
      });
    }
  }, []);

  // Removed unused welcomeBack state
  // Sync form data with loaded settings from store, or apply defaults if no saved data
  useEffect(() => {
    // If username is blank, check localStorage for math_quiz_user
    if (!formData.username) {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('math_quiz_user') : null;
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          if (userObj.userName) {
            setFormData(prev => ({ ...prev, username: userObj.userName }));
          }
        } catch { }
      }
    }
  }, [formData.username]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Update max values for sliders when numberOfQuestions changes
      if (field === 'numberOfQuestions' && typeof value === 'number') {
        updated.maxCorrectAnswers = Math.min(updated.maxCorrectAnswers, value);
        updated.maxIncorrectAnswers = Math.min(updated.maxIncorrectAnswers, value);
        updated.minCorrectAnswers = Math.min(updated.minCorrectAnswers, value);
        updated.minIncorrectAnswers = Math.min(updated.minIncorrectAnswers, value);
      }

      return updated;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleMathOperationToggle = (operation: MathOperation) => {
    setFormData(prev => ({
      ...prev,
      mathOperations: handleToggle(prev.mathOperations, operation)
    }));

    // Clear math operations error when user makes a selection
    if (errors.mathOperations) {
      setErrors(prev => ({
        ...prev,
        mathOperations: ''
      }));
    }
  };

  const handleNumberTypeToggle = (numberType: NumberType) => {
    setFormData(prev => ({
      ...prev,
      numberTypes: handleToggle(prev.numberTypes, numberType)
    }));

    // Clear number types error when user makes a selection
    if (errors.numberTypes) {
      setErrors(prev => ({
        ...prev,
        numberTypes: ''
      }));
    }
  };

  // Handler for correct answers slider
  const handleCorrectAnswersChange = (min: number, max: number) => {
    handleSliderChange(min, max, 'correctAnswers', setFormData);
  };

  // Handler for incorrect answers slider
  const handleIncorrectAnswersChange = (min: number, max: number) => {
    handleSliderChange(min, max, 'incorrectAnswers', setFormData);
  };

  const handleYearLevelChange = (yearLevel: YearLevel) => {
    setSelectedYearLevel(yearLevel);

    // Apply the preset settings
    const presetSettings = applyYearLevelPreset(yearLevel);
    setFormData(prev => ({
      ...prev,
      ...presetSettings,
      // Update max values for correct/incorrect answer sliders based on number of questions
      maxCorrectAnswers: presetSettings.numberOfQuestions,
      maxIncorrectAnswers: presetSettings.numberOfQuestions,
    }));

    // Clear any validation errors since we're applying valid presets
    setErrors({});

    // Show settings so user can see what was applied
    setShowSettings(true);
  };

  const handleChallengeModeChange = (challengeName: string) => {
    setSelectedChallengeMode(challengeName);

    if (challengeName === '') {
      // No challenge selected, keep current settings
      setFormData(prev => ({
        ...prev,
        challengeMode: undefined,
      }));
    } else {
      // Apply challenge mode settings
      const updatedSettings = applyChallengeMode(formData, challengeName);
      setFormData(prev => ({
        ...prev,
        ...updatedSettings,
      }));

      // Show settings so user can see what was applied
      setShowSettings(true);
    }

    // Clear any validation errors
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Please enter your name';
    }

    if (formData.numberOfQuestions < 5) {
      newErrors.numberOfQuestions = 'Minimum 5 questions required';
    }

    if (formData.timerPerQuestion < 5) {
      newErrors.timerPerQuestion = 'Minimum 5 seconds required';
    }

    if (formData.mathOperations.length === 0) {
      newErrors.mathOperations = 'Please select at least one math operation';
    }

    if (formData.numberTypes.length === 0) {
      newErrors.numberTypes = 'Please select at least one number type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartQuiz = () => {
    if (!validateForm()) {
      return;
    }

    // Save user info to localStorage (math_quiz_user)
    if (typeof window !== 'undefined') {
      // If no userId, generate a random one
      let userId = '';
      const userRaw = localStorage.getItem('math_quiz_user');
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          userId = userObj.userId || '';
        } catch { }
      }

      localStorage.setItem('math_quiz_user', JSON.stringify({ userId, userName: formData.username }));
    }

    // Reset quiz state first to clear any completed status
    resetQuiz();

    // Update store with settings
    updateSettings(formData);

    // Save preferences to localStorage
    saveUserPreferences();

    // Generate questions
    const questions = generateQuestions(
      formData.numberOfQuestions,
      formData.difficulty,
      formData.mathOperations,
      formData.questionType,
      formData.numberTypes
    );
    setQuestions(questions);

    // Navigate to quiz page
    router.push('/quiz');
  };

  // Fix hydration mismatch: use state and check localStorage only after mount
  // Hide history button by default, only show if localStorage has game records for current user
  const [showHistoryButton, setShowHistoryButton] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('math_quiz_user');
      let userId = '';
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          userId = userObj.userId || '';
        } catch { }
      }
      const gameHistoryRaw = localStorage.getItem('mathquiz_game_history');
      let hasHistoryForUser = false;
      if (gameHistoryRaw && userId) {
        try {
          const historyArr = JSON.parse(gameHistoryRaw);
          hasHistoryForUser = Array.isArray(historyArr) && historyArr.some(r => r.userId === userId);
        } catch { }
      }
      setShowHistoryButton(hasHistoryForUser);
    }
  }, [formData.username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900">
      {showWelcome && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-green-100 text-green-800 px-6 py-2 rounded-b-xl shadow-lg font-semibold text-lg">
            Welcome back, {formData.username}!
          </div>
        </div>
      )}
      <div className={`flex items-center justify-center ${isMobile ? 'p-4 pt-8' : 'p-4'} min-h-screen`}>
        <div className={`bg-white dark:bg-slate-800 rounded-  rounded-xl shadow-2xl w-full ${isMobile ? 'max-w-md mx-auto' : 'max-w-2xl'
          } ${isMobile ? 'p-4' : 'p-6'} relative ${animationClasses.float(systemSettings)}`}>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`font-bold text-gray-800 dark:text-gray-200 mb-3 ${isMobile ? 'text-2xl' : 'text-5xl'}`}>
              Math Quiz for Kids
            </h1>
          </div>

          {/* Username Input */}
          {/* Username Input + New User Button */}
          <div className="mb-4">
            <div className="flex gap-2 w-full items-center">
              <div className="flex-1 h-full flex items-center">
                <MobileInput
                  label="Your Name"
                  placeholder="Enter your name"
                  value={formData.username}
                  onChange={(value) => handleInputChange('username', value)}
                  error={errors.username}
                  readOnly={hasExistingUser && !!formData.username}
                />
              </div>
              {hasExistingUser && formData.username && (
                <MobileButton
                  size="sm"
                  variant="ghost"
                  onClick={handleNewUser}
                  className="mt-6 ml-2 whitespace-nowrap bg-ye hover:bg-amber-400 text-gray-900 border border-yellow-400 flex items-center justify-center h-[56px]"
                  icon={<span role="img" aria-label="reset">🔄</span>}
                >
                  Reset
                </MobileButton>
              )}
            </div>
            {hasExistingUser && formData.username && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Reset the game to change user
              </div>
            )}
          </div>

          {/* Year Level Selection */}
          <div className="mb-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center text-sm">
                🎯 Select Your Year Level
              </h3>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {(Object.entries(yearLevelPresets) as [YearLevel, typeof yearLevelPresets[YearLevel]][]).map(([level, preset]) => (
                  <MobileTile
                    key={level}
                    title={preset.label}
                    subtitle={preset.description}
                    isSelected={selectedYearLevel === level}
                    onClick={() => handleYearLevelChange(level)}
                  />
                ))}
              </div>
              {selectedYearLevel && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ✨ Settings automatically applied for {yearLevelPresets[selectedYearLevel].label}!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Challenge Mode Selection */}
          <div className="mb-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center text-sm">
                🏆 Challenge Mode
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    value={selectedChallengeMode}
                    onChange={(e) => handleChallengeModeChange(e.target.value)}
                    className="w-full p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Select a challenge (optional)</option>
                    {availableChallengeModes.map((challenge) => (
                      <option key={challenge.name} value={challenge.name}>
                        {challenge.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {selectedChallengeMode && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">
                      {selectedChallengeMode}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {availableChallengeModes.find(c => c.name === selectedChallengeMode)?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quiz Settings Toggle Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full py-3 px-5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${showSettings
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:transform hover:scale-105'
                }`}
            >
              <span className="text-xl">⚙️</span>
              <span>{showSettings ? 'Hide Quiz Settings' : 'Quiz Settings'}</span>
            </button>
          </div>

          {/* Settings Accordion */}
          {showSettings && (
            <div className={`space-y-3 ${animationClasses.float(systemSettings)} mb-4`}>
              {/* Difficulty Level */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                  🎚️ Difficulty Level
                </h3>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {(['easy', 'hard'] as Difficulty[]).map((level) => (
                    <MobileTile
                      key={level}
                      title={level === 'easy' ? '🟢 Easy' : '🔴 Hard'}
                      subtitle={level === 'easy' ? 'Basic problems' : 'Challenging problems'}
                      isSelected={formData.difficulty === level}
                      onClick={() => handleInputChange('difficulty', level)}
                    />
                  ))}
                </div>
                {selectedYearLevel && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    💡 Recommended for {yearLevelPresets[selectedYearLevel].label}: {formData.difficulty}
                  </div>
                )}
              </div>

              {/* Enhanced Game Mechanics Settings */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center text-sm">
                  🎮 Game Mechanics
                </h3>

                <div className="space-y-4">
                  {/* Timer Settings - Combined Section */}
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center text-sm">
                      ⏰ Timer Settings
                    </h4>

                    <div className="space-y-4">
                      {/* Number of Questions */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                            📊 Number of Questions
                          </h5>
                          <ToggleSwitch
                            label=""
                            icon=""
                            enabled={formData.questionsEnabled}
                            onToggle={(enabled) => handleInputChange('questionsEnabled', enabled)}
                          />
                        </div>
                        {formData.questionsEnabled && (
                          <MobileInput
                            type="number"
                            label=""
                            placeholder="Minimum 5"
                            value={formData.numberOfQuestions}
                            onChange={(value) => handleInputChange('numberOfQuestions', value)}
                            error={errors.numberOfQuestions}
                            inputMode="numeric"
                          />
                        )}
                      </div>

                      {/* Timer per Question */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                            ⏱️ Timer per Question
                          </h5>
                          <ToggleSwitch
                            label=""
                            icon=""
                            enabled={formData.timerEnabled}
                            onToggle={(enabled) => handleInputChange('timerEnabled', enabled)}
                          />
                        </div>
                        {formData.timerEnabled && (
                          <MobileInput
                            type="number"
                            label=""
                            placeholder="Minimum 5 seconds"
                            value={formData.timerPerQuestion}
                            onChange={(value) => handleInputChange('timerPerQuestion', value)}
                            error={errors.timerPerQuestion}
                            inputMode="numeric"
                          />
                        )}
                      </div>

                      {/* Overall Timer Settings */}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                              🕐 Overall Game Timer
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Set a time limit for the entire quiz
                            </p>
                          </div>
                          <ToggleSwitch
                            label=""
                            icon=""
                            enabled={formData.overallTimerEnabled}
                            onToggle={(enabled) => handleInputChange('overallTimerEnabled', enabled)}
                          />
                        </div>

                        {formData.overallTimerEnabled && (
                          <div className="space-y-3">
                            {/* Overall Timer Duration */}
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                Duration (minutes)
                              </label>
                              <MobileInput
                                type="number"
                                label=""
                                placeholder="Duration in minutes"
                                value={Math.round(formData.overallTimerDuration / 60)}
                                onChange={(value) => handleInputChange('overallTimerDuration', value ? parseInt(value) * 60 : 0)}
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedYearLevel && (
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                        💡 {yearLevelPresets[selectedYearLevel].label} settings: {yearLevelPresets[selectedYearLevel].numberOfQuestions} questions, {yearLevelPresets[selectedYearLevel].timerPerQuestion}s per question
                        {yearLevelPresets[selectedYearLevel].overallTimerEnabled && (
                          <span>, Overall timer: {Math.round(yearLevelPresets[selectedYearLevel].overallTimerDuration / 60)}min</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Correct Answers Setting */}
                  <SliderWithToggle
                    label="Correct Answers Goal"
                    icon="✅"
                    subtitle="End quiz when reaching this range of correct answers"
                    enabled={formData.correctAnswersEnabled}
                    min={0}
                    max={formData.questionsEnabled ? formData.numberOfQuestions : 20}
                    minValue={formData.minCorrectAnswers}
                    maxValue={formData.maxCorrectAnswers}
                    onEnabledChange={(enabled) => handleInputChange('correctAnswersEnabled', enabled)}
                    onValuesChange={handleCorrectAnswersChange}
                    disabled={!formData.questionsEnabled}
                  />

                  {/* Incorrect Answers Setting */}
                  <SliderWithToggle
                    label="Incorrect Answers Limit"
                    icon="❌"
                    subtitle="End quiz when reaching this range of incorrect answers"
                    enabled={formData.incorrectAnswersEnabled}
                    min={0}
                    max={formData.questionsEnabled ? formData.numberOfQuestions : 20}
                    minValue={formData.minIncorrectAnswers}
                    maxValue={formData.maxIncorrectAnswers}
                    onEnabledChange={(enabled) => handleInputChange('incorrectAnswersEnabled', enabled)}
                    onValuesChange={handleIncorrectAnswersChange}
                    disabled={!formData.questionsEnabled}
                  />
                </div>
              </div>              {/* Question Type */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                  🎯 Question Type
                </h3>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {([
                    { value: 'expression', label: '📝 Math Expression', subtitle: 'e.g., 4 + 3 = ?' },
                    { value: 'multiple-choice', label: '🎯 Multiple Choice', subtitle: '3 options' }
                  ] as { value: QuestionType; label: string; subtitle: string }[]).map((type) => (
                    <MobileTile
                      key={type.value}
                      title={type.label}
                      subtitle={type.subtitle}
                      isSelected={formData.questionType === type.value}
                      onClick={() => handleInputChange('questionType', type.value)}
                    />
                  ))}
                </div>
                {selectedYearLevel && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    💡 Your year level supports: {yearLevelPresets[selectedYearLevel].questionType.map(type =>
                      type === 'expression' ? 'Math Expression' : 'Multiple Choice'
                    ).join(', ')}
                  </div>
                )}
              </div>

              {/* Number Types */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                  🔢 Number Types (Select Multiple)
                </h3>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  {([
                    { value: 'integers', label: '🔢 Integers', subtitle: 'Whole numbers (1, 2, 3...)' },
                    { value: 'decimals', label: '🔸 Decimals', subtitle: 'Decimal numbers (1.5, 2.25...)' },
                    { value: 'fractions', label: '🧮 Fractions', subtitle: 'Fraction numbers (1/2, 3/4...)' },
                    { value: 'currency', label: '💰 Currency', subtitle: 'Money calculations ($1.50, $2.25...)' },
                    { value: 'time', label: '⏰ Time', subtitle: 'Time calculations (1:30, 2:45...)' }
                  ] as { value: NumberType; label: string; subtitle: string }[]).map((type) => (
                    <MobileTile
                      key={type.value}
                      title={type.label}
                      subtitle={type.subtitle}
                      isSelected={formData.numberTypes.includes(type.value)}
                      onClick={() => handleNumberTypeToggle(type.value)}
                    />
                  ))}
                </div>
                {formData.numberTypes.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Selected: {formData.numberTypes.map(type =>
                      type.charAt(0).toUpperCase() + type.slice(1)
                    ).join(', ')}
                  </div>
                )}
                {selectedYearLevel && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    💡 {yearLevelPresets[selectedYearLevel].label} includes: {yearLevelPresets[selectedYearLevel].numberTypes.map(type =>
                      type.charAt(0).toUpperCase() + type.slice(1)
                    ).join(', ')}
                  </div>
                )}
                {errors.numberTypes && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.numberTypes}
                  </div>
                )}
              </div>

              {/* Math Operations */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                  🔢 Math Operations (Select Multiple)
                </h3>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  {([
                    { value: 'addition', label: '➕ Addition', subtitle: 'Basic addition' },
                    { value: 'subtraction', label: '➖ Subtraction', subtitle: 'Basic subtraction' },
                    { value: 'multiplication', label: '✖️ Multiplication', subtitle: 'Times tables' },
                    { value: 'division', label: '➗ Division', subtitle: 'Division problems' },
                    { value: 'algebraic', label: '🔢 Algebraic', subtitle: 'Solve for x' },
                    { value: 'binomial', label: '🔬 Binomial', subtitle: 'Complex expressions' }
                  ] as { value: MathOperation; label: string; subtitle: string }[]).map((op) => (
                    <MobileTile
                      key={op.value}
                      title={op.label}
                      subtitle={op.subtitle}
                      isSelected={formData.mathOperations.includes(op.value)}
                      onClick={() => handleMathOperationToggle(op.value)}
                    />
                  ))}
                </div>
                {formData.mathOperations.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Selected: {formData.mathOperations.map(op =>
                      op.charAt(0).toUpperCase() + op.slice(1)
                    ).join(', ')}
                  </div>
                )}
                {selectedYearLevel && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    💡 {yearLevelPresets[selectedYearLevel].label} includes: {yearLevelPresets[selectedYearLevel].mathOperations.map(op =>
                      op.charAt(0).toUpperCase() + op.slice(1)
                    ).join(', ')}
                  </div>
                )}
                {errors.mathOperations && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.mathOperations}
                  </div>
                )}
              </div>

              {/* System Settings */}
              <SystemSettingsPanel isMobile={isMobile} />
            </div>
          )}

          {/* Start Quiz Button - Shows after settings or at bottom */}
          <div className="mt-4">
            <MobileButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartQuiz}
              icon="🚀"
              disabled={
                !formData.username.trim() ||
                Object.keys(errors).length > 0 ||
                formData.mathOperations.length === 0 ||
                formData.numberTypes.length === 0
                // Challenge mode is optional, do not include in validation
              }
            >
              Start Quiz!
            </MobileButton>
          </div>

          {/* View History Button */}
          {showHistoryButton && (
            <div className="mt-3">
              <MobileButton
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => router.push('/history')}
                icon="📊"
              >
                View History
              </MobileButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
