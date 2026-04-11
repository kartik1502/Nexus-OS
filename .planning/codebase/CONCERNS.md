# CONCERNS.md - Nexus-OS Technical Debt & Areas of Concern

## High Priority Concerns
- **Missing Automated Tests**: The codebase currently lacks any automated tests (unit, integration, or E2E). This poses a significant risk for regressions and makes refactoring difficult.
- **Security Risks**:
  - **Sensitive Data in Logs**: As identified in previous audits (`docs/arya-banking-analysis-report.md`), there's a risk of leaking plain-text passwords or sensitive tokens in debug logs if not carefully managed.
  - **Hardcoded Secrets**: The `application.yml` and `docker-compose.yml` contain default secrets (`very_secret_key_change_me_in_production`) which must be replaced with secure environment variables in production.
- **Error Handling**: API error handling is currently basic (returning 400 or 404 without descriptive error bodies). A global exception handler is missing in the backend.

## Medium Priority Concerns
- **Incomplete Feature Implementation**: The current backend only supports authentication and issue tracking. Other planned features (projects, documents, certifications) appear to be skeletal or missing from the backend.
- **Frontend Mock Data**: Several frontend pages and components still rely on `mock-data.ts` rather than fetching real data from the backend API.
- **Logging Infrastructure**: Logging is inconsistent across the backend. Controllers lack entry/exit logging, and there's no centralized logging strategy for the frontend.
- **Input Validation**: While `@Valid` is used in some places, comprehensive input validation and sanitization are needed across all API endpoints.

## Technical Debt
- **Skeletal Classes**: Some classes and packages exist but contain minimal or no implementation, leading to "dead" code.
- **Dependency Versions**: Some dependencies (especially in the frontend) are on major versions that may require updates for long-term support and security.
- **Documentation**: Codebase documentation is currently limited to high-level reports. Inline Javadoc/TSDoc is needed for complex logic.
