import { QuizSettings } from '../store/quiz-store';
import { SupabaseClient } from '@supabase/supabase-js';

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
  created_at?: string | Date;
  timeSpent: number;
  quizDuration: number;
  averageTimePerQuestion: number;
  pendingSync?: boolean;
}

export interface UserPreferences {
  username: string;
  userId?: string;
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
      if (preferences.userId) {
        localStorage.setItem('mathquiz_user_id', preferences.userId);
      }
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  },

  load: (): UserPreferences | null => {
    try {
      const stored = localStorage.getItem('mathquiz_user_preferences');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const userId = localStorage.getItem('mathquiz_user_id') || parsed.userId;
      return {
        ...parsed,
        userId,
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
  save: (result: Omit<GameResult, 'id' | 'completedAt'>, online: boolean): GameResult => {
    try {
      const gameResult: GameResult = {
        ...result,
        id: generateGameId(),
        completedAt: new Date(),
        pendingSync: !online
      };
      const existingHistory = gameHistoryStorage.loadAll();
      const updatedHistory = [gameResult, ...existingHistory];
      const trimmedHistory = updatedHistory.slice(0, 100);
      localStorage.setItem('mathquiz_game_history', JSON.stringify(trimmedHistory));
      return gameResult;
    } catch (error) {
      console.error('Failed to save game result:', error);
      throw error;
    }
  },
  syncPendingRecords: async (supabaseClient: SupabaseClient, tableName: string) => {
    // Only run if online
    if (!navigator.onLine) return;
    const allResults = gameHistoryStorage.loadAll();
    const pending = allResults.filter(r => r.pendingSync);
    for (const record of pending) {
      // Check if record exists in Supabase by ID
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('id')
        .eq('id', record.id);
      if (!error && (!data || data.length === 0)) {
        // Save to Supabase
        const { error: saveError } = await supabaseClient
          .from(tableName)
          .insert([{ ...record, pendingSync: undefined }]);
        if (!saveError) {
          // Mark as synced
          record.pendingSync = false;
        }
      }
    }
    // Update localStorage
    const merged = allResults.map(r =>
      pending.find(p => p.id === r.id) ? { ...r, pendingSync: false } : r
    );
    localStorage.setItem('mathquiz_game_history', JSON.stringify(merged));
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
  mergeWithRemote: (remoteRecords: GameResult[]): GameResult[] => {
    // Merge local and remote, deduplicate by ID
    const local = gameHistoryStorage.loadAll();
    const all = [...remoteRecords];
    for (const rec of local) {
      if (!all.find(r => r.id === rec.id)) {
        all.push(rec);
      }
    }
    return all;
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