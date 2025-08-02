import { Difficulty, MathOperation, Question, QuestionType } from '../../store/quiz-store';

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateAdditionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 20 : 100;
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, max);
  return {
    question: `${a} + ${b}`,
    answer: a + b,
  };
};

const generateSubtractionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 20 : 100;
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, a); // Ensure positive result
  return {
    question: `${a} - ${b}`,
    answer: a - b,
  };
};

const generateMultiplicationQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 10 : 25;
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, max);
  return {
    question: `${a} × ${b}`,
    answer: a * b,
  };
};

const generateDivisionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 10 : 20;
  const divisor = getRandomNumber(2, max);
  const quotient = getRandomNumber(1, max);
  const dividend = divisor * quotient;
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: quotient,
  };
};

const generateQuestionByOperation = (operation: MathOperation, difficulty: Difficulty): { question: string; answer: number } => {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  const selectedOperation = operation === 'mixed' 
    ? operations[getRandomNumber(0, operations.length - 1)] as MathOperation
    : operation;

  switch (selectedOperation) {
    case 'addition':
      return generateAdditionQuestion(difficulty);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty);
    case 'multiplication':
      return generateMultiplicationQuestion(difficulty);
    case 'division':
      return generateDivisionQuestion(difficulty);
    default:
      return generateAdditionQuestion(difficulty);
  }
};

const generateMultipleChoiceOptions = (correctAnswer: number, difficulty: Difficulty): number[] => {
  const options = [correctAnswer];
  const range = difficulty === 'easy' ? 10 : 50;
  
  while (options.length < 3) {
    const offset = getRandomNumber(-range, range);
    const option = Math.max(0, correctAnswer + offset);
    
    if (!options.includes(option)) {
      options.push(option);
    }
  }
  
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
};

export const generateQuestions = (
  count: number,
  difficulty: Difficulty,
  operation: MathOperation,
  questionType: QuestionType
): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const { question, answer } = generateQuestionByOperation(operation, difficulty);
    const id = `question-${i + 1}`;
    
    const questionObj: Question = {
      id,
      question,
      answer,
    };
    
    if (questionType === 'multiple-choice') {
      questionObj.options = generateMultipleChoiceOptions(answer, difficulty);
    }
    
    questions.push(questionObj);
  }
  
  return questions;
};
