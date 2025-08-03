# Feature 03: Dark Mode Implementation

## Overview
Implement a comprehensive dark mode feature for the MathQuiz app that provides a seamless, accessible, and visually appealing experience across all devices. The implementation should maintain the existing mobile-first responsive design while adding intelligent theme switching capabilities.

## Current State Analysis
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Current Theme**: Light mode with black text on white background
- **Mobile Support**: Fully responsive with touch-optimized components
- **Existing CSS Variables**: Basic light/dark theme variables already defined in globals.css

## Requirements

### 1. Theme System Architecture
- **Default State**: Light mode (current behavior)
- **Theme Persistence**: Remember user preference across sessions
- **System Integration**: Respect user's OS/browser dark mode preference
- **Fallback Strategy**: Graceful degradation if localStorage is unavailable

### 2. Theme Switching Mechanism
Implement a three-tier theme system:
1. **System** (default): Follow OS/browser preference
2. **Light**: Force light mode
3. **Dark**: Force dark mode

### 3. Visual Design Specifications

#### Light Mode (Default)
```css
Background: #ffffff (white)
Text: #171717 (near black)
Cards/Surfaces: #f8fafc (slate-50)
Borders: #e2e8f0 (slate-200)
Primary: #8B5CF6 (violet-500)
Success: #10b981 (emerald-500)
Error: #ef4444 (red-500)
Warning: #f59e0b (amber-500)
```

#### Dark Mode
```css
Background: #0f172a (slate-900)
Text: #f1f5f9 (slate-100)
Cards/Surfaces: #1e293b (slate-800)
Borders: #334155 (slate-600)
Primary: #a855f7 (violet-400)
Success: #34d399 (emerald-400)
Error: #f87171 (red-400)
Warning: #fbbf24 (amber-400)
```

### 4. Component Integration Requirements

#### Theme Toggle Component
Create a `ThemeToggle` component with:
- Three-state toggle (System/Light/Dark)
- Visual icons for each state
- Smooth transitions
- Mobile-optimized touch targets (44px minimum)
- Accessible keyboard navigation
- ARIA labels and screen reader support

#### Enhanced Mobile Components
Update existing mobile components:
- `MobileButton`: Dark mode color variants
- `MobileTile`: Dark surface styling
- `MobileInput`: Dark input field styling
- Form validation: Dark mode error states

### 5. Technical Implementation Strategy

#### Recommended Approach: CSS Variables + Tailwind + Context
This approach provides the best balance of performance, maintainability, and user experience:

1. **CSS Variables Foundation**
   ```css
   :root {
     --color-background: theme('colors.white');
     --color-foreground: theme('colors.slate.900');
     --color-surface: theme('colors.slate.50');
     --color-border: theme('colors.slate.200');
     --color-primary: theme('colors.violet.500');
   }
   
   [data-theme="dark"] {
     --color-background: theme('colors.slate.900');
     --color-foreground: theme('colors.slate.100');
     --color-surface: theme('colors.slate.800');
     --color-border: theme('colors.slate.600');
     --color-primary: theme('colors.violet.400');
   }
   ```

2. **Theme Context Provider**
   ```tsx
   interface ThemeContextType {
     theme: 'system' | 'light' | 'dark';
     resolvedTheme: 'light' | 'dark';
     setTheme: (theme: 'system' | 'light' | 'dark') => void;
   }
   ```

3. **HTML Data Attribute Strategy**
   ```tsx
   <html data-theme={resolvedTheme}>
   ```

#### Alternative Approaches Considered:

**Option A: Tailwind Dark Mode Classes**
- Pros: Native Tailwind support, type-safe
- Cons: Requires class duplication, larger bundle size
- Use case: Simple implementations

**Option B: CSS-in-JS Theme Provider**
- Pros: Dynamic theming, component isolation
- Cons: Runtime overhead, complexity
- Use case: Complex design systems

**Option C: Multiple CSS Files**
- Pros: Complete separation
- Cons: Maintenance overhead, loading complexity
- Use case: Drastically different themes

### 6. Implementation Requirements

