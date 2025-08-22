import { QuizSettings } from '../store/quiz-store';
import { SupabaseClient } from '@supabase/supabase-js';

export interface GameResult {
  created_at: string;
  id: string;
  userId?: string;
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
  pendingSync?: boolean;
}

export interface UserPreferences {
  userId: string;
  userName: string;
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
      // Store user info in a dedicated key
      localStorage.setItem('mathquiz_user_info', JSON.stringify({
        userId: preferences.userId,
        userName: preferences.userName
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
      const userInfo = localStorage.getItem('mathquiz_user_info');
      let userId = '';
      let userName = '';
      if (userInfo) {
        const info = JSON.parse(userInfo);
        userId = info.userId;
        userName = info.userName;
      }
      return {
        ...parsed,
        userId,
        userName,
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
  save: (result: Omit<GameResult, 'id' | 'completedAt' | 'username'>, online: boolean): GameResult => {
    try {
      // Get user info from localStorage
      const userInfo = localStorage.getItem('mathquiz_user_info');
      let userId = '';
      if (userInfo) {
        const info = JSON.parse(userInfo);
        userId = info.userId;
      }
      const now = new Date();
      const gameResult: GameResult = {
        ...result,
        userId,
        id: generateGameId(),
        completedAt: now,
        created_at: now.toISOString(),
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
    // Normalize created_at to string for all records
    return all.map(r => ({
      ...r,
      created_at: typeof r.created_at === 'string'
        ? r.created_at
        : r.completedAt instanceof Date
          ? r.completedAt.toISOString()
          : typeof r.completedAt === 'string'
            ? r.completedAt
            : new Date().toISOString()
    }));
  },


  clear: (): void => {
    try {
      localStorage.removeItem('mathquiz_game_history');
    } catch (error) {
      console.error('Failed to clear game history:', error);
    }
  },

};

// Utility function to generate unique game IDs
function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}