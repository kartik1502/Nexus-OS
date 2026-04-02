# Codebase Conventions: Nexus-OS

## Frontend Conventions

| Aspect | Convention | Rationale |
|---|---|---|
| **Naming** | PascalCase for Component Files and Folders | Standard React practice. |
| **Styling** | Tailwind CSS v4 Utility Classes | Speedy development and consistent design system. |
| **Logic** | Component-first, hooks for complex state | Clean, modular React code. |
| **Theming** | Indigo Accent, Dark Mode Default | Reflects the "NEXUS" refined aesthetic. |
| **Linting** | ESLint v9 Default | Ensuring clean code through automated quality checks. |

## Coding Style & Ethics

- **Early Returns:** Prefer early returns to deeply nested `if` statements.
- **TypeScript:** Strictly typing props, state, and API responses (no `any`).
- **Semantic HTML:** Using `main`, `section`, `nav`, and `h1-h6` correctly for accessibility and SEO.
- **Error Handling:** Graceful UI-level error boundaries for API failures.
- **Functional Components:** All React components must be functional (no classes).
