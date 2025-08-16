import { create } from 'zustand';
import { areFractionsEqual, parseFraction } from '../utils/math/fraction-utils';
import { userPreferencesStorage, gameHistoryStorage, GameResult } from '../utils/storage';
import { createUser, getUserByUsername, createGameRecord } from '../utils/supabaseGame';
import { APP } from '../utils/supabaseTables';

export type Difficulty = 'easy' | 'hard';
export type QuestionType = 'expression' | 'multiple-choice';
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'algebraic' | 'binomial';
export type NumberType = 'integers' | 'decimals' | 'fractions' | 'currency' | 'time';

export interface Question {
  id: string;
  question: string;
  answer: number;
  variable?: string; // e.g., "x", "y" for algebraic questions, or "x,y" for binomial
  variables?: string[]; // Array of variables for multi-variable equations like binomials
  equation?: string; // Original equation for display
  userAnswer?: number;
  isCorrect?: boolean;
  options?: number[]; // For multiple choice questions
  timeSpent?: number;
  // Fraction-specific properties
  fractionAnswer?: string; // e.g., "3/4", "1 2/3" for display
  fractionOptions?: string[]; // For multiple choice fraction questions
  userFractionAnswer?: string; // User's fraction input
  // Currency-specific properties
  currencyOptions?: string[]; // For multiple choice currency questions (formatted)
  // Time-specific properties
  timeOptions?: string[]; // For multiple choice time questions (formatted)
}

export interface QuizSettings {
  username: string;
  difficulty: Difficulty;
  numberOfQuestions: number;
  timerPerQuestion: number;
  questionType: QuestionType;
  mathOperations: MathOperation[];
  numberTypes: NumberType[]; // New field for number types selection
  // Enhanced settings for game mechanics
  timerEnabled: boolean;
  questionsEnabled: boolean;
  minCorrectAnswers: number;
  maxCorrectAnswers: number;
  correctAnswersEnabled: boolean;
  minIncorrectAnswers: number;
  maxIncorrectAnswers: number;
  incorrectAnswersEnabled: boolean;
  // Overall timer settings
  overallTimerEnabled: boolean;
  overallTimerDuration: number; // in seconds
  // Challenge mode
  challengeMode?: string; // Selected challenge mode name
}

export interface QuizState {
  _gameRecordSaved?: boolean;
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
  
  // Enhanced game mechanics tracking
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  quizStartTime: number | null;
  
  // Overall timer state
  overallTimeRemaining: number;
  overallTimerActive: boolean;
  
