import { Difficulty, MathOperation, Question, QuestionType, NumberType } from '../../store/quiz-store';
import Fraction from 'fraction.js';
import { 
  generateRandomFraction, 
  generateProperFraction, 
  generateImproperFraction,
  toMixedNumber,
  generateFractionOptions
} from './fraction-utils';
import {
  generateCurrencyAddition,
  generateCurrencySubtraction,
  generateCurrencyMultiplication,
  generateCurrencyDivision,
  generateCurrencyOptions,
  formatCurrency
} from './currency-utils';
import {
  generateTimeAddition,
  generateTimeSubtraction,
  generateTimeMultiplication,
  generateTimeDivision,
  generateTimeAdditionHours,
  generateTimeSubtractionHours,
  generateTimeOptions,
  secondsToTime,
  minutesToTime
} from './time-utils';

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
    default:
      return generateAdditionQuestion(difficulty);
  }
};

const generateMultipleChoiceOptions = (correctAnswer: number, difficulty: Difficulty): number[] => {
  const options = [correctAnswer];
  const range = difficulty === 'easy' ? 10 : 50;
  
  // Generate only 2 options total (1 correct + 1 incorrect) as per requirements
  while (options.length < 2) {
    const offset = getRandomNumber(-range, range);
    const option = Math.max(0, correctAnswer + offset);
    
    if (!options.includes(option)) {
      options.push(option);
    }
  }
  
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
};

// Decimal question generators
const generateDecimalAdditionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 10 : 50;
  const decimalPlaces = difficulty === 'easy' ? 1 : 2;
  
  const a = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const b = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const answer = parseFloat((a + b).toFixed(decimalPlaces));
  
  return {
    question: `${a} + ${b}`,
    answer: answer,
  };
};

const generateDecimalSubtractionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 10 : 50;
  const decimalPlaces = difficulty === 'easy' ? 1 : 2;
  
  const a = parseFloat((Math.random() * max + 5).toFixed(decimalPlaces));
  const b = parseFloat((Math.random() * (a - 1) + 0.1).toFixed(decimalPlaces));
  const answer = parseFloat((a - b).toFixed(decimalPlaces));
  
  return {
    question: `${a} - ${b}`,
    answer: answer,
  };
};

const generateDecimalMultiplicationQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 5 : 10;
  const decimalPlaces = difficulty === 'easy' ? 1 : 2;
  
  const a = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const b = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const answer = parseFloat((a * b).toFixed(decimalPlaces * 2));
  
  return {
    question: `${a} × ${b}`,
    answer: answer,
  };
};

const generateDecimalDivisionQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const max = difficulty === 'easy' ? 5 : 10;
  const decimalPlaces = difficulty === 'easy' ? 1 : 2;
  
  const divisor = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const quotient = parseFloat((Math.random() * max + 1).toFixed(decimalPlaces));
  const dividend = parseFloat((divisor * quotient).toFixed(decimalPlaces * 2));
  
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: quotient,
  };
};

const generateDecimalAlgebraicQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const decimalPlaces = difficulty === 'easy' ? 1 : 2;
  
  if (difficulty === 'easy') {
    // Simple decimal equations: x + a = b
    const a = parseFloat((Math.random() * 10 + 1).toFixed(decimalPlaces));
    const x = parseFloat((Math.random() * 10 + 1).toFixed(decimalPlaces));
    const b = parseFloat((x + a).toFixed(decimalPlaces));
    
    return { 
      question: `x + ${a} = ${b}`, 
      answer: x 
    };
  } else {
    // More complex decimal equations: ax + b = c
    const a = parseFloat((Math.random() * 5 + 1).toFixed(decimalPlaces));
    const b = parseFloat((Math.random() * 10 + 1).toFixed(decimalPlaces));
    const x = parseFloat((Math.random() * 10 + 1).toFixed(decimalPlaces));
    const c = parseFloat((a * x + b).toFixed(decimalPlaces * 2));
    
    return { 
      question: `${a}x + ${b} = ${c}`, 
      answer: x 
    };
  }
};

