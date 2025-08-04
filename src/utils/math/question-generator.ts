import { Difficulty, MathOperation, Question, QuestionType } from '../../store/quiz-store';
import Fraction from 'fraction.js';
import { 
  generateRandomFraction, 
  generateProperFraction, 
  generateImproperFraction,
  toMixedNumber,
  generateFractionOptions
} from './fraction-utils';

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

const generateAlgebraicQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  if (difficulty === 'easy') {
    // Single-step equations
    const operations = ['addition', 'subtraction', 'multiplication'];
    const operation = operations[getRandomNumber(0, operations.length - 1)];
    
    switch (operation) {
      case 'addition': // x + a = b
        const a1 = getRandomNumber(1, 20);
        const x1 = getRandomNumber(1, 20);
        return { question: `x + ${a1} = ${x1 + a1}`, answer: x1 };
      
      case 'subtraction': // x - a = b
        const a2 = getRandomNumber(1, 15);
        const x2 = getRandomNumber(a2 + 1, 25); // Ensure positive result
        return { question: `x - ${a2} = ${x2 - a2}`, answer: x2 };
      
      case 'multiplication': // ax = b
        const a3 = getRandomNumber(2, 10);
        const x3 = getRandomNumber(1, 15);
        return { question: `${a3}x = ${a3 * x3}`, answer: x3 };
      
      default:
        const a4 = getRandomNumber(1, 20);
        const x4 = getRandomNumber(1, 20);
        return { question: `x + ${a4} = ${x4 + a4}`, answer: x4 };
    }
  } else {
    // Multi-step equations: ax + b = c or ax - b = c
    const useAddition = Math.random() > 0.5;
    const a = getRandomNumber(2, 5);
    const b = getRandomNumber(1, 10);
    const x = getRandomNumber(-10, 15); // Allow negative solutions
    
    if (useAddition) {
      // ax + b = c
      const c = a * x + b;
      return { question: `${a}x + ${b} = ${c}`, answer: x };
    } else {
      // ax - b = c
      const c = a * x - b;
      return { question: `${a}x - ${b} = ${c}`, answer: x };
    }
  }
};

const generateFractionQuestion = (difficulty: Difficulty): { question: string; answer: number; fractionAnswer: string } => {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[getRandomNumber(0, operations.length - 1)];
  
  let fraction1: Fraction;
  let fraction2: Fraction;
  let result: Fraction;
  let questionText: string;
  
  if (difficulty === 'easy') {
    // Use proper fractions and simpler operations
    fraction1 = generateProperFraction();
    fraction2 = generateProperFraction();
  } else {
    // Use mixed numbers and improper fractions
    if (Math.random() < 0.3) {
      fraction1 = generateImproperFraction();
      fraction2 = generateProperFraction();
    } else {
      fraction1 = generateRandomFraction('medium', true);
      fraction2 = generateRandomFraction('medium', true);
    }
  }
  
  switch (operation) {
    case 'addition':
      result = fraction1.add(fraction2);
      questionText = `${toMixedNumber(fraction1)} + ${toMixedNumber(fraction2)}`;
      break;
    case 'subtraction':
      // Ensure positive result by making first fraction larger if needed
      if (fraction1.compare(fraction2) < 0) {
        [fraction1, fraction2] = [fraction2, fraction1];
      }
      result = fraction1.sub(fraction2);
      questionText = `${toMixedNumber(fraction1)} - ${toMixedNumber(fraction2)}`;
      break;
    case 'multiplication':
      result = fraction1.mul(fraction2);
      questionText = `${toMixedNumber(fraction1)} × ${toMixedNumber(fraction2)}`;
      break;
    case 'division':
      // Avoid division by zero and ensure reasonable results
      if (fraction2.compare(0) === 0) {
        fraction2 = new Fraction(1, 2);
      }
      result = fraction1.div(fraction2);
      questionText = `${toMixedNumber(fraction1)} ÷ ${toMixedNumber(fraction2)}`;
      break;
    default:
      // Fallback to addition
      result = fraction1.add(fraction2);
      questionText = `${toMixedNumber(fraction1)} + ${toMixedNumber(fraction2)}`;
  }
  
  return {
    question: questionText,
    answer: Number(result.valueOf()), // Convert to decimal for compatibility
    fractionAnswer: toMixedNumber(result)
  };
};

const generateQuestionByOperation = (operation: MathOperation, difficulty: Difficulty): { 
  question: string; 
  answer: number; 
  fractionAnswer?: string;
} => {
  switch (operation) {
    case 'addition':
      return generateAdditionQuestion(difficulty);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty);
    case 'multiplication':
      return generateMultiplicationQuestion(difficulty);
    case 'division':
      return generateDivisionQuestion(difficulty);
    case 'algebraic':
      return generateAlgebraicQuestion(difficulty);
    case 'fractions':
      return generateFractionQuestion(difficulty);
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
  operations: MathOperation[], // Changed to accept array of operations
  questionType: QuestionType
): Question[] => {
  const questions: Question[] = [];
  
  // If no operations selected, default to addition
  const selectedOperations = operations.length > 0 ? operations : ['addition'];
  
  for (let i = 0; i < count; i++) {
    // Randomly select one of the chosen operations for each question
    const randomOperation = selectedOperations[getRandomNumber(0, selectedOperations.length - 1)] as MathOperation;
    const result = generateQuestionByOperation(randomOperation, difficulty);
    const id = `question-${i + 1}`;
    
    const questionObj: Question = {
      id,
      question: result.question,
      answer: result.answer,
    };
    
    // For fraction questions, add fraction-specific properties
    if (randomOperation === 'fractions' && result.fractionAnswer) {
      questionObj.fractionAnswer = result.fractionAnswer;
      
      if (questionType === 'multiple-choice') {
        // Parse the fraction answer for generating options
        const fractionResult = new Fraction(result.fractionAnswer);
        questionObj.fractionOptions = generateFractionOptions(fractionResult, 3);
      }
    }
    
    // For algebraic questions, add variable and equation info
    if (randomOperation === 'algebraic' || result.question.includes('x')) {
      questionObj.variable = 'x';
      questionObj.equation = result.question;
    }
    
    // For non-fraction multiple choice questions
    if (questionType === 'multiple-choice' && randomOperation !== 'fractions') {
      questionObj.options = generateMultipleChoiceOptions(result.answer, difficulty);
    }
    
    questions.push(questionObj);
  }
  
  return questions;
};
