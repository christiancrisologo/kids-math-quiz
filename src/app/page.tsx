'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../store/quiz-store';
import { generateQuestions } from '../utils/math/question-generator';
import type { Difficulty, QuestionType, MathOperation } from '../store/quiz-store';

export default function Home() {
  const router = useRouter();
  const { updateSettings, setQuestions } = useQuizStore();

  const [formData, setFormData] = useState({
    username: '',
    difficulty: 'easy' as Difficulty,
    numberOfQuestions: 5,
    timerPerQuestion: 10,
    questionType: 'expression' as QuestionType,
    mathOperation: 'addition' as MathOperation,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartQuiz = () => {
    if (!formData.username.trim()) {
      alert('Please enter your username!');
      return;
    }

    if (formData.numberOfQuestions < 5) {
      alert('Minimum 5 questions required!');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧮 Math Quiz App</h1>
          <p className="text-gray-600">Test your math skills and have fun learning!</p>
        </div>

        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['easy', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleInputChange('difficulty', level)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.difficulty === level
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                    }`}
                >
                  {level === 'easy' ? '🟢 Easy' : '🔴 Hard'}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions (minimum 5)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={formData.numberOfQuestions}
              onChange={(e) => handleInputChange('numberOfQuestions', parseInt(e.target.value) || 5)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Timer per Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time per Question (seconds)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={formData.timerPerQuestion}
              onChange={(e) => handleInputChange('timerPerQuestion', parseInt(e.target.value) || 10)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {([
                { value: 'expression', label: '📝 Math Expression (e.g., 4 + 3 = ?)' },
                { value: 'multiple-choice', label: '🎯 Multiple Choice (3 options)' }
              ] as { value: QuestionType; label: string }[]).map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('questionType', type.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${formData.questionType === type.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Math Operation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Math Operation
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'addition', label: '➕ Addition' },
                { value: 'subtraction', label: '➖ Subtraction' },
                { value: 'multiplication', label: '✖️ Multiplication' },
                { value: 'division', label: '➗ Division' },
                { value: 'algebraic', label: '🔢 Algebraic Expressions' },
                { value: 'mixed', label: '🎲 Mixed (All Types)' }
              ] as { value: MathOperation; label: string }[]).map((op) => (
                <button
                  key={op.value}
                  onClick={() => handleInputChange('mathOperation', op.value)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${formData.mathOperation === op.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                    } ${op.value === 'mixed' || op.value === 'algebraic' ? 'col-span-2' : ''}`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Quiz Button */}
          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Start Quiz!
          </button>
        </div>
      </div>
    </div>
  );
}
