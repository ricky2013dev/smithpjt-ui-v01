# Claude Coding Standards

## General Principles

### Code Quality
- Write clear, readable code that is easy to understand
- Prefer explicit over implicit
- Keep functions small and focused (single responsibility principle)
- Use meaningful variable and function names
- Remove unused code and imports

### No Over-engineering
- Only make changes that are directly requested or clearly necessary
- Don't add features, refactor, or make "improvements" beyond what was asked
- Don't add error handling for scenarios that can't happen
- Don't create helpers or utilities for one-time operations

## TypeScript/JavaScript Standards

### Type Safety
- Always use TypeScript for type safety
- Use explicit types instead of `any`
- Use `const` by default, `let` only when reassignment is needed
- Avoid `var` entirely

### Naming Conventions
- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and components
- Use `UPPER_CASE` for constants
- Use descriptive, meaningful names (avoid single letters except for loops)

### Function Guidelines
- Keep functions under 20 lines when possible
- Use arrow functions for callbacks and simple operations
- Add parameters with clear types
- Return consistent types (avoid mixing return types)
- Do not duplicate code - extract duplicated code into common functions and reuse

### Comments
- Only add comments where logic isn't self-evident
- Explain the "why", not the "what"
- Keep comments up-to-date with code changes
- Don't add docstrings to unchanged code

## React/Component Standards

### Component Structure
- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks
- Use proper prop typing with TypeScript
- For UI pages, organize at component level for easy maintenance - break down pages into smaller, reusable components

### Naming
- Component files should match component name in PascalCase
- Use `.tsx` extension for React components
- Keep file names descriptive

### Hooks
- Use `useCallback` only when necessary (not for every function)
- Use `useMemo` for expensive computations
- Keep hook dependencies accurate
- Don't break rules of hooks

## File Organization

### Structure
- Group related files together
- Keep server and client code separate
- Use clear folder hierarchy
- Keep component files close to their usage

### Imports
- Sort imports: external libraries, then local files
- Use absolute imports where configured
- Remove unused imports
- Use named imports over default imports when appropriate

## Database & API

### Database Schema
- Use meaningful table and column names
- Use appropriate data types
- Add constraints where needed
- Keep migrations clean and reversible

### API Design
- Use RESTful conventions
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return consistent response formats
- Handle errors gracefully with proper status codes

## Security

### Input Validation
- Validate all user input at system boundaries
- Sanitize data before database operations
- Avoid SQL injection vulnerabilities
- Prevent XSS attacks in client code

### Secrets & Environment
- Never commit secrets to version control
- Use environment variables for sensitive data
- Don't log sensitive information
- Use HTTPS for all API calls

## Testing

### Unit Tests
- Write tests for critical logic
- Keep tests simple and focused
- Test behavior, not implementation
- Use descriptive test names

### Test Organization
- Co-locate tests with source files when appropriate
- Keep test files up-to-date with code changes

## Performance

### Optimization Guidelines
- Don't optimize prematurely
- Profile before optimizing
- Avoid unnecessary re-renders in React
- Use lazy loading for large lists/components
- Minimize bundle size by tree-shaking unused code

## Git & Commits

### Commit Messages
- Use clear, descriptive commit messages
- Focus on the "why" rather than "what"
- Keep commits focused on a single concern
- Use imperative tense ("Add feature" not "Added feature")

## Tools & Linting

### Code Formatting
- Follow project's ESLint configuration
- Use Prettier for consistent formatting
- Run type checks before committing
- Keep TypeScript strict mode enabled

### Build & Deployment
- Ensure code builds without errors
- Fix all TypeScript errors before committing
- Run tests before merging
- Keep build fast and efficient