// New function to generate decimal questions
const generateDecimalQuestionByOperation = (operation: MathOperation, difficulty: Difficulty): {
  question: string;
  answer: number;
} => {
  switch (operation) {
    case 'addition':
      return generateDecimalAdditionQuestion(difficulty);
    case 'subtraction':
      return generateDecimalSubtractionQuestion(difficulty);
    case 'multiplication':
      return generateDecimalMultiplicationQuestion(difficulty);
    case 'division':
      return generateDecimalDivisionQuestion(difficulty);
    case 'algebraic':
      return generateDecimalAlgebraicQuestion(difficulty);
    default:
      return generateDecimalAdditionQuestion(difficulty);
  }
};

// Currency question generators
const generateCurrencyQuestionByOperation = (operation: MathOperation, difficulty: Difficulty): {
  question: string;
  answer: number;
  displayAnswer?: string;
} => {
  // Currency doesn't support algebraic expressions as per requirements
  if (operation === 'algebraic') {
    operation = 'addition'; // Fallback to addition
  }

  switch (operation) {
    case 'addition':
      const addResult = generateCurrencyAddition(difficulty);
      return {
        question: addResult.question,
        answer: addResult.answer,
        displayAnswer: addResult.displayAnswer
      };
    case 'subtraction':
      const subResult = generateCurrencySubtraction(difficulty);
      return {
        question: subResult.question,
        answer: subResult.answer,
        displayAnswer: subResult.displayAnswer
      };
    case 'multiplication':
      const mulResult = generateCurrencyMultiplication(difficulty);
      return {
        question: mulResult.question,
        answer: mulResult.answer,
        displayAnswer: mulResult.displayAnswer
      };
    case 'division':
      const divResult = generateCurrencyDivision(difficulty);
      return {
        question: divResult.question,
        answer: divResult.answer,
        displayAnswer: divResult.displayAnswer
      };
    default:
      const defaultResult = generateCurrencyAddition(difficulty);
      return {
        question: defaultResult.question,
        answer: defaultResult.answer,
        displayAnswer: defaultResult.displayAnswer
      };
  }
};

// Time question generators
const generateTimeQuestionByOperation = (operation: MathOperation, difficulty: Difficulty): {
  question: string;
  answer: number;
  displayAnswer?: string;
} => {
  // Time doesn't support algebraic expressions as per requirements
  if (operation === 'algebraic') {
    operation = 'addition'; // Fallback to addition
  }

  // Randomly choose between seconds (MM:SS) and hours (HH:MM) format
  const useHourFormat = Math.random() > 0.6; // 40% chance for hour format

  switch (operation) {
    case 'addition':
      if (useHourFormat) {
        const result = generateTimeAdditionHours(difficulty);
        return {
          question: result.question,
          answer: result.answer,
          displayAnswer: result.displayAnswer
        };
      } else {
        const result = generateTimeAddition(difficulty);
        return {
          question: result.question,
          answer: result.answer,
          displayAnswer: result.displayAnswer
        };
      }
    case 'subtraction':
      if (useHourFormat) {
        const result = generateTimeSubtractionHours(difficulty);
        return {
          question: result.question,
          answer: result.answer,
          displayAnswer: result.displayAnswer
        };
      } else {
        const result = generateTimeSubtraction(difficulty);
        return {
          question: result.question,
          answer: result.answer,
          displayAnswer: result.displayAnswer
        };
      }
    case 'multiplication':
      const mulResult = generateTimeMultiplication(difficulty);
      return {
        question: mulResult.question,
        answer: mulResult.answer,
        displayAnswer: mulResult.displayAnswer
      };
    case 'division':
      const divResult = generateTimeDivision(difficulty);
      return {
        question: divResult.question,
        answer: divResult.answer,
        displayAnswer: divResult.displayAnswer
      };
    default:
      const defaultResult = generateTimeAddition(difficulty);
      return {
        question: defaultResult.question,
        answer: defaultResult.answer,
        displayAnswer: defaultResult.displayAnswer
      };
  }
};

