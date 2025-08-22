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
  overallTimerDuration: number;
  challengeMode?: string;
}

export interface QuizState {
  _gameRecordSaved?: boolean;
  settings: QuizSettings;
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  currentStreak: number;
  bestStreak: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  quizStartTime: number | null;
  overallTimeRemaining: number;
  overallTimerActive: boolean;
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
  loadUserPreferences: () => void;
  saveUserPreferences: () => void;
  saveGameResult: () => Promise<GameResult | null>;
  clearUserData: () => void;
}

const defaultSettings: QuizSettings = {
  username: '',
  difficulty: 'easy',
  numberOfQuestions: 5,
  timerPerQuestion: 10,
  questionType: 'expression',
  mathOperations: ['addition'],
  numberTypes: ['integers'],
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
  challengeMode: undefined,
};

// Helper for Supabase save logic
export async function saveGameToSupabase({ username, score, quizDuration, settings }: {
  username: string;
  score: number;
  quizDuration: number;
  settings: QuizSettings;
}) {
  try {
    let user = await getUserByUsername(username);
    if (!user) {
      try {
        user = await createUser(username);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string' && (err as { message?: string }).message?.includes('duplicate key value')) {
          user = await getUserByUsername(username);
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
      challenge_mode: settings.challengeMode || 'none',
      game_duration: quizDuration,
      player_level: settings.difficulty,
      game_settings: JSON.parse(JSON.stringify(settings))
    });
  } catch (error) {
    console.error('Supabase save error:', error);
  }
}

