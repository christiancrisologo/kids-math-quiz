// Currency utility functions for math operations
// Using proper decimal precision to avoid floating point issues

export interface CurrencyResult {
  question: string;
  answer: number;
  displayAnswer: string; // Formatted as currency (e.g., "$3.50")
}

// Convert dollars to cents for precise calculations
const toCents = (dollars: number): number => Math.round(dollars * 100);

// Convert cents to dollars
const toDollars = (cents: number): number => cents / 100;

// Format number as currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Parse currency string to number
export const parseCurrency = (currencyStr: string): number => {
  return parseFloat(currencyStr.replace('$', '')) || 0;
};

// Generate random currency amount
const getRandomCurrency = (min: number, max: number): number => {
  // Generate in cents then convert to dollars for precision
  const minCents = Math.round(min * 100);
  const maxCents = Math.round(max * 100);
  const randomCents = Math.floor(Math.random() * (maxCents - minCents + 1)) + minCents;
  return toDollars(randomCents);
};

// Generate currency addition question
export const generateCurrencyAddition = (difficulty: 'easy' | 'hard'): CurrencyResult => {
  const maxAmount = difficulty === 'easy' ? 10 : 50;
  const amount1 = getRandomCurrency(0.25, maxAmount);
  const amount2 = getRandomCurrency(0.25, maxAmount);
  
  // Calculate in cents to avoid floating point issues
  const resultCents = toCents(amount1) + toCents(amount2);
  const result = toDollars(resultCents);
  
  return {
    question: `${formatCurrency(amount1)} + ${formatCurrency(amount2)}`,
    answer: result,
    displayAnswer: formatCurrency(result)
  };
};

// Generate currency subtraction question
export const generateCurrencySubtraction = (difficulty: 'easy' | 'hard'): CurrencyResult => {
  const maxAmount = difficulty === 'easy' ? 10 : 50;
  const amount1 = getRandomCurrency(1, maxAmount);
  const amount2 = getRandomCurrency(0.25, amount1); // Ensure positive result
  
  // Calculate in cents to avoid floating point issues
  const resultCents = toCents(amount1) - toCents(amount2);
  const result = toDollars(resultCents);
  
  return {
    question: `${formatCurrency(amount1)} - ${formatCurrency(amount2)}`,
    answer: result,
    displayAnswer: formatCurrency(result)
  };
};

// Generate currency multiplication question
export const generateCurrencyMultiplication = (difficulty: 'easy' | 'hard'): CurrencyResult => {
  const maxAmount = difficulty === 'easy' ? 5 : 15;
  const maxMultiplier = difficulty === 'easy' ? 5 : 10;
  
  const amount = getRandomCurrency(0.25, maxAmount);
  const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
  
  // Calculate in cents to avoid floating point issues
  const resultCents = toCents(amount) * multiplier;
  const result = toDollars(resultCents);
  
  return {
    question: `${formatCurrency(amount)} × ${multiplier}`,
    answer: result,
    displayAnswer: formatCurrency(result)
  };
};

// Generate currency division question
export const generateCurrencyDivision = (difficulty: 'easy' | 'hard'): CurrencyResult => {
  const maxDivisor = difficulty === 'easy' ? 5 : 10;
  const divisor = Math.floor(Math.random() * maxDivisor) + 2;
  
  // Generate a dividend that's divisible by the divisor
  const quotientMax = difficulty === 'easy' ? 5 : 15;
  const quotient = getRandomCurrency(0.25, quotientMax);
  
  // Calculate dividend in cents to ensure exact division
  const quotientCents = toCents(quotient);
  const dividendCents = quotientCents * divisor;
  const dividend = toDollars(dividendCents);
  
  return {
    question: `${formatCurrency(dividend)} ÷ ${divisor}`,
    answer: quotient,
    displayAnswer: formatCurrency(quotient)
  };
};

// Generate multiple choice options for currency
export const generateCurrencyOptions = (correctAnswer: number): number[] => {
  const options = [correctAnswer];
  
  while (options.length < 2) { // Only 2 options as per requirements
    // Generate variations within ±50% of correct answer
    const variation = (Math.random() - 0.5) * correctAnswer;
    const option = Math.max(0.01, correctAnswer + variation);
    
    // Round to nearest cent
    const roundedOption = Math.round(option * 100) / 100;
    
    // Only add if it's different from existing options
    if (!options.some(opt => Math.abs(opt - roundedOption) < 0.01)) {
      options.push(roundedOption);
    }
  }
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
};
