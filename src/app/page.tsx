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
import type { Difficulty, QuestionType, MathOperation } from '../store/quiz-store';

export default function Home() {
  const router = useRouter();
  const { updateSettings, setQuestions } = useQuizStore();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    username: '',
    difficulty: 'easy' as Difficulty,
    numberOfQuestions: 5,
    timerPerQuestion: 10,
    questionType: 'expression' as QuestionType,
    mathOperation: 'addition' as MathOperation,
  });

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
      formData.mathOperation,
      formData.questionType
    );
    setQuestions(questions);

    // Navigate to quiz page
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900">
      <div className={`flex items-center justify-center ${isMobile ? 'p-4 pt-8' : 'p-4'} min-h-screen`}>
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${isMobile ? 'max-w-md mx-auto' : 'max-w-2xl'
          } ${isMobile ? 'p-6' : 'p-8'} relative animate-float`}>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`font-bold text-gray-800 dark:text-gray-200 mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
              Math Quiz for Kids
            </h1>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <MobileInput
              label="Your Name"
              placeholder="Enter your name"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              error={errors.username}
            />
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-4 mb-6">
            {/* Quiz Settings Toggle Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer ${showSettings
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:transform hover:scale-105'
                }`}
            >
              <span className="text-2xl">⚙️</span>
              <span>{showSettings ? 'Hide Quiz Settings' : 'Quiz Settings'}</span>
            </button>

            {/* Start Quiz Button */}
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

          {/* Settings Accordion */}
          {showSettings && (
            <div className="space-y-4 animate-float">
              {/* Difficulty Level */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  🎚️ Difficulty Level
                </h3>
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
              </div>

              {/* Number of Questions */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
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

              {/* Timer per Question */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
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

              {/* Question Type */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  🎯 Question Type
                </h3>
                <div className="space-y-3">
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
              </div>

              {/* Math Operation */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  🔢 Math Operation
                </h3>
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {([
                    { value: 'addition', label: '➕ Addition', subtitle: 'Basic addition' },
                    { value: 'subtraction', label: '➖ Subtraction', subtitle: 'Basic subtraction' },
                    { value: 'multiplication', label: '✖️ Multiplication', subtitle: 'Times tables' },
                    { value: 'division', label: '➗ Division', subtitle: 'Division problems' },
                    { value: 'algebraic', label: '🔢 Algebraic', subtitle: 'Solve for x' },
                    { value: 'mixed', label: '🎲 Mixed', subtitle: 'All types' }
                  ] as { value: MathOperation; label: string; subtitle: string }[]).map((op) => (
                    <div
                      key={op.value}
                      className={op.value === 'mixed' && !isMobile ? 'col-span-2' : ''}
                    >
                      <MobileTile
                        title={op.label}
                        subtitle={op.subtitle}
                        isSelected={formData.mathOperation === op.value}
                        onClick={() => handleInputChange('mathOperation', op.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Mode */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  🌙 Display Mode
                </h3>
                <div className="flex items-center justify-center">
                  <ThemeToggle size={isMobile ? 'md' : 'lg'} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
