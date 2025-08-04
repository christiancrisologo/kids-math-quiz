import { create } from 'zustand';
import { areFractionsEqual, parseFraction } from '../utils/math/fraction-utils';

export type Difficulty = 'easy' | 'hard';
export type QuestionType = 'expression' | 'multiple-choice';
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'algebraic' | 'fractions';

export interface Question {
  id: string;
  question: string;
  answer: number;
  variable?: string; // e.g., "x", "y" for algebraic questions
  equation?: string; // Original equation for display
  userAnswer?: number;
  isCorrect?: boolean;
  options?: number[]; // For multiple choice questions
  timeSpent?: number;
  // Fraction-specific properties
  fractionAnswer?: string; // e.g., "3/4", "1 2/3" for display
  fractionOptions?: string[]; // For multiple choice fraction questions
  userFractionAnswer?: string; // User's fraction input
}

export interface QuizSettings {
  username: string;
  difficulty: Difficulty;
  numberOfQuestions: number;
  timerPerQuestion: number;
  questionType: QuestionType;
  mathOperations: MathOperation[]; // Changed from mathOperation to mathOperations array
}

export interface QuizState {
  // Settings
  settings: QuizSettings;
  
  // Quiz state
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  currentStreak: number;
  bestStreak: number;
  
  // Actions
  updateSettings: (settings: Partial<QuizSettings>) => void;
  setQuestions: (questions: Question[]) => void;
  startQuiz: () => void;
  nextQuestion: () => void;
  submitAnswer: (answer: number) => void;
  submitFractionAnswer: (fractionAnswer: string) => void;
  setTimeRemaining: (time: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  retryQuiz: (questions: Question[]) => void;
}

const defaultSettings: QuizSettings = {
  username: '',
  difficulty: 'easy',
  numberOfQuestions: 5,
  timerPerQuestion: 10,
  questionType: 'expression',
  mathOperations: ['addition'], // Default to addition selected
};

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  settings: defaultSettings,
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: defaultSettings.timerPerQuestion,
  isQuizActive: false,
  isQuizCompleted: false,
  currentStreak: 0,
  bestStreak: 0,
  
  // Actions
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  
  setQuestions: (questions) =>
    set({ questions, currentQuestionIndex: 0 }),
  
  startQuiz: () =>
    set((state) => ({
      isQuizActive: true,
      isQuizCompleted: false,
      currentQuestionIndex: 0,
      timeRemaining: state.settings.timerPerQuestion,
    })),
  
  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= state.questions.length;
      
      return {
        currentQuestionIndex: nextIndex,
        timeRemaining: isCompleted ? 0 : state.settings.timerPerQuestion,
        isQuizCompleted: isCompleted,
        isQuizActive: !isCompleted,
      };
    }),
  
  submitAnswer: (answer) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      
      if (currentQuestion) {
        currentQuestion.userAnswer = answer;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - answer) < 0.01;
        currentQuestion.timeSpent = state.settings.timerPerQuestion - state.timeRemaining;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak
        };
      }
      
      return { questions: updatedQuestions };
    }),

  submitFractionAnswer: (fractionAnswer) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      
      if (currentQuestion) {
        currentQuestion.userFractionAnswer = fractionAnswer;
        // For fraction questions, compare with the expected fraction answer
        if (currentQuestion.fractionAnswer) {
          // Use areFractionsEqual for proper fraction comparison
          currentQuestion.isCorrect = areFractionsEqual(fractionAnswer, currentQuestion.fractionAnswer);
        } else {
          // Fallback to decimal comparison if no fraction answer available
          const parsedFraction = parseFraction(fractionAnswer);
          const decimalValue = parsedFraction ? Number(parsedFraction.valueOf()) : 0;
          currentQuestion.isCorrect = Math.abs(currentQuestion.answer - decimalValue) < 0.01;
        }
        currentQuestion.timeSpent = state.settings.timerPerQuestion - state.timeRemaining;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak
        };
      }
      
      return { questions: updatedQuestions };
    }),
  
  setTimeRemaining: (time) =>
    set({ timeRemaining: time }),
  
  completeQuiz: () =>
    set({ isQuizActive: false, isQuizCompleted: true }),
  
  resetQuiz: () =>
    set({
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: get().settings.timerPerQuestion,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      // Note: we keep bestStreak to maintain the user's record
    }),

  retryQuiz: (questions) =>
    set({
      questions,
      currentQuestionIndex: 0,
      timeRemaining: get().settings.timerPerQuestion,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      // Note: we keep bestStreak to maintain the user's record
    }),
}));