export const useQuizStore = create<QuizState>((set, get) => ({
  _gameRecordSaved: false,
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
  overallTimeRemaining: defaultSettings.overallTimerDuration,
  overallTimerActive: false,

  updateSettings: (newSettings: Partial<QuizSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  setQuestions: (questions: Question[]) => {
    set({ questions, currentQuestionIndex: 0 });
  },
  startQuiz: () => {
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
    }));
  },
  nextQuestion: () => {
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= state.questions.length;
      const shouldEndBasedOnCorrect = state.settings.correctAnswersEnabled && state.correctAnswersCount >= state.settings.maxCorrectAnswers;
      const shouldEndBasedOnIncorrect = state.settings.incorrectAnswersEnabled && state.incorrectAnswersCount >= state.settings.maxIncorrectAnswers;
      const shouldComplete = isCompleted || shouldEndBasedOnCorrect || shouldEndBasedOnIncorrect;
      return {
        currentQuestionIndex: nextIndex,
        timeRemaining: shouldComplete ? 0 : (state.settings.timerEnabled ? state.settings.timerPerQuestion : 0),
        isQuizCompleted: shouldComplete,
        isQuizActive: !shouldComplete,
      };
    });
  },
  submitAnswer: (answer: number) => {
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      if (currentQuestion) {
        currentQuestion.userAnswer = answer;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - answer) < 0.01;
        currentQuestion.timeSpent = state.settings.timerEnabled ? (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        const newCorrectCount = currentQuestion.isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        return {
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      return { questions: updatedQuestions };
    });
  },
  submitFractionAnswer: (fractionAnswer: string) => {
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      if (currentQuestion) {
        currentQuestion.userFractionAnswer = fractionAnswer;
        if (currentQuestion.fractionAnswer) {
          currentQuestion.isCorrect = areFractionsEqual(fractionAnswer, currentQuestion.fractionAnswer);
        } else {
          const parsedFraction = parseFraction(fractionAnswer);
          const decimalValue = parsedFraction ? Number(parsedFraction.valueOf()) : 0;
          currentQuestion.isCorrect = Math.abs(currentQuestion.answer - decimalValue) < 0.01;
        }
        currentQuestion.timeSpent = state.settings.timerEnabled ? (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        const newCorrectCount = currentQuestion.isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        return {
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      return { questions: updatedQuestions };
    });
  },
  submitCurrencyAnswer: (currencyAnswer: string) => {
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      if (currentQuestion) {
        const parsedCurrency = parseFloat(currencyAnswer.replace('$', '')) || 0;
        currentQuestion.userAnswer = parsedCurrency;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - parsedCurrency) < 0.01;
        currentQuestion.timeSpent = state.settings.timerEnabled ? (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        const newCorrectCount = currentQuestion.isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        return {
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      return { questions: updatedQuestions };
    });
  },
  submitTimeAnswer: (timeAnswer: string) => {
    set((state) => {
      const updatedQuestions = [...state.questions];
      const currentQuestion = updatedQuestions[state.currentQuestionIndex];
      if (currentQuestion) {
        const parts = timeAnswer.split(':').map(Number);
        let timeInSeconds = 0;
        if (parts.length === 2) {
          if (currentQuestion.answer > 3600) {
            timeInSeconds = (parts[0] * 60 + parts[1]) * 60;
          } else {
            timeInSeconds = parts[0] * 60 + parts[1];
          }
        }
        currentQuestion.userAnswer = timeInSeconds;
        currentQuestion.isCorrect = Math.abs(currentQuestion.answer - timeInSeconds) < 1;
        currentQuestion.timeSpent = state.settings.timerEnabled ? (state.settings.timerPerQuestion - state.timeRemaining) : 0;
        const newStreak = currentQuestion.isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        const newCorrectCount = currentQuestion.isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount;
        const newIncorrectCount = !currentQuestion.isCorrect ? state.incorrectAnswersCount + 1 : state.incorrectAnswersCount;
        return {
          questions: updatedQuestions,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          correctAnswersCount: newCorrectCount,
          incorrectAnswersCount: newIncorrectCount,
        };
      }
      return { questions: updatedQuestions };
    });
  },
  setTimeRemaining: (time: number) => {
    set({ timeRemaining: time });
  },
  setOverallTimeRemaining: (time: number) => {
    set({ overallTimeRemaining: time });
  },
  completeQuiz: () => {
    set({ isQuizActive: false, isQuizCompleted: true, overallTimerActive: false });
  },
  resetQuiz: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: get().settings.timerEnabled ? get().settings.timerPerQuestion : 0,
      isQuizActive: false,
      isQuizCompleted: false,
      currentStreak: 0,
      bestStreak: 0,
      correctAnswersCount: 0,
      incorrectAnswersCount: 0,
      quizStartTime: null,
      overallTimeRemaining: get().settings.overallTimerDuration,
      overallTimerActive: false,
    });
  },
  retryQuiz: (questions: Question[]) => {
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
    });
  },
  loadUserPreferences: () => {
    const preferences = userPreferencesStorage.load();
    if (preferences) {
      set((state) => ({
        settings: { ...state.settings, ...preferences.settings },
      }));
    }
  },
  saveUserPreferences: () => {
    const state = get();
    // Get userId from localStorage (math_quiz_user)
    let userId = '';
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('math_quiz_user');
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          userId = userObj.userId || '';
        } catch {}
      }
    }
    userPreferencesStorage.save({
      userId,
      userName: state.settings.username,
      settings: state.settings,
      lastUpdated: new Date(),
    });
  },

  saveGameResult: async () => {
    const state = get();
    if (!state.isQuizCompleted || state.questions.length === 0) {
      return null;
    }
    if (get()._gameRecordSaved) {
      return null;
    }

    const correctAnswers = state.questions.filter(q => q.isCorrect).length;
    const totalQuestions = state.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTimeSpent = state.questions.reduce((total, q) => total + (q.timeSpent || 0), 0);
    const quizDuration = state.quizStartTime ? Math.round((Date.now() - state.quizStartTime) / 1000) : totalTimeSpent;

    // Get userId from localStorage
    let userId = '';
    let userName = state.settings.username;
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('math_quiz_user');
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          userId = userObj.userId || '';
          userName = userObj.userName || userName;
        } catch {}
      }
    }

    // If online, check user in DB by userName, create if not found, then save game record
    if (navigator.onLine && userName) {
      try {
        let user = await getUserByUsername(userName);
        if (!user) {
          user = await createUser(userName);
        }
        if (user && user.id) {
          userId = user.id;
          // Update user reference in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('math_quiz_user', JSON.stringify({ userId, userName }));
          }
        }
        await createGameRecord({
          player_id: userId,
          game_id: APP.ID,
          score,
          achievement: '',
          challenge_mode: state.settings.challengeMode || 'none',
          game_duration: quizDuration,
          player_level: state.settings.difficulty,
          game_settings: (state.settings as unknown) as Record<string, unknown>,
        });
      } catch (error) {
        console.error('Supabase save error:', error);
      }
    }

    // Save to localStorage (always, for offline support)
    const gameResult = gameHistoryStorage.save({
      settings: state.settings,
      questions: state.questions.map(q => ({
        question: q.question,
        correctAnswer: q.fractionAnswer || q.answer.toString(),
        userAnswer: q.userFractionAnswer || q.userAnswer?.toString() || '',
        isCorrect: q.isCorrect || false,
        timeSpent: q.timeSpent || 0,
      })),
      totalQuestions,
      correctAnswers,
      incorrectAnswers: state.incorrectAnswersCount,
      score,
      timeSpent: totalTimeSpent,
      quizDuration,
      averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
    }, !navigator.onLine);
    set({ _gameRecordSaved: true });
    return gameResult;
  },
  clearUserData: () => {
    userPreferencesStorage.clear();
    gameHistoryStorage.clear();
    set({ settings: defaultSettings, questions: [], currentQuestionIndex: 0 });
  },
}));
