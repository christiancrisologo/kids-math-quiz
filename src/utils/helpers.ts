// Helper functions extracted from landing page

import type { Difficulty, QuestionType, MathOperation, NumberType, QuizSettings } from '../store/quiz-store';
import { yearLevelPresets, applyYearLevelPreset, YearLevel } from './yearLevelPresets';
import { applyChallengeMode, ChallengeMode } from './challengeModes';
import { initialFormData } from '../constants/initialFormData';

export function getInitialFormData(settings: QuizSettings): Partial<QuizSettings> {
  // Used to sync form data with loaded settings or apply defaults from initialFormData constant
  const hasSavedSettings = settings.username && settings.username.trim() !== '';
  if (hasSavedSettings) {
    return {
      ...initialFormData,
      ...settings,
      mathOperations: settings.mathOperations?.length ? settings.mathOperations : initialFormData.mathOperations,
      numberTypes: settings.numberTypes?.length ? settings.numberTypes : initialFormData.numberTypes,
    };
  } else {
    return { ...initialFormData };
  }
}

export function handleToggle<T>(current: T[], value: T): T[] {
  const isSelected = current.includes(value);
  if (isSelected) {
    if (current.length === 1) return current;
    return current.filter((item) => item !== value);
  } else {
    return [...current, value];
  }
}

export function handleSliderChange(min: number, max: number, field: string, setFormData: Function) {
  setFormData((prev: any) => ({
    ...prev,
    [field + 'Min']: min,
    [field + 'Max']: max,
  }));
}

export function getYearLevelInfo(yearLevel: YearLevel) {
  return yearLevelPresets[yearLevel];
}

export function getChallengeInfo(challengeModes: ChallengeMode[], selectedChallengeMode: string) {
  return challengeModes.find((c) => c.name === selectedChallengeMode);
}
