---
feature: algebraic-expressions
priority: medium
status: planned
---

# Feature 01: Algebraic Expressions

## Overview
Add support for algebraic expressions as a new math operation type in the MathQuiz app. This will introduce variable-based problems where students solve for unknowns (x, y) in simple algebraic equations.

## User Story
**As a** student using the math quiz app  
**I want to** practice solving algebraic expressions  
**So that** I can improve my algebra skills alongside basic arithmetic  

## Current State Analysis
- **Current Math Operations**: Addition, Subtraction, Multiplication, Division, Mixed
- **Current Question Types**: Expression input, Multiple choice
- **Current Architecture**: Zustand store with `MathOperation` enum, question generator utilities

## Feature Requirements

### 1. New Math Operation Type
- Add `'algebraic'` to the `MathOperation` type in `src/store/quiz-store.ts`
- Update the setup page UI to include "🔢 Algebraic Expressions" option
- Maintain backward compatibility with existing operations

### 2. Algebraic Question Generation
- **Location**: `src/utils/math/question-generator.ts`
- **New Function**: `generateAlgebraicQuestion(difficulty: Difficulty)`
- **Question Types**:
  - Simple linear equations: `x + 5 = 12` (solve for x)
  - Basic substitution: `2x = 14` (solve for x) 
  - Simple two-step: `3x - 4 = 11` (solve for x)
  - Mixed variable problems: `x + y = 10, x = 6` (solve for y)

### 3. Difficulty Scaling
- **Easy Mode**:
  - Single-step equations: `x + a = b`, `x - a = b`, `ax = b`
  - Variables range: 1-20
  - Positive integer solutions only
  - Examples: `x + 3 = 8`, `2x = 10`, `x - 4 = 7`

- **Hard Mode**:
  - Multi-step equations: `ax + b = c`, `ax - b = c`
  - Variables range: 1-50
  - Include negative solutions
  - Examples: `3x + 5 = 23`, `4x - 7 = 17`, `2x + 8 = 4`

### 4. Question Format Examples
```typescript
// Easy examples
{ question: "x + 7 = 15", answer: 8 }
{ question: "3x = 21", answer: 7 }
{ question: "x - 5 = 9", answer: 14 }

// Hard examples  
{ question: "2x + 3 = 19", answer: 8 }
{ question: "4x - 6 = 18", answer: 6 }
{ question: "5x + 7 = 2", answer: -1 }
```

### 5. UI/UX Considerations
- **Question Display**: Use clear algebra notation (e.g., "Solve for x:")
- **Input Validation**: Accept negative numbers and decimal solutions
- **Answer Format**: Display "x = [answer]" in results
- **MathJax Integration**: Consider using MathJax for better equation rendering

## Technical Implementation

### 1. Type System Updates
```typescript
// In src/store/quiz-store.ts
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'algebraic';

// Enhanced Question interface (optional)
export interface Question {
  id: string;
  question: string;
  answer: number;
  variable?: string; // e.g., "x", "y" for algebraic questions
  equation?: string; // Original equation for display
  userAnswer?: number;
  isCorrect?: boolean;
  options?: number[];
  timeSpent?: number;
}
```

### 2. Question Generation Algorithm
```typescript
const generateAlgebraicQuestion = (difficulty: Difficulty): { question: string; answer: number } => {
  const operations = ['addition', 'subtraction', 'multiplication'];
  const operation = operations[getRandomNumber(0, operations.length - 1)];
  
  if (difficulty === 'easy') {
    // Single-step equations
    switch (operation) {
      case 'addition': // x + a = b
        const a = getRandomNumber(1, 20);
        const x = getRandomNumber(1, 20);
        return { question: `x + ${a} = ${x + a}`, answer: x };
      // ... other cases
    }
  } else {
    // Multi-step equations: ax + b = c
    const a = getRandomNumber(2, 5);
    const b = getRandomNumber(1, 10);
    const x = getRandomNumber(1, 15);
    const c = a * x + b;
    return { question: `${a}x + ${b} = ${c}`, answer: x };
  }
};
```

### 3. Multiple Choice Generation
- Generate plausible incorrect answers by:
  - Adding/subtracting 1-3 from correct answer
  - Using common algebraic mistakes (forgetting to divide by coefficient)
  - Including both positive and negative distractors

### 4. Setup Page Integration
```typescript
// Add to operation selection in src/app/page.tsx
{ value: 'algebraic', label: '🔢 Algebraic Expressions' }
```

## Acceptance Criteria

### ✅ Definition of Done
- [ ] `MathOperation` type includes 'algebraic' option
- [ ] Setup page displays algebraic expressions option
- [ ] Question generator creates valid algebraic equations
- [ ] Easy mode: single-step equations with positive solutions
- [ ] Hard mode: multi-step equations with positive/negative solutions
- [ ] Multiple choice mode generates plausible distractors
- [ ] Answer validation works for negative numbers
- [ ] Results page displays equations correctly
- [ ] All existing functionality remains unchanged
- [ ] No TypeScript errors or warnings

### 🧪 Testing Scenarios
1. **Easy Algebraic Quiz**: Generate 5 easy algebraic questions, verify all are single-step
2. **Hard Algebraic Quiz**: Generate 5 hard questions, verify multi-step complexity
3. **Mixed with Algebraic**: Test 'mixed' mode includes algebraic questions
4. **Negative Answers**: Verify hard mode can generate negative solutions
5. **Multiple Choice**: Test algebraic questions in multiple choice format
6. **Edge Cases**: Test with minimum/maximum difficulty ranges

## Future Enhancements
- **Quadratic equations**: `x² + bx + c = 0`
- **Systems of equations**: Two variables, two equations
- **Fraction coefficients**: `(1/2)x + 3 = 7`
- **Word problems**: "John has x apples. After buying 5 more..."
- **Graphing support**: Visual representation of linear equations

## Implementation Notes
- Maintain the existing question generation pattern
- Use consistent variable names (prefer 'x' for single-variable)
- Ensure all generated equations have integer solutions for easy mode
- Consider adding equation validation to prevent divide-by-zero scenarios
- Follow existing error handling patterns for invalid inputs

---
**Estimated Effort**: 2-3 hours  
**Dependencies**: None (extends existing architecture)  
**Risk Level**: Low (additive feature, no breaking changes)

---

### Git preperations
if the feature has no more errors
- Create a branch `feature/01-algebraic-expressions`
- Commit often with descriptive messages
- Create a pull request when ready for review
