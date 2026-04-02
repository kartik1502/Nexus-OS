# Codebase Testing: Nexus-OS

## Current Testing Setup

| Level | Status | Details |
|---|---|---|
| **Unit Tests** | Not present | Focused on initial UI-UX scaffold. |
| **Integration**| Not present | No backend available to test against. |
| **E2E Tests** | Not present | Browser-level verification not yet automated. |
| **Linting** | Configured | ESLint v9 for code quality. |

## Recommended Testing Patterns

1. **Unit Testing:** Using **Vitest** or **Jest** for utility functions and complex React hooks.
2. **Component Testing:** Using **React Testing Library** for individual UI component interactions.
3. **E2E / UAT:** Using **Playwright** for complete user flows (Issues CRUD, Docs Search, Cert Alerts).
4. **API Testing:** Integration tests for the Spring Boot backend layer (JUnit/Mockito).

## Verification Strategy

- **GSD Verification:** Use `/gsd-verify-work` for manual UAT.
- **UI Audit:** Use the **UI-UX-Pro-Max** skill for layout and visual quality audits.
- **Automated Checks:** Configure CI/CD pipeline once tests are implemented.
