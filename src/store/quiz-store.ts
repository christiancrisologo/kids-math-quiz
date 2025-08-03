import { create } from 'zustand';

export type Difficulty = 'easy' | 'hard';
export type QuestionType = 'expression' | 'multiple-choice';
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'algebraic';

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
}

export interface QuizSettings {
  username: string;
  difficulty: Difficulty;
  numberOfQuestions: number;
  timerPerQuestion: number;
  questionType: QuestionType;
  mathOperation: MathOperation;
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
  
  // Actions
  updateSettings: (settings: Partial<QuizSettings>) => void;
  setQuestions: (questions: Question[]) => void;
  startQuiz: () => void;
  nextQuestion: () => void;
  submitAnswer: (answer: number) => void;
  setTimeRemaining: (time: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const defaultSettings: QuizSettings = {
  username: '',
  difficulty: 'easy',
  numberOfQuestions: 5,
  timerPerQuestion: 10,
  questionType: 'expression',
  mathOperation: 'addition',
};

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  settings: defaultSettings,
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: defaultSettings.timerPerQuestion,
  isQuizActive: false,
  isQuizCompleted: false,
  
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
    }),
}));
