# STRUCTURE.md - Nexus-OS Directory Structure & Key Locations

## Project Root Layout
- `backend/`: Java/Spring Boot source code and build files.
- `frontend/`: TypeScript/Next.js source code and configuration.
- `docs/`: (presumably) project-specific documentation.
- `progressctx/`: Temporary directory for session history.
- `.planning/`: GSD system documents, codebase maps, and phase plans.
- `nginx.conf`: Root Nginx reverse proxy configuration.
- `docker-compose.yml`: Orchestration for backend, frontend, and db services.

## Backend Structure (`backend/src/main/java/com/nexus/backend`)
- `controller/`: REST API controllers (e.g., `AuthController.java`, `IssueController.java`).
- `dto/`: Data Transfer Objects (e.g., `LoginRequest.java`).
- `entity/`: Database JPA models (e.g., `Issue.java`, `User.java`, `Role.java`).
- `repository/`: Spring Data JPA interfaces (e.g., `UserRepository.java`, `IssueRepository.java`).
- `security/`: JWT and Spring Security configuration.
- `service/`: Service interfaces and their implementations (`impl/`).
- `BackendApplication.java`: Main application entry point.

## Frontend Structure (`frontend/src`)
- `app/`: Next.js App Router (using routes organized by groups: `(auth)`, `(dashboard)`, `(main)`).
- `components/`: UI components organized by feature (e.g., `certifications`, `docs`, `issues`, `layout`, `ui`).
- `lib/`: Shared utilities, API client, types, and constants.
- `middleware.ts`: Next.js middleware for handling authentication and routing logic.

## Resource & Configuration Locations
- `backend/src/main/resources/application.yml`: Backend environment configuration.
- `backend/src/main/resources/db/migration`: Flyway database migration scripts.
- `frontend/package.json`: Frontend dependency list and scripts.
- `frontend/next.config.ts`: Next.js specific configuration.
- `frontend/src/app/globals.css`: Global styling and Tailwind directives.
