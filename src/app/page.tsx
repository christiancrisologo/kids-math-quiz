'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../store/quiz-store';
import { generateQuestions } from '../utils/math/question-generator';
import { useIsMobile } from '../utils/responsive';
import { MobileButton } from '../components/ui/MobileButton';
import { MobileTile } from '../components/ui/MobileTile';
import { MobileInput } from '../components/ui/MobileInput';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { yearLevelPresets, applyYearLevelPreset, type YearLevel } from '../utils/yearLevelPresets';
import type { Difficulty, QuestionType, MathOperation, NumberType } from '../store/quiz-store';

export default function Home() {
  const router = useRouter();
  const { updateSettings, setQuestions } = useQuizStore();
  const isMobile = useIsMobile();

  // Get default settings from Primary school preset
  const defaultPreset = applyYearLevelPreset('primary');

  const [formData, setFormData] = useState({
    username: '',
    difficulty: defaultPreset.difficulty,
    numberOfQuestions: defaultPreset.numberOfQuestions,
    timerPerQuestion: defaultPreset.timerPerQuestion,
    questionType: defaultPreset.questionType,
    mathOperations: defaultPreset.mathOperations,
    numberTypes: defaultPreset.numberTypes,
  });

  const [selectedYearLevel, setSelectedYearLevel] = useState<YearLevel | ''>('primary');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSettings, setShowSettings] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleMathOperationToggle = (operation: MathOperation) => {
    setFormData(prev => {
      const currentOperations = prev.mathOperations;
      const isSelected = currentOperations.includes(operation);

      if (isSelected) {
        // Don't allow removing the last operation
        if (currentOperations.length === 1) {
          return prev;
        }
        return {
          ...prev,
          mathOperations: currentOperations.filter(op => op !== operation)
        };
      } else {
        return {
          ...prev,
          mathOperations: [...currentOperations, operation]
        };
      }
    });

    // Clear math operations error when user makes a selection
    if (errors.mathOperations) {
      setErrors(prev => ({
        ...prev,
        mathOperations: ''
      }));
    }
  };

  const handleNumberTypeToggle = (numberType: NumberType) => {
    setFormData(prev => {
      const currentTypes = prev.numberTypes;
      const isSelected = currentTypes.includes(numberType);

      if (isSelected) {
        // Don't allow removing the last number type
        if (currentTypes.length === 1) {
          return prev;
        }
        return {
          ...prev,
          numberTypes: currentTypes.filter(type => type !== numberType)
        };
      } else {
        return {
          ...prev,
          numberTypes: [...currentTypes, numberType]
        };
      }
    });

    // Clear number types error when user makes a selection
    if (errors.numberTypes) {
      setErrors(prev => ({
        ...prev,
        numberTypes: ''
      }));
    }
  };

  const handleYearLevelChange = (yearLevel: YearLevel) => {
    setSelectedYearLevel(yearLevel);

    // Apply the preset settings
    const presetSettings = applyYearLevelPreset(yearLevel);
    setFormData(prev => ({
      ...prev,
      ...presetSettings
    }));

    // Clear any validation errors since we're applying valid presets
    setErrors({});

    // Show settings so user can see what was applied
    setShowSettings(true);
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

    // Update store with settings
    updateSettings(formData);

    // Generate questions
    const questions = generateQuestions(
      formData.numberOfQuestions,
      formData.difficulty,
      formData.mathOperations,
      formData.questionType,
      formData.numberTypes // Add number types parameter
    );
    setQuestions(questions);

    // Navigate to quiz page
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900">
      <div className={`flex items-center justify-center ${isMobile ? 'p-4 pt-8' : 'p-4'} min-h-screen`}>
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${isMobile ? 'max-w-md mx-auto' : 'max-w-2xl'
          } ${isMobile ? 'p-4' : 'p-6'} relative animate-float`}>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`font-bold text-gray-800 dark:text-gray-200 mb-3 ${isMobile ? 'text-2xl' : 'text-5xl'}`}>
              Math Quiz for Kids
            </h1>
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <MobileInput
              label="Your Name"
              placeholder="Enter your name"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              error={errors.username}
            />
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
            <div className="space-y-3 animate-float mb-4">
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

              {/* Number of Questions and Timer per Question - Combined Row */}
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-3">
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                      📊 Number of Questions
                    </h3>
                    <MobileInput
                      type="number"
                      label=""
                      placeholder="Minimum 5"
                      value={formData.numberOfQuestions}
                      onChange={(value) => handleInputChange('numberOfQuestions', parseInt(value) || 5)}
                      error={errors.numberOfQuestions}
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                      ⏰ Timer per Question
                    </h3>
                    <MobileInput
                      type="number"
                      label=""
                      placeholder="Minimum 5 seconds"
                      value={formData.timerPerQuestion}
                      onChange={(value) => handleInputChange('timerPerQuestion', parseInt(value) || 10)}
                      error={errors.timerPerQuestion}
                      inputMode="numeric"
                    />
                  </div>
                </div>
                {selectedYearLevel && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    💡 {yearLevelPresets[selectedYearLevel].label} settings: {yearLevelPresets[selectedYearLevel].numberOfQuestions} questions, {yearLevelPresets[selectedYearLevel].timerPerQuestion}s per question
                  </div>
                )}
              </div>

              {/* Question Type */}
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
                    { value: 'fractions', label: '🧮 Fractions', subtitle: 'Fraction numbers (1/2, 3/4...)' }
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
                    { value: 'algebraic', label: '🔢 Algebraic', subtitle: 'Solve for x' }
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

              {/* Display Mode */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center text-sm">
                  🌙 Display Mode
                </h3>
                <div className="flex items-center justify-center">
                  <ThemeToggle size={isMobile ? 'md' : 'lg'} />
                </div>
              </div>
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
            >
              Start Quiz!
            </MobileButton>
          </div>
        </div>
      </div>
    </div>
  );
}
