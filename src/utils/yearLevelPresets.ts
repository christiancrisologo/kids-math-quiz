import type { Difficulty, QuestionType, MathOperation, NumberType } from '../store/quiz-store';

export type YearLevel = 'primary' | 'junior-high' | 'senior-high';

export interface YearLevelPreset {
  label: string;
  difficulty: Difficulty;
  numberOfQuestions: number;
  timerPerQuestion: number;
  questionType: QuestionType[];
  mathOperations: MathOperation[];
  numberTypes: NumberType[];
  description: string;
  // Enhanced settings
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
  countdownModeEnabled: boolean;
}

export const yearLevelPresets: Record<YearLevel, YearLevelPreset> = {
  'primary': {
    label: '🎒 Primary School',
    difficulty: 'easy',
    numberOfQuestions: 5,
    timerPerQuestion: 12,
    questionType: ['multiple-choice'],
    mathOperations: ['addition', 'subtraction', 'multiplication', 'division'],
    numberTypes: ['integers'],
    description: 'Basic math for young learners',
    // Enhanced settings - simple for primary
    timerEnabled: true,
    questionsEnabled: true,
    minCorrectAnswers: 0,
    maxCorrectAnswers: 5,
    correctAnswersEnabled: false,
    minIncorrectAnswers: 0,
    maxIncorrectAnswers: 3,
    incorrectAnswersEnabled: false,
    // Overall timer settings - disabled for primary
    overallTimerEnabled: false,
    overallTimerDuration: 180, // 3 minutes
    countdownModeEnabled: false,
  },
  'junior-high': {
    label: '📚 Junior High School',
    difficulty: 'easy',
    numberOfQuestions: 10,
    timerPerQuestion: 10,
    questionType: ['expression', 'multiple-choice'],
    mathOperations: ['addition', 'subtraction', 'multiplication', 'division', 'algebraic'],
    numberTypes: ['integers', 'decimals', 'fractions', 'currency', 'time'],
    description: 'Intermediate math concepts',
    // Enhanced settings - moderate challenge
    timerEnabled: true,
    questionsEnabled: true,
    minCorrectAnswers: 0,
    maxCorrectAnswers: 10,
    correctAnswersEnabled: false,
    minIncorrectAnswers: 0,
    maxIncorrectAnswers: 5,
    incorrectAnswersEnabled: false,
    // Overall timer settings - optional for junior high
    overallTimerEnabled: false,
    overallTimerDuration: 600, // 10 minutes
    countdownModeEnabled: false,
  },
  'senior-high': {
    label: '🎓 Senior High School',
    difficulty: 'hard',
    numberOfQuestions: 15,
    timerPerQuestion: 8,
    questionType: ['expression', 'multiple-choice'],
    mathOperations: ['addition', 'subtraction', 'multiplication', 'division', 'algebraic'],
    numberTypes: ['integers', 'decimals', 'fractions', 'currency', 'time'],
    description: 'Advanced math challenges',
    // Enhanced settings - challenging
    timerEnabled: true,
    questionsEnabled: true,
    minCorrectAnswers: 0,
    maxCorrectAnswers: 15,
    correctAnswersEnabled: false,
    minIncorrectAnswers: 0,
    maxIncorrectAnswers: 8,
    incorrectAnswersEnabled: false,
    // Overall timer settings - enabled for senior high with countdown mode
    overallTimerEnabled: true,
    overallTimerDuration: 900, // 15 minutes
    countdownModeEnabled: true,
  }
};

export const getYearLevelPreset = (yearLevel: YearLevel): YearLevelPreset => {
  return yearLevelPresets[yearLevel];
};

export const applyYearLevelPreset = (yearLevel: YearLevel) => {
  const preset = getYearLevelPreset(yearLevel);
  return {
    difficulty: preset.difficulty,
    numberOfQuestions: preset.numberOfQuestions,
    timerPerQuestion: preset.timerPerQuestion,
    questionType: preset.questionType[0], // Take the first question type as default
    mathOperations: preset.mathOperations,
    numberTypes: preset.numberTypes,
    // Enhanced settings
    timerEnabled: preset.timerEnabled,
    questionsEnabled: preset.questionsEnabled,
    minCorrectAnswers: preset.minCorrectAnswers,
    maxCorrectAnswers: preset.maxCorrectAnswers,
    correctAnswersEnabled: preset.correctAnswersEnabled,
    minIncorrectAnswers: preset.minIncorrectAnswers,
    maxIncorrectAnswers: preset.maxIncorrectAnswers,
    incorrectAnswersEnabled: preset.incorrectAnswersEnabled,
    // Overall timer settings
    overallTimerEnabled: preset.overallTimerEnabled,
    overallTimerDuration: preset.overallTimerDuration,
    countdownModeEnabled: preset.countdownModeEnabled,
  };
};