// Main function to generate questions based on operation and number type
const generateQuestionByOperationAndNumberType = (
  operation: MathOperation, 
  difficulty: Difficulty, 
  numberType: NumberType
): { 
  question: string; 
  answer: number; 
  fractionAnswer?: string;
  displayAnswer?: string; // For currency and time formatting
} => {
  // For fraction number type, use fraction-specific questions
  if (numberType === 'fractions') {
    return generateFractionQuestion(difficulty);
  }
  
  // For decimals, modify the basic operation questions to use decimals
  if (numberType === 'decimals') {
    return generateDecimalQuestionByOperation(operation, difficulty);
  }
  
  // For currency, use currency-specific questions
  if (numberType === 'currency') {
    return generateCurrencyQuestionByOperation(operation, difficulty);
  }
  
  // For time, use time-specific questions
  if (numberType === 'time') {
    return generateTimeQuestionByOperation(operation, difficulty);
  }
  
  // For integers, use the standard integer questions
  return generateQuestionByOperation(operation, difficulty);
};

export const generateQuestions = (
  count: number,
  difficulty: Difficulty,
  operations: MathOperation[], // Changed to accept array of operations
  questionType: QuestionType,
  numberTypes: NumberType[] // New parameter for number types
): Question[] => {
  const questions: Question[] = [];
  
  // If no operations selected, default to addition
  const selectedOperations = operations.length > 0 ? operations : ['addition'];
  
  // If no number types selected, default to integers
  const selectedNumberTypes = numberTypes.length > 0 ? numberTypes : ['integers'];
  
  for (let i = 0; i < count; i++) {
    // Randomly select one of the chosen operations for each question
    const randomOperation = selectedOperations[getRandomNumber(0, selectedOperations.length - 1)] as MathOperation;
    
    // Randomly select one of the chosen number types for each question
    const randomNumberType = selectedNumberTypes[getRandomNumber(0, selectedNumberTypes.length - 1)] as NumberType;
    
    // Generate question based on operation and number type
    const result = generateQuestionByOperationAndNumberType(randomOperation, difficulty, randomNumberType);
    const id = `question-${i + 1}`;
    
    const questionObj: Question = {
      id,
      question: result.question,
      answer: result.answer,
    };
    
    // For fraction questions, add fraction-specific properties
    if (randomNumberType === 'fractions' && result.fractionAnswer) {
      questionObj.fractionAnswer = result.fractionAnswer;
      
      if (questionType === 'multiple-choice') {
        // Parse the fraction answer for generating options (only 2 options now)
        const fractionResult = new Fraction(result.fractionAnswer);
        questionObj.fractionOptions = generateFractionOptions(fractionResult, 2);
      }
    }
    
    // For currency questions, add currency-specific properties
    if (randomNumberType === 'currency' && result.displayAnswer) {
      if (questionType === 'multiple-choice') {
        // Generate currency options
        const currencyOptions = generateCurrencyOptions(result.answer);
        questionObj.options = currencyOptions;
        // Store display format for the options
        questionObj.currencyOptions = currencyOptions.map(option => formatCurrency(option));
      }
    }
    
    // For time questions, add time-specific properties
    if (randomNumberType === 'time' && result.displayAnswer) {
      if (questionType === 'multiple-choice') {
        // Generate time options
        const timeOptions = generateTimeOptions(result.answer);
        questionObj.options = timeOptions;
        // Store display format for the options
        questionObj.timeOptions = timeOptions.map(option => {
          // Check if it's hour format based on the answer magnitude
          const isHourFormat = result.answer > 3600; // More than 1 hour
          return isHourFormat ? minutesToTime(Math.floor(option / 60)) : secondsToTime(option);
        });
      }
    }
    
    // For algebraic questions, add variable and equation info
    if (randomOperation === 'algebraic' || result.question.includes('x')) {
      questionObj.variable = 'x';
      questionObj.equation = result.question;
    }
    
    // For regular multiple choice questions (integers and decimals)
    if (questionType === 'multiple-choice' && 
        randomNumberType !== 'fractions' && 
        randomNumberType !== 'currency' && 
        randomNumberType !== 'time') {
      questionObj.options = generateMultipleChoiceOptions(result.answer, difficulty);
    }
    
    questions.push(questionObj);
  }
  
  return questions;
};
