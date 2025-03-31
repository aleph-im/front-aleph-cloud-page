# Aleph Cloud Page Guidelines

## Commands

```
npm run dev          # Start development server
npm run build        # Create production build
npm run export       # Export build to static HTML
npm run lint:fix     # Run ESLint with auto-fix
```

## Code Style and Conventions

- **TypeScript**: Strict typing, explicit return types
- **Components**: PascalCase, atomic folder structure (index.ts, cmp.tsx, types.ts, styles.tsx)
- **Hooks**: camelCase with `use` prefix, component-specific hooks in separate files
- **Imports**: React first, third-party libs, internal imports (@/\* aliases)
- **Styling**: Twin.macro with TailwindCSS + styled-components
- **Formatting**: Single quotes, no semicolons, 2-space indent, 80 char line limit
- **Error Handling**: Centralized error definitions in errors.ts
- **Component Pattern**:
  ```tsx
  export const Component = ({ prop1, prop2 }: ComponentProps) => {...}
  Component.displayName = 'Component'
  export default memo(Component)
  ```
- **Types**: Separate type files with descriptive naming (ComponentProps, UseHookReturn)

## Automation Instructions

- Run `npm run lint:fix` after making code changes
- Never commit changes unless you're explicitly told to do so
- When commiting, don't mention or coauthor claude in the commits
- Test changes with `npm run build` before pushing
