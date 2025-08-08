import { QuizSettings } from '../store/quiz-store';

export interface GameResult {
  id: string;
  username: string;
  settings: QuizSettings;
  questions: Array<{
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  completedAt: Date;
  timeSpent: number;
  quizDuration: number;
  averageTimePerQuestion: number;
}

export interface UserPreferences {
  username: string;
  settings: QuizSettings;
  lastUpdated: Date;
}

// User preferences storage
export const userPreferencesStorage = {
  save: (preferences: UserPreferences): void => {
    try {
      localStorage.setItem('mathquiz_user_preferences', JSON.stringify({
        ...preferences,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  },

  load: (): UserPreferences | null => {
    try {
      const stored = localStorage.getItem('mathquiz_user_preferences');
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      };
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem('mathquiz_user_preferences');
    } catch (error) {
      console.error('Failed to clear user preferences:', error);
    }
  }
};

// Game history storage
export const gameHistoryStorage = {
  save: (result: Omit<GameResult, 'id' | 'completedAt'>): GameResult => {
    try {
      const gameResult: GameResult = {
        ...result,
        id: generateGameId(),
        completedAt: new Date()
      };

      const existingHistory = gameHistoryStorage.loadAll();
      const updatedHistory = [gameResult, ...existingHistory];
      
      // Keep only the last 100 games to prevent localStorage bloat
      const trimmedHistory = updatedHistory.slice(0, 100);
      
      localStorage.setItem('mathquiz_game_history', JSON.stringify(trimmedHistory));
      return gameResult;
    } catch (error) {
      console.error('Failed to save game result:', error);
      throw error;
    }
  },

  loadAll: (): GameResult[] => {
    try {
      const stored = localStorage.getItem('mathquiz_game_history');
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((result: GameResult) => ({
        ...result,
        completedAt: new Date(result.completedAt)
      }));
    } catch (error) {
      console.error('Failed to load game history:', error);
      return [];
    }
  },

  loadByUser: (username: string): GameResult[] => {
    try {
      const allResults = gameHistoryStorage.loadAll();
      return allResults.filter(result => 
        result.username.toLowerCase() === username.toLowerCase()
      );
    } catch (error) {
      console.error('Failed to load user game history:', error);
      return [];
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem('mathquiz_game_history');
    } catch (error) {
      console.error('Failed to clear game history:', error);
    }
  },

  clearByUser: (username: string): void => {
    try {
      const allResults = gameHistoryStorage.loadAll();
      const filteredResults = allResults.filter(result => 
        result.username.toLowerCase() !== username.toLowerCase()
      );
      localStorage.setItem('mathquiz_game_history', JSON.stringify(filteredResults));
    } catch (error) {
      console.error('Failed to clear user game history:', error);
    }
  }
};

// Utility function to generate unique game IDs
function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}