---
mode: agent
---

## Goal: Create the MathQuiz App with nextJS + tailwind + typescript + mathjax

### Task 1: Landing / Setup Page

- Create the first page of the app, where the user will:

- Enter their **username**.
- Choose **difficulty**:
  - Easy
  - Hard
- Select the **number of questions per quiz run** (minimum 5 questions).
- Set a **timer** per question (default 10 seconds, but allow customization).
- Choose **question type**:
  - Math expression (e.g., 4 + 3 = ?)
  - Math problem with multiple choices (3 choices)
- Select the **math operation**:
  - Addition
  - Subtraction
  - Multiplication
  - Division
  - Mix of the 4 types

**UI Requirements:**
- Use Tailwind for styling inputs, buttons, and layout.
- Provide a “Start Quiz” button that routes to the quiz page with the configured options stored in a state management solution (recommend using React Context or Zustand).

---

### Task 2: Quiz Page

- Build the quiz mechanics on a second page.  

- The page will:
  - Show the current question
  - Present either:
    - an input box for answering a math expression
    - or 3 multiple-choice options
  - Show the running timer for each question
  - Move automatically to the next question after:
    - the user submits the answer
    - or the timer runs out
  - Record the answer for later assessment

**Recommendations:**
- Store current question index, answer history, and timer state in local React state or global store.
- Use `useEffect` to handle the countdown timer.
- Ensure a smooth transition to the next question after submission.

---

### Task 3: Assessment / Result Page

- Create a final page that:

- Shows a **summary** of answered questions
  - Indicate correct vs incorrect answers
  - Show the total score or grade
- Option to **retry** the quiz (restart with same settings)
- Option to **return to the setup page** to reconfigure

**Suggestions for grading:**
- Show number of correct answers
- Show percentage score
- Use encouraging messages (e.g., “Great job!” / “Try again!”)
- Use Tailwind to style the result page clearly and kid-friendly

---

### Other Implementation Notes

- Use **Next.js** routing (`pages/` directory) to handle navigation.
- For question generation, consider creating a utility function to randomly generate problems based on the selected difficulty and operation.
- Ensure accessibility (proper labels, focus handling).
- Keep the code modular (e.g., separate components for Question, Timer, Results, etc.).
- Keep UI fun and colorful for kids, but clean.

