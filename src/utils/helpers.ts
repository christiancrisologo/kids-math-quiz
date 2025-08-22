// Helper functions extracted from landing page

import type { QuizSettings } from '../store/quiz-store';
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


export function handleSliderChange<T extends Record<string, unknown>>(
    min: number,
    max: number,
    field: string,
    setFormData: React.Dispatch<React.SetStateAction<T>>
) {
    setFormData((prev) => ({
        ...prev,
        [`min${field.charAt(0).toUpperCase() + field.slice(1)}`]: min,
        [`max${field.charAt(0).toUpperCase() + field.slice(1)}`]: max,
    }));
}