  // Actions
  updateSettings: (settings: Partial<QuizSettings>) => void;
  setQuestions: (questions: Question[]) => void;
  startQuiz: () => void;
  nextQuestion: () => void;
  submitAnswer: (answer: number) => void;
  submitFractionAnswer: (fractionAnswer: string) => void;
  submitCurrencyAnswer: (currencyAnswer: string) => void;
  submitTimeAnswer: (timeAnswer: string) => void;
  setTimeRemaining: (time: number) => void;
  setOverallTimeRemaining: (time: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  retryQuiz: (questions: Question[]) => void;
  
  // Persistence actions
  loadUserPreferences: () => void;
  saveUserPreferences: () => void;
  saveGameResult: () => GameResult | null;
  clearUserData: () => void;
}

const defaultSettings: QuizSettings = {
  username: '',
  difficulty: 'easy',
  numberOfQuestions: 5,
  timerPerQuestion: 10,
  questionType: 'expression',
  mathOperations: ['addition'], // Default to addition selected
  numberTypes: ['integers'], // Default to integers selected
  // Enhanced settings with defaults
  timerEnabled: true,
  questionsEnabled: true,
  minCorrectAnswers: 0,
  maxCorrectAnswers: 5,
  correctAnswersEnabled: false,
  minIncorrectAnswers: 0,
  maxIncorrectAnswers: 5,
  incorrectAnswersEnabled: false,
  // Overall timer settings with defaults
  overallTimerEnabled: false,
  overallTimerDuration: 180, // 3 minutes default
  // Challenge mode default
  challengeMode: undefined,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  _gameRecordSaved: false,
  // Initial state
  settings: defaultSettings,
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: defaultSettings.timerPerQuestion,
  isQuizActive: false,
  isQuizCompleted: false,
  currentStreak: 0,
  bestStreak: 0,
  correctAnswersCount: 0,
  incorrectAnswersCount: 0,
  quizStartTime: null,
  
  // Overall timer initial state
  overallTimeRemaining: defaultSettings.overallTimerDuration,
  overallTimerActive: false,
  
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
      timeRemaining: state.settings.timerEnabled ? state.settings.timerPerQuestion : 0,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      quizStartTime: Date.now(),
      overallTimeRemaining: state.settings.overallTimerEnabled ? state.settings.overallTimerDuration : 0,
      overallTimerActive: state.settings.overallTimerEnabled,
      _gameRecordSaved: false,
    })),
  
  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= state.questions.length;
      
      // Check if quiz should end based on enhanced settings
      const shouldEndBasedOnCorrect = state.settings.correctAnswersEnabled && 
        state.correctAnswersCount >= state.settings.maxCorrectAnswers;
      const shouldEndBasedOnIncorrect = state.settings.incorrectAnswersEnabled && 
        state.incorrectAnswersCount >= state.settings.maxIncorrectAnswers;
      
      const shouldComplete = isCompleted || shouldEndBasedOnCorrect || shouldEndBasedOnIncorrect;
      
      return {
        currentQuestionIndex: nextIndex,
        timeRemaining: shouldComplete ? 0 : (state.settings.timerEnabled ? state.settings.timerPerQuestion : 0),
        isQuizCompleted: shouldComplete,
        isQuizActive: !shouldComplete,
      };
    }),
  
  submitAnswer: (answer) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      
      if (currentQuestion) {
        currentQuestion.userAnswer = answer;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - answer) < 0.01;
        currentQuestion.timeSpent = state.settings.timerEnabled ? 
          (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        // Update correct/incorrect counts
        const newCorrectCount = currentQuestion.isCorrect ? 
          state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? 
          state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
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
        currentQuestion.timeSpent = state.settings.timerEnabled ? 
          (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        // Update correct/incorrect counts
        const newCorrectCount = currentQuestion.isCorrect ? 
          state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? 
          state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      
      return { questions: updatedQuestions };
    }),

  submitCurrencyAnswer: (currencyAnswer) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      
      if (currentQuestion) {
        // For currency questions, compare the formatted string or parsed value
        const parsedCurrency = parseFloat(currencyAnswer.replace('$', '')) || 0;
        currentQuestion.userAnswer = parsedCurrency;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - parsedCurrency) < 0.01;
        currentQuestion.timeSpent = state.settings.timerEnabled ? 
          (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        // Update correct/incorrect counts
        const newCorrectCount = currentQuestion.isCorrect ? 
          state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? 
          state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      
      return { questions: updatedQuestions };
    }),

  submitTimeAnswer: (timeAnswer) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      
      if (currentQuestion) {
        // For time questions, convert time string back to seconds for comparison
        const parts = timeAnswer.split(':').map(Number);
        let timeInSeconds = 0;
        if (parts.length === 2) {
          // Check if it's hours:minutes or minutes:seconds based on magnitude
          if (currentQuestion.answer > 3600) {
            // Hour format (HH:MM)
            timeInSeconds = (parts[0] * 60 + parts[1]) * 60;
          } else {
            // Minute format (MM:SS)
            timeInSeconds = parts[0] * 60 + parts[1];
          }
        }
        
        currentQuestion.userAnswer = timeInSeconds;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - timeInSeconds) < 1; // 1-second tolerance
        currentQuestion.timeSpent = state.settings.timerEnabled ? 
          (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        
        // Update streak
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        
        // Update correct/incorrect counts
        const newCorrectCount = currentQuestion.isCorrect ? 
          state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? 
          state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        
        return { 
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      
      return { questions: updatedQuestions };
    }),
  
  setTimeRemaining: (time) =>
    set({ timeRemaining: time }),

  setOverallTimeRemaining: (time) =>
    set({ overallTimeRemaining: time }),
  
  completeQuiz: () =>
    set({ isQuizActive: false, isQuizCompleted: true, overallTimerActive: false }),
  
  resetQuiz: () =>
    set({
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: get().settings.timerEnabled ? get().settings.timerPerQuestion : 0,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      quizStartTime: null,
      overallTimeRemaining: get().settings.overallTimerDuration,
      overallTimerActive: false,
      // Note: we keep bestStreak to maintain the user's record
    }),

  retryQuiz: (questions) =>
    set({
      questions,
      currentQuestionIndex: 0,
      timeRemaining: get().settings.timerEnabled ? get().settings.timerPerQuestion : 0,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      quizStartTime: null,
      overallTimeRemaining: get().settings.overallTimerDuration,
      overallTimerActive: false,
      _gameRecordSaved: false,
      // Note: we keep bestStreak to maintain the user's record
    }),

  // Persistence methods
  loadUserPreferences: () => {
    const preferences = userPreferencesStorage.load();
    if (preferences) {
      set((state) => ({
        settings: { ...state.settings, ...preferences.settings }
      }));
    }
  },

  saveUserPreferences: () => {
    const state = get();
    userPreferencesStorage.save({
      username: state.settings.username,
      settings: state.settings,
      lastUpdated: new Date()
    });
  },

  saveGameResult: () => {
    const state = get();
    // Only save if quiz is completed and has questions
    if (!state.isQuizCompleted || state.questions.length === 0) {
      return null;
    }
    // Prevent duplicate record
    if (get()._gameRecordSaved) {
      return null;
    }
    set({ _gameRecordSaved: true });

    const correctAnswers = state.questions.filter(q => q.isCorrect).length;
    const totalQuestions = state.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTimeSpent = state.questions.reduce((total, q) => total + (q.timeSpent || 0), 0);
    const quizDuration = state.quizStartTime ? Math.round((Date.now() - state.quizStartTime) / 1000) : totalTimeSpent;

    // Supabase integration
    (async () => {
      try {
        let user = await getUserByUsername(state.settings.username);
        if (!user) {
          try {
            user = await createUser(state.settings.username);
          } catch (err: any) {
            // If duplicate key error, fetch user again
            if (err.message && err.message.includes('duplicate key value')) {
              user = await getUserByUsername(state.settings.username);
            } else {
              throw err;
            }
          }
        }
        await createGameRecord({
          player_id: user.id,
          game_id: APP.ID,
          score,
          achievement: '', // Add achievement logic if needed
          challenge_mode: state.settings.challengeMode || 'none',
          game_duration: quizDuration,
          player_level: state.settings.difficulty,
          game_settings: state.settings,
        });
      } catch (error) {
        console.error('Supabase save error:', error);
      }
    })();

    // Optionally, still save locally for offline/history
    const gameResult = gameHistoryStorage.save({
      username: state.settings.username,
      settings: state.settings,
      questions: state.questions.map(q => ({
        question: q.question,
        correctAnswer: q.fractionAnswer || q.answer.toString(),
        userAnswer: q.userFractionAnswer || q.userAnswer?.toString() || '',
        isCorrect: q.isCorrect || false,
        timeSpent: q.timeSpent || 0
      })),
      totalQuestions,
      correctAnswers,
      incorrectAnswers: state.incorrectAnswersCount,
      score,
      timeSpent: totalTimeSpent,
      quizDuration,
      averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
    });
    return gameResult;
  },

  clearUserData: () => {
    userPreferencesStorage.clear();
    gameHistoryStorage.clear();
    set({
      settings: defaultSettings,
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: defaultSettings.timerEnabled ? defaultSettings.timerPerQuestion : 0,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      bestStreak: 0,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      quizStartTime: null,
      overallTimeRemaining: defaultSettings.overallTimerDuration,
      overallTimerActive: false,
    });
  },
}));