#### File Structure
```
src/
├── contexts/
│   └── theme-context.tsx          # Theme provider and context
├── components/
│   ├── theme/
│   │   ├── ThemeToggle.tsx        # Theme switching component
│   │   └── ThemeProvider.tsx      # Provider wrapper
│   └── ui/
│       ├── MobileButton.tsx       # Updated with dark mode
│       ├── MobileTile.tsx         # Updated with dark mode
│       └── MobileInput.tsx        # Updated with dark mode
├── hooks/
│   └── useTheme.tsx               # Theme hook
├── styles/
│   ├── themes.css                 # Theme CSS variables
│   └── dark-mode.css              # Dark mode specific styles
└── utils/
    └── theme.ts                   # Theme utilities
```

#### Key Components to Create/Update:

1. **ThemeProvider** (`src/contexts/theme-context.tsx`)
   - System preference detection
   - LocalStorage persistence
   - Theme change handling
   - SSR compatibility

2. **ThemeToggle** (`src/components/theme/ThemeToggle.tsx`)
   - Three-state toggle UI
   - Icons: ☀️ (light), 🌙 (dark), 💻 (system)
   - Smooth animations
   - Mobile-optimized

3. **Updated Layout** (`src/app/layout.tsx`)
   - Theme provider integration
   - HTML data attribute management
   - No-flash-of-incorrect-theme (NOFOIT)

4. **Theme Styles** (`src/styles/themes.css`)
   - CSS custom properties
   - Color scheme definitions
   - Transition animations

#### Core Features:

1. **System Integration**
   ```typescript
   // Detect system preference
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   
   // Listen for system changes
   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler);
   ```

2. **Persistence**
   ```typescript
   // Save to localStorage
   localStorage.setItem('theme-preference', theme);
   
   // Restore on load
   const savedTheme = localStorage.getItem('theme-preference');
   ```

3. **SSR Compatibility**
   ```typescript
   // Prevent hydration mismatch
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   if (!mounted) return null;
   ```

### 7. User Experience Requirements

#### Theme Toggle Placement
- **Desktop**: Top-right corner of navigation
- **Mobile**: Accessible in main menu or settings
- **Quiz Pages**: Non-intrusive, consistent placement
- **Results Page**: Maintain context during quiz flow

#### Animation Requirements
- **Theme Transitions**: 200ms ease-in-out
- **Toggle Animation**: Smooth state changes
- **Component Updates**: Fade transitions for color changes
- **No Flash**: Prevent FOUC during theme switching

#### Accessibility Standards
- **WCAG Compliance**: AA level contrast ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Reduced Motion**: Respect prefers-reduced-motion
- **Focus Management**: Clear focus indicators

### 8. Testing Requirements

#### Visual Testing
- [ ] Light mode matches existing design
- [ ] Dark mode provides sufficient contrast
- [ ] All components render correctly in both themes
- [ ] Mobile responsiveness maintained
- [ ] Theme toggle functions correctly

#### Functional Testing
- [ ] Theme persistence across page reloads
- [ ] System preference detection works
- [ ] Theme changes apply immediately
- [ ] LocalStorage fallback handling
- [ ] SSR compatibility verified

#### Accessibility Testing
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Keyboard navigation functional
- [ ] Screen reader announcements correct
- [ ] Focus indicators visible in both themes

### 9. Implementation Phases

#### Phase 1: Foundation (Core Theme System)
1. Create theme context and provider
2. Implement CSS variable system
3. Add basic theme switching logic
4. Update root layout with theme support

#### Phase 2: Component Integration
1. Update existing mobile components
2. Create theme toggle component
3. Integrate toggle into navigation
4. Add theme-aware styling to all pages

#### Phase 3: Enhancement & Polish
1. Add smooth transitions
2. Implement advanced accessibility features
3. Performance optimization
4. Comprehensive testing

### 10. Success Criteria
- [ ] Seamless theme switching without page reload
- [ ] Theme preference persists across sessions
- [ ] System preference automatically detected and respected
- [ ] All existing functionality works in both themes
- [ ] Mobile experience remains optimal
- [ ] No performance degradation
- [ ] Accessibility standards maintained
- [ ] Visual consistency across all components

## Technical Notes

### Browser Support
- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Mobile Safari compatibility for iOS devices

### Performance Considerations
- Minimize runtime theme calculations
- Use CSS custom properties for efficient updates
- Avoid unnecessary re-renders during theme changes
- Optimize for mobile devices with limited resources

### Maintenance Strategy
- Centralized theme definitions
- Consistent naming conventions
- Documentation for future theme additions
- Component library integration

This implementation will provide a robust, accessible, and user-friendly dark mode experience that enhances the MathQuiz app while maintaining its mobile-first responsive design and educational focus.
