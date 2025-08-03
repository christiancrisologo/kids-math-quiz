# Copilot Instructions for MathQuiz

## Project Overview
MathQuiz is a mathematics learning application designed to help users practice and improve their math skills through interactive quizzes. It is called **Math Quiz App** in Next.js with Tailwind CSS styles. The app is designed for kids to practice math operations (addition, subtraction, multiplication, division) in a fun and interactive way.


## Architecture Principles
- **Component-based design**: UI components should be modular and reusable
- **Question generation**: Math problems should be algorithmically generated with configurable difficulty
- **Progress tracking**: User performance and learning analytics are core features
- **Responsive design**: Application should work across desktop and mobile devices

## Development Guidelines

### Code Organization
- Place reusable math utilities in `/utils/math/` or similar
- Keep question generation logic separate from UI components
- Use TypeScript for type safety with mathematical operations
- Organize by feature (quiz, progress, settings) rather than file type

### Math Quiz Patterns
- **Question types**: Support multiple formats (multiple choice, fill-in-blank)
- **Difficulty scaling**: Implement progressive difficulty based on user performance
- **Answer validation**: Handle floating-point precision issues for decimal answers
- **Timer functionality**: Include configurable time limits per question or quiz

### Data Management
- **Local storage**: Use for offline practice and progress persistence
- **State management**: Centralize quiz state (current question, score, time remaining)
- **Performance analytics**: Track response times, accuracy rates, and learning patterns

### Testing Approach
- Unit test math generation functions for edge cases
- Test answer validation logic thoroughly (especially with decimals/fractions)
- Include accessibility testing for screen readers and keyboard navigation
- Performance test with large question sets

### UI/UX Considerations
- **Immediate feedback**: Provide instant visual feedback for correct/incorrect answers
- **Progress indicators**: Show completion status and performance metrics
- **Error prevention**: Validate user inputs and provide helpful error messages
- **Mobile-first**: Design touch-friendly interfaces for mathematical input


## Integration Points
- **Math libraries**: Consider MathJax or KaTeX for equation rendering
- **Analytics**: Integrate learning analytics for educational insights
- **Authentication**: Plan for user accounts and progress synchronization
- **Accessibility**: Ensure WCAG compliance for educational applications

## Common Patterns
- Use consistent number formatting and precision handling
- Implement debounced input validation for mathematical expressions
- Create reusable components for common question types
- Maintain consistent scoring and feedback mechanisms

### Git Workflow
- Create branch `<feature-number>/<feature-name>`
- Implement in phases with regular commits
- Test on multiple devices before merge
- Fetch the latest changes from the main branch before starting work
- Rebase the branch with the main branch and fix conflicts
- Create pull request with mobile screenshots/videos
- Deploy to staging for comprehensive mobile testing


---

## Future feature iterations
- Admin page to manage users, questions, and results
- Add support for **fractions** and **decimals**.
- Implement **progress tracking** for each user.
- Allow users to **review past quizzes** and see performance over time.
- Add **leaderboards** to compare performance with other users.
- Include **educational resources** (e.g., tips, explanations) for incorrect answers.


---

**End of prompt_instruction.md**
