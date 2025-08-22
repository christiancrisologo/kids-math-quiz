---
mode: agent
---

# Tech Debt Task: Refactor Next.js Codebase

## Keypoints for Refactoring

* **Component Composition:**
  - Avoid "prop drilling" by using context or a state management library.
  - Break down large components into smaller, more focused ones that are reusable across your application.

* **Data Fetching:**
  - For static or infrequently updated data, consider using Static Site Generation (SSG) or Incremental Static Regeneration (ISR) to pre-render pages.
  - For dynamic, user-specific data, leverage Server Components and the next/cache function to handle data fetching on the server and reduce client-side JavaScript.

* **API Routes vs. Server Actions:**
  - For mutations, use Server Actions to handle data changes directly on the server without needing to create separate API routes, which simplifies the codebase.

* **Code Splitting:**
  - Further optimize with next/dynamic to lazy-load components that aren't critical for the initial page load.

* **Type Safety:**
  - Generate TypeScript if required.

* **General:**
  - Recommend refactoring to simplify complex logic, improve code readability, and adhere to modern best practices.


## Git Instructions

---

## Refactor Checklist

### Component Composition
- [ ] Refactor areas with prop drilling; use context or state management
- [ ] Break down large components into smaller, reusable ones
- [ ] Ensure components follow single-responsibility principle

### Data Fetching
- [ ] Audit data sources: mark static/infrequently updated data
- [ ] Implement SSG/ISR for static pages
- [ ] Use Server Components and `next/cache` for dynamic/user-specific data

### API Routes vs. Server Actions
- [ ] Review API routes for mutations
- [ ] Migrate mutation logic to Server Actions where possible
- [ ] Remove redundant API routes

### Code Splitting
- [ ] Identify non-critical components for initial load
- [ ] Refactor to use `next/dynamic` for lazy loading

### Type Safety
- [ ] Ensure all files use TypeScript
- [ ] Add/verify type definitions for props, state, and API responses

### General Refactoring
- [ ] Simplify complex logic and improve readability
- [ ] Remove unused code and dependencies
- [ ] Adhere to modern Next.js and React best practices
