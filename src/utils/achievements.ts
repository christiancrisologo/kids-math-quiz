import { QuizSettings } from '../store/quiz-store';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export const checkAchievements = (
  correctAnswers: number,
  totalQuestions: number,
  bestStreak: number,
  settings: QuizSettings
): Achievement[] => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const achievements: Achievement[] = [
    {
      id: 'first_perfect',
      title: 'Perfect Score!',
      description: 'Got 100% on a quiz',
      emoji: '🏆',
      unlocked: percentage === 100
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Got 5 answers correct in a row',
      emoji: '🔥',
      unlocked: bestStreak >= 5
    },
    {
      id: 'math_ninja',
      title: 'Math Ninja',
      description: 'Completed a hard difficulty quiz',
      emoji: '🥷',
      unlocked: settings.difficulty === 'hard'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Completed quiz with 5 seconds per question',
      emoji: '⚡',
      unlocked: settings.timerPerQuestion <= 5
    },
    {
      id: 'multi_master',
      title: 'Multi-Master',
      description: 'Selected 3+ math operations',
      emoji: '🎯',
      unlocked: settings.mathOperations?.length >= 3
    },
    {
      id: 'fraction_hero',
      title: 'Fraction Hero',
      description: 'Completed a fraction quiz',
      emoji: '🧮',
      unlocked: settings.numberTypes?.includes('fractions')
    },
    {
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Scored 90% or higher',
      emoji: '⭐',
      unlocked: percentage >= 90
    },
    {
      id: 'persistent_learner',
      title: 'Persistent Learner',
      description: 'Completed a 10+ question quiz',
      emoji: '📚',
      unlocked: totalQuestions >= 10
    }
  ];

  return achievements.filter(achievement => achievement.unlocked);
};
