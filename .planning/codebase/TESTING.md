# TESTING.md - Nexus-OS Testing Patterns & Infrastructure

## Current Testing State
As of the initial codebase mapping, there are no formal automated tests implemented in either the backend or frontend services. The `backend/src/test` and `frontend/src` directories do not contain any test suites.

## Planned Testing Strategy
- **Backend Testing (Spring Boot)**:
  - **Unit Tests**: Test individual service methods and logic using **JUnit 5** and **Mockito**.
  - **Integration Tests**: Test the interaction between layers and the database using `@SpringBootTest` and `@DataJpaTest`.
  - **API Tests**: Verify REST endpoints using `MockMvc`.
- **Frontend Testing (Next.js)**:
  - **Component Tests**: Test individual React components in isolation using **React Testing Library** and **Vitest** (or Jest).
  - **Unit Tests**: Test utility functions and hooks using Vitest.
  - **End-to-End (E2E) Tests**: (Future) Test critical user flows using **Playwright** or **Cypress**.

## Execution & Reporting
- **Backend**: Tests can be executed using `mvn test`.
- **Frontend**: Tests can be executed using `npm test` or `npm run test:watch`.
- **CI/CD Integration**: Tests should be integrated into the build pipeline to ensure quality and prevent regressions.

## Mocking & Data
- Use **Mockito** in the backend for mocking service and repository dependencies.
- Use **MSW (Mock Service Worker)** or manual mocks in the frontend to simulate API responses.
- Ensure test data is cleaned up or isolated using `@Transactional` in the backend.
