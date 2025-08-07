// Time utility functions for math operations
// Working with time in minutes:seconds and hours:minutes format

export interface TimeResult {
  question: string;
  answer: number; // Total seconds for internal calculation
  displayAnswer: string; // Formatted as time (e.g., "2:30")
}

// Convert time string (MM:SS or HH:MM) to total seconds
export const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS format
  }
  return 0;
};

// Convert seconds to MM:SS format
export const secondsToTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Convert time string (HH:MM) to total minutes
export const timeToMinutes = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // HH:MM format
  }
  return 0;
};

// Convert minutes to HH:MM format
export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

// Generate random time in MM:SS format
const getRandomTimeSeconds = (minMinutes: number, maxMinutes: number): { timeStr: string; seconds: number } => {
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  const seconds = Math.floor(Math.random() * 60);
  const totalSeconds = minutes * 60 + seconds;
  return {
    timeStr: secondsToTime(totalSeconds),
    seconds: totalSeconds
  };
};

// Generate random time in HH:MM format
const getRandomTimeMinutes = (minHours: number, maxHours: number): { timeStr: string; minutes: number } => {
  const hours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
  const minutes = Math.floor(Math.random() * 60);
  const totalMinutes = hours * 60 + minutes;
  return {
    timeStr: minutesToTime(totalMinutes),
    minutes: totalMinutes
  };
};

// Generate time addition question (MM:SS format)
export const generateTimeAddition = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxMinutes = difficulty === 'easy' ? 5 : 15;
  
  const time1 = getRandomTimeSeconds(1, maxMinutes);
  const time2 = getRandomTimeSeconds(1, maxMinutes);
  
  const resultSeconds = time1.seconds + time2.seconds;
  
  return {
    question: `${time1.timeStr} + ${time2.timeStr}`,
    answer: resultSeconds,
    displayAnswer: secondsToTime(resultSeconds)
  };
};

// Generate time subtraction question (MM:SS format)
export const generateTimeSubtraction = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxMinutes = difficulty === 'easy' ? 5 : 15;
  
  const time1 = getRandomTimeSeconds(2, maxMinutes);
  const time2 = getRandomTimeSeconds(1, Math.floor(time1.seconds / 60)); // Ensure positive result
  
  const resultSeconds = time1.seconds - time2.seconds;
  
  return {
    question: `${time1.timeStr} - ${time2.timeStr}`,
    answer: Math.max(0, resultSeconds),
    displayAnswer: secondsToTime(Math.max(0, resultSeconds))
  };
};

// Generate time multiplication question (MM:SS × number)
export const generateTimeMultiplication = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxMinutes = difficulty === 'easy' ? 3 : 8;
  const maxMultiplier = difficulty === 'easy' ? 3 : 6;
  
  const time = getRandomTimeSeconds(0, maxMinutes);
  const multiplier = Math.floor(Math.random() * maxMultiplier) + 2;
  
  const resultSeconds = time.seconds * multiplier;
  
  return {
    question: `${time.timeStr} × ${multiplier}`,
    answer: resultSeconds,
    displayAnswer: secondsToTime(resultSeconds)
  };
};

// Generate time division question (MM:SS ÷ number)
export const generateTimeDivision = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxDivisor = difficulty === 'easy' ? 3 : 6;
  const divisor = Math.floor(Math.random() * maxDivisor) + 2;
  
  // Generate a time that's divisible by the divisor (in seconds)
  const quotientMinutes = difficulty === 'easy' ? 2 : 6;
  const quotient = getRandomTimeSeconds(1, quotientMinutes);
  
  // Ensure the dividend is divisible by the divisor
  const dividendSeconds = quotient.seconds * divisor;
  
  return {
    question: `${secondsToTime(dividendSeconds)} ÷ ${divisor}`,
    answer: quotient.seconds,
    displayAnswer: quotient.timeStr
  };
};

// Generate time addition for hours (HH:MM format)
export const generateTimeAdditionHours = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxHours = difficulty === 'easy' ? 3 : 8;
  
  const time1 = getRandomTimeMinutes(1, maxHours);
  const time2 = getRandomTimeMinutes(1, maxHours);
  
  const resultMinutes = time1.minutes + time2.minutes;
  
  return {
    question: `${time1.timeStr} + ${time2.timeStr}`,
    answer: resultMinutes * 60, // Convert to seconds for consistency
    displayAnswer: minutesToTime(resultMinutes)
  };
};

// Generate time subtraction for hours (HH:MM format)
export const generateTimeSubtractionHours = (difficulty: 'easy' | 'hard'): TimeResult => {
  const maxHours = difficulty === 'easy' ? 3 : 8;
  
  const time1 = getRandomTimeMinutes(2, maxHours);
  const time2 = getRandomTimeMinutes(1, Math.floor(time1.minutes / 60)); // Ensure positive result
  
  const resultMinutes = time1.minutes - time2.minutes;
  
  return {
    question: `${time1.timeStr} - ${time2.timeStr}`,
    answer: Math.max(0, resultMinutes) * 60, // Convert to seconds for consistency
    displayAnswer: minutesToTime(Math.max(0, resultMinutes))
  };
};

// Generate multiple choice options for time
export const generateTimeOptions = (correctAnswer: number): number[] => {
  const options = [correctAnswer];
  
  while (options.length < 2) { // Only 2 options as per requirements
    // Generate variations by adding/subtracting time
    const variation = Math.floor(Math.random() * 300) + 30; // 30-330 seconds variation
    const direction = Math.random() > 0.5 ? 1 : -1;
    const option = Math.max(0, correctAnswer + (variation * direction));
    
    // Only add if it's different from existing options
    if (!options.includes(option)) {
      options.push(option);
    }
  }
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
};
