# Aleph Cloud Page Guidelines

## Commands
```
npm run dev          # Start development server
npm run build        # Create production build
npm run export       # Export build to static HTML
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

## Code Style
- **TypeScript**: Strict typing, explicit return types
- **Components**: PascalCase, atomic folder structure (index.ts, cmp.tsx, types.ts, styles.tsx)
- **Hooks**: camelCase with `use` prefix, separate files for component-specific hooks
- **Imports**: React first, third-party libs, internal imports (@/* aliases)
- **Styling**: Twin.macro with TailwindCSS + styled-components
- **Error Handling**: Centralized error definitions in errors.ts
- **Component Pattern**:
  ```tsx
  export const Component = ({ prop1, prop2 }: ComponentProps) => {...}
  Component.displayName = 'Component'
  export default memo(Component)
  ```
- **Types**: Separate type files, descriptive naming (ComponentProps, UseHookReturn)