# Math Quiz for Kids

A fun and interactive mobile-optimized math quiz application designed for kids to practice addition, subtraction, multiplication, division, and algebraic expressions with one-handed navigation.

Checkout the [Live Demo](https://christiancrisologo.github.io/kids-math-quiz/)

## ✨ Features

### 🎯 **Core Features**
- **Mobile-First Design**: Optimized for touch devices with one-handed navigation
- **Interactive Math Practice**: Addition, subtraction, multiplication, division, and algebraic expressions
- **Customizable Difficulty**: Easy and Hard difficulty levels
- **Question Types**: Math expressions and multiple-choice questions
- **Timer System**: Configurable time limits per question
- **Progress Tracking**: Visual progress indicators and performance analytics

### 🌙 **Dark Mode Support**
- **Three-Theme System**: System, Light, and Dark modes
- **Automatic Detection**: Respects OS/browser dark mode preference
- **Persistent Settings**: Remembers user preference across sessions
- **Smooth Transitions**: 200ms animations between theme changes
- **Accessibility Compliant**: WCAG AA contrast ratios

### 🎨 **Kid-Friendly Design**
- **Colorful Gradients**: Engaging rainbow backgrounds
- **Fun Animations**: Float, bounce, shimmer, and rainbow effects
- **Interactive Elements**: Hover effects and visual feedback
- **Responsive Layout**: Works on all device sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/christiancrisologo/kids-math-quiz.git
cd kids-math-quiz

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS Variables
- **State Management**: Zustand
- **Theme System**: React Context with localStorage persistence
- **Mobile Optimization**: Touch-friendly components and gestures

## 📁 Project Structure

```
src/
├── app/                     # Next.js 15 App Router
│   ├── page.tsx            # Quiz setup page
│   ├── quiz/page.tsx       # Quiz gameplay page
│   ├── results/page.tsx    # Results and review page
│   └── layout.tsx          # Root layout with theme provider
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── MobileButton.tsx
│   │   ├── MobileTile.tsx
│   │   └── MobileInput.tsx
│   └── theme/              # Theme-related components
│       └── ThemeToggle.tsx
├── contexts/               # React contexts
│   └── theme-context.tsx   # Theme management
├── store/                  # State management
│   └── quiz-store.ts       # Quiz state with Zustand
├── styles/                 # Global styles
│   ├── globals.css
│   ├── mobile.css
│   └── themes.css          # Dark mode CSS variables
└── utils/                  # Utility functions
    ├── math/               # Math problem generation
    └── responsive.ts       # Mobile detection
```

## 🎮 How to Play

1. **Enter Your Name**: Start by entering your name on the setup page
2. **Configure Settings**: Choose difficulty, number of questions, timer, and math operations
3. **Switch Themes**: Use the theme toggle to switch between Light/Dark/System modes
4. **Start Quiz**: Begin your math adventure!
5. **Answer Questions**: Solve problems within the time limit
6. **Review Results**: See your score and review each question

## 🌙 Dark Mode Implementation

The app features a comprehensive dark mode system:

- **Theme Provider**: React Context-based theme management
- **CSS Variables**: Dynamic color system for instant updates
- **System Integration**: Automatic OS preference detection
- **Persistent Storage**: Saves theme preference to localStorage
- **Mobile Optimized**: Dynamic meta theme-color updates

See [DARK_MODE_IMPLEMENTATION.md](./DARK_MODE_IMPLEMENTATION.md) for detailed technical documentation.

## 📱 Mobile Features

- **Touch Optimized**: 44px minimum touch targets
- **One-Handed Navigation**: Bottom-heavy UI layout
- **Responsive Design**: Adapts to all screen sizes
- **PWA Ready**: Mobile web app capabilities
- **Performance Optimized**: Fast loading on mobile networks

## 🧮 Math Operations

### Basic Operations
- **Addition**: Simple to complex addition problems
- **Subtraction**: Basic subtraction with positive results
- **Multiplication**: Times tables and multiplication practice
- **Division**: Division with whole number results

### Advanced Features
- **Algebraic Expressions**: Solve for x problems
- **Mixed Operations**: Random combination of all operations
- **Difficulty Scaling**: Easy and hard problem variants

## 🎯 Performance & Accessibility

- **WCAG AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and announcements
- **Reduced Motion**: Respects user motion preferences
- **Fast Loading**: Optimized for mobile networks

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Mobile-first responsive design

## 📖 Documentation

- [Feature Implementation Guide](./.github/prompts/feature-03-dark-mode.md)
- [Dark Mode Technical Documentation](./DARK_MODE_IMPLEMENTATION.md)
- [Copilot Instructions](./.github/instructions/copilot-instructions.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Fonts by [Vercel](https://vercel.com/font)
- Icons and emojis for kid-friendly design
