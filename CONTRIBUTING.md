# Contributing to Wando

Thank you for your interest in contributing to Wando! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/wando.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/description` - For new features
- `fix/description` - For bug fixes
- `refactor/description` - For code refactoring
- `docs/description` - For documentation updates

Examples:

- `feature/user-authentication`
- `fix/header-styling`
- `refactor/component-structure`

### Before Committing

Always run validation before committing:

```bash
npm run validate
```

This ensures your code builds successfully and passes all checks.

### Creating Pull Requests

1. **Create a checkpoint** before opening a PR:

   ```bash
   npm run checkpoint "Description of your changes"
   ```

2. **Open PRs to `main`** branch only

3. **Use descriptive titles** and provide clear summaries

4. **Follow the PR template** - it will be automatically populated

### After Merging

1. **Create a checkpoint** after merging to main:

   ```bash
   npm run checkpoint "Post-merge: [PR description]"
   ```

2. **Update your local main** branch:
   ```bash
   git checkout main
   git pull origin main
   ```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Remove unused imports and variables

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use proper prop types

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design

### Code Quality

- No console.log statements in production code
- Remove unused imports
- Use meaningful variable and function names
- Add comments for complex logic

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run validate` - Run full validation (build + linting)
- `npm run quick-validate` - Quick validation (TypeScript + linting)
- `npm run lint` - Run ESLint
- `npm run checkpoint` - Create a checkpoint
- `npm run rollback` - Rollback to last checkpoint
- `npm run clean` - Clean and reinstall dependencies

## Checkpoint System

Wando uses an automated checkpoint system to maintain code stability:

- **Before major changes**: Create a checkpoint
- **After successful merges**: Create a checkpoint
- **If build fails**: Use `npm run rollback` to revert

## Getting Help

- Check existing issues before creating new ones
- Use descriptive issue titles
- Provide steps to reproduce bugs
- Include relevant code snippets

## Commit Messages

Use clear, descriptive commit messages:

- `feat: add user authentication`
- `fix: resolve header styling issue`
- `refactor: consolidate component structure`
- `docs: update contributing guidelines`

## Thank You

Your contributions help make Wando better for everyone. Thank you for taking the time to contribute!
