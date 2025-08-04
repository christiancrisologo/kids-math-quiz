import Fraction from 'fraction.js';

/**
 * Utility functions for fraction operations in the math quiz
 */

export interface FractionQuestion {
  question: string;
  answer: Fraction;
  displayAnswer: string;
}

/**
 * Generate a random fraction with specified constraints
 */
export function generateRandomFraction(difficulty: 'easy' | 'medium' | 'hard', allowImproper = true): Fraction {
  const denominatorRange = difficulty === 'easy' ? [2, 8] : difficulty === 'medium' ? [2, 12] : [2, 20];
  
  const denominator = Math.floor(Math.random() * (denominatorRange[1] - denominatorRange[0] + 1)) + denominatorRange[0];
  
  if (allowImproper) {
    const numeratorMax = difficulty === 'easy' ? denominator * 2 : 
                        difficulty === 'medium' ? denominator * 3 : 
                        denominator * 4;
    const numerator = Math.floor(Math.random() * numeratorMax) + 1;
    return new Fraction(numerator, denominator);
  } else {
    // Generate proper fraction only
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    return new Fraction(numerator, denominator);
  }
}

/**
 * Generate a proper fraction (numerator < denominator)
 */
export const generateProperFraction = (
  maxDenominator: number = 10
): Fraction => {
  const denominator = Math.floor(Math.random() * maxDenominator) + 2;
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
  
  return new Fraction(numerator, denominator);
};

/**
 * Generate an improper fraction (numerator >= denominator)
 */
export const generateImproperFraction = (
  maxNumerator: number = 20,
  maxDenominator: number = 8
): Fraction => {
  const denominator = Math.floor(Math.random() * maxDenominator) + 2;
  const numerator = denominator + Math.floor(Math.random() * maxNumerator);
  
  return new Fraction(numerator, denominator);
};

/**
 * Convert fraction to mixed number string representation
 */
export const toMixedNumber = (fraction: Fraction): string => {
  const n = Number(fraction.n);
  const d = Number(fraction.d);
  
  if (d === 1) {
    return n.toString();
  }
  
  if (Math.abs(n) < d) {
    return `${n}/${d}`;
  }
  
  const whole = Math.floor(Math.abs(n) / d);
  const remainder = Math.abs(n) % d;
  const sign = n < 0 ? '-' : '';
  
  if (remainder === 0) {
    return `${sign}${whole}`;
  }
  
  return `${sign}${whole} ${remainder}/${d}`;
};

/**
 * Parse a fraction string (supports "3/4", "1 2/3", "5", etc.)
 */
export const parseFraction = (input: string): Fraction | null => {
  try {
    const trimmed = input.trim();
    
    // Handle whole numbers
    if (/^\d+$/.test(trimmed)) {
      return new Fraction(parseInt(trimmed));
    }
    
    // Handle simple fractions like "3/4"
    if (/^\d+\/\d+$/.test(trimmed)) {
      return new Fraction(trimmed);
    }
    
    // Handle mixed numbers like "1 2/3"
    const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1]);
      const numerator = parseInt(mixedMatch[2]);
      const denominator = parseInt(mixedMatch[3]);
      
      return new Fraction(whole).add(new Fraction(numerator, denominator));
    }
    
    // Handle negative mixed numbers like "-1 2/3"
    const negativeMixedMatch = trimmed.match(/^-(\d+)\s+(\d+)\/(\d+)$/);
    if (negativeMixedMatch) {
      const whole = parseInt(negativeMixedMatch[1]);
      const numerator = parseInt(negativeMixedMatch[2]);
      const denominator = parseInt(negativeMixedMatch[3]);
      
      return new Fraction(whole).add(new Fraction(numerator, denominator)).mul(-1);
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Generate multiple choice options for fraction questions
 */
export const generateFractionOptions = (
  correctAnswer: Fraction,
  count: number = 3
): string[] => {
  const options = new Set([toMixedNumber(correctAnswer)]);
  
  while (options.size < count) {
    // Generate similar but incorrect fractions
    const variation = Math.random();
    let wrongAnswer: Fraction;
    
    if (variation < 0.3) {
      // Add or subtract 1 from numerator
      const delta = Math.random() < 0.5 ? 1 : -1;
      const n = Number(correctAnswer.n);
      const d = Number(correctAnswer.d);
      wrongAnswer = new Fraction(n + delta, d);
    } else if (variation < 0.6) {
      // Add or subtract 1 from denominator
      const delta = Math.random() < 0.5 ? 1 : -1;
      const n = Number(correctAnswer.n);
      const d = Number(correctAnswer.d);
      wrongAnswer = new Fraction(n, Math.max(1, d + delta));
    } else {
      // Generate a completely different fraction
      wrongAnswer = generateRandomFraction('medium', true);
    }
    
    // Ensure the wrong answer is positive and different from correct answer
    if (wrongAnswer.compare(0) > 0 && !wrongAnswer.equals(correctAnswer)) {
      options.add(toMixedNumber(wrongAnswer));
    }
  }
  
  // Convert to array and shuffle
  return Array.from(options).sort(() => Math.random() - 0.5);
};

/**
 * Check if two fractions are equal (for answer validation)
 */
export const areFractionsEqual = (fraction1: string, fraction2: string): boolean => {
  const f1 = parseFraction(fraction1);
  const f2 = parseFraction(fraction2);
  
  if (!f1 || !f2) return false;
  
  return f1.equals(f2);
};

/**
 * Simplify a fraction and return its string representation
 */
export const simplifyFraction = (numerator: number, denominator: number): string => {
  const fraction = new Fraction(numerator, denominator);
  return toMixedNumber(fraction);
};
