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
    description: 'Basic math for young learners'
  },
  'junior-high': {
    label: '📚 Junior High School',
    difficulty: 'easy',
    numberOfQuestions: 10,
    timerPerQuestion: 10,
    questionType: ['expression', 'multiple-choice'],
    mathOperations: ['addition', 'subtraction', 'multiplication', 'division', 'algebraic'],
    numberTypes: ['integers', 'decimals', 'fractions'],
    description: 'Intermediate math concepts'
  },
  'senior-high': {
    label: '🎓 Senior High School',
    difficulty: 'hard',
    numberOfQuestions: 15,
    timerPerQuestion: 8,
    questionType: ['expression', 'multiple-choice'],
    mathOperations: ['addition', 'subtraction', 'multiplication', 'division', 'algebraic'],
    numberTypes: ['integers', 'decimals', 'fractions'],
    description: 'Advanced math challenges'
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
    numberTypes: preset.numberTypes
  };
};
