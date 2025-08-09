import gamesConfig from '../configs/games.json';
import type { QuizSettings } from '../store/quiz-store';

export interface ChallengeMode {
  name: string;
  description: string;
  settings: {
    timerEnabled: boolean;
    questionsEnabled: boolean;
    minCorrectAnswers: number;
    maxCorrectAnswers: number;
    correctAnswersEnabled: boolean;
    minIncorrectAnswers: number;
    maxIncorrectAnswers: number;
    incorrectAnswersEnabled: boolean;
    overallTimerEnabled: boolean;
    overallTimerDuration: number;
    numberOfQuestions?: number;
    timerPerQuestion?: number;
  };
}

/**
 * Get all available challenge modes from the configuration
 */
export function getChallengeModes(): ChallengeMode[] {
  return gamesConfig.challenges as ChallengeMode[];
}

/**
 * Get a specific challenge mode by name
 */
export function getChallengeMode(name: string): ChallengeMode | undefined {
  const challenges = getChallengeModes();
  return challenges.find(challenge => challenge.name === name);
}

/**
 * Apply challenge mode settings to quiz settings
 * This will override specific settings based on the challenge mode
 * but preserve user preferences for things like username, difficulty, etc.
 */
export function applyChallengeMode(
  currentSettings: QuizSettings,
  challengeName: string
): QuizSettings {
  const challenge = getChallengeMode(challengeName);
  
  if (!challenge) {
    // If challenge not found, return current settings unchanged
    return { ...currentSettings, challengeMode: undefined };
  }

  // If it's "No Challenge", just clear the challenge mode but keep current settings
  if (challenge.name === 'No Challenge') {
    return {
      ...currentSettings,
      challengeMode: challenge.name,
      // Reset enhanced settings to defaults for no challenge
      correctAnswersEnabled: false,
      incorrectAnswersEnabled: false,
      overallTimerEnabled: false,
    };
  }

  // Apply challenge settings while preserving user preferences
  const updatedSettings: QuizSettings = {
    ...currentSettings,
    challengeMode: challenge.name,
    // Apply challenge-specific timer and question settings
    timerEnabled: challenge.settings.timerEnabled,
    questionsEnabled: challenge.settings.questionsEnabled,
    minCorrectAnswers: challenge.settings.minCorrectAnswers,
    maxCorrectAnswers: challenge.settings.maxCorrectAnswers,
    correctAnswersEnabled: challenge.settings.correctAnswersEnabled,
    minIncorrectAnswers: challenge.settings.minIncorrectAnswers,
    maxIncorrectAnswers: challenge.settings.maxIncorrectAnswers,
    incorrectAnswersEnabled: challenge.settings.incorrectAnswersEnabled,
    overallTimerEnabled: challenge.settings.overallTimerEnabled,
    overallTimerDuration: challenge.settings.overallTimerDuration,
  };

  // Apply specific number of questions and timer if provided
  if (challenge.settings.numberOfQuestions !== undefined) {
    updatedSettings.numberOfQuestions = challenge.settings.numberOfQuestions;
    updatedSettings.maxCorrectAnswers = Math.min(
      updatedSettings.maxCorrectAnswers,
      challenge.settings.numberOfQuestions
    );
    updatedSettings.maxIncorrectAnswers = Math.min(
      updatedSettings.maxIncorrectAnswers,
      challenge.settings.numberOfQuestions
    );
  }

  if (challenge.settings.timerPerQuestion !== undefined) {
    updatedSettings.timerPerQuestion = challenge.settings.timerPerQuestion;
  }

  return updatedSettings;
}

/**
 * Check if a challenge mode is completed based on the quiz results
 */
export function isChallengeCompleted(
  challengeName: string,
  correctAnswers: number,
  incorrectAnswers: number,
  totalQuestions: number,
  quizDuration?: number
): boolean {
  const challenge = getChallengeMode(challengeName);
  
  if (!challenge || challenge.name === 'No Challenge') {
    return false; // No challenge to complete
  }

  const settings = challenge.settings;

  // Check correct answers requirement
  if (settings.correctAnswersEnabled) {
    if (correctAnswers < settings.minCorrectAnswers || correctAnswers > settings.maxCorrectAnswers) {
      return false;
    }
  }

  // Check incorrect answers limit
  if (settings.incorrectAnswersEnabled) {
    if (incorrectAnswers < settings.minIncorrectAnswers || incorrectAnswers > settings.maxIncorrectAnswers) {
      return false;
    }
  }

  // Check overall timer requirement (must complete within time limit if enabled)
  if (settings.overallTimerEnabled && quizDuration) {
    if (quizDuration > settings.overallTimerDuration) {
      return false;
    }
  }

  return true;
}

/**
 * Get a congratulatory message for completing a challenge
 */
export function getChallengeCompletionMessage(challengeName: string): string {
  const messages: Record<string, string> = {
    "Perfect Score": "🎯 Amazing! You achieved a perfect score! Every answer was correct!",
    "Speed Challenge": "⚡ Lightning fast! You beat the clock and conquered the speed challenge!",
    "Endurance Test": "💪 Incredible stamina! You completed the endurance test like a true champion!",
    "Lightning Round": "🌟 Spectacular! You dominated the lightning round with precision and speed!",
    "Quick Fire": "🔥 Blazing fast! You mastered the quick fire challenge with incredible speed!",
    "Streak Master": "🏆 Streak genius! You nailed 5 in a row like a true math master!",
    "Marathon Mode": "🏃‍♂️ Marathon champion! You conquered the epic 30-question challenge!",
    "Precision Test": "🎪 Near perfection! Your precision is absolutely outstanding!",
    "Time Pressure": "⏰ Pressure handled! You stayed cool under the time crunch!",
    "One Shot Wonder": "💎 Flawless execution! You're a one-shot wonder superstar!",
    "Survivor Mode": "🦸‍♂️ Ultimate survivor! You outlasted the challenge like a hero!",
    "Rush Hour": "🚀 Rush hour master! You blazed through with incredible speed!",
    "Steady Pace": "🐢 Steady wins the race! Your patience and accuracy paid off!",
    "Double or Nothing": "🎲 High stakes hero! You conquered the double or nothing challenge!",
  };

  return messages[challengeName] || `🎉 Congratulations! You completed the ${challengeName} challenge!`;
}
