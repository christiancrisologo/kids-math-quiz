'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../store/quiz-store';
import { generateQuestions } from '../utils/math/question-generator';
import { useIsMobile } from '../utils/responsive';
import { MobileButton } from '../components/ui/MobileButton';
import { MobileTile } from '../components/ui/MobileTile';
import { MobileInput } from '../components/ui/MobileInput';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className={`flex items-center justify-center ${isMobile ? 'p-4 pt-8' : 'p-4'} min-h-screen`}>
        <div className={`bg-white rounded-2xl shadow-2xl w-full ${isMobile ? 'max-w-md' : 'max-w-2xl'} ${isMobile ? 'p-6' : 'p-8'}`}>
          <div className="text-center mb-8">
            <h1 className={`font-bold text-gray-800 mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              🧮 Math Quiz App
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Test your math skills and have fun learning!
            </p>
          </div>

          <div className="space-y-6">
            {/* Username Input */}
            <MobileInput
              label="Your Name"
              placeholder="Enter your name"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              error={errors.username}
            />

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
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
            <MobileInput
              type="number"
              label="Number of Questions"
              placeholder="Minimum 5"
              value={formData.numberOfQuestions}
              onChange={(value) => handleInputChange('numberOfQuestions', parseInt(value) || 5)}
              error={errors.numberOfQuestions}
              inputMode="numeric"
            />

            {/* Timer per Question */}
            <MobileInput
              type="number"
              label="Time per Question (seconds)"
              placeholder="Minimum 5"
              value={formData.timerPerQuestion}
              onChange={(value) => handleInputChange('timerPerQuestion', parseInt(value) || 10)}
              error={errors.timerPerQuestion}
              inputMode="numeric"
            />

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Question Type
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Math Operation
              </label>
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
          </div>

          {/* Start Quiz Button - Mobile Action Zone */}
          <div className={`${isMobile ? 'mt-8 sticky bottom-0 bg-white pt-4 pb-2' : 'mt-8'}`}>
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
