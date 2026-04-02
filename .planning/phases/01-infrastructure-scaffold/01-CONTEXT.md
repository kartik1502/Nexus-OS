# Phase 1: Infrastructure & Scaffolding - Context

Capture of key decisions and design boundaries for the initial project infrastructure.

## Phase Boundary

Establishing a unified, multi-tier development environment featuring:
- **Frontend Container:** Next.js (ready for SSR/Client interaction).
- **Backend Container:** Spring Boot 3 (JVM 21).
- **Database Container:** PostgreSQL 16.
- **Reverse Proxy:** Nginx (for service discovery and SSL/Domain simulation).
- **Networking:** Unified `nexus-network`.

## Implementation Decisions

### Networking & Orchestration
- **Docker Network:** Use a custom bridge network `nexus-network` to allow service resolution via DNS (e.g., `http://backend:8080`).
- **Nginx Proxy:** Serve as the entry point on port 80 (and later 443). Routes `/api` to the backend and `/` to the frontend.
- **Volumes:** PERSISTENT storage for PostgreSQL and `/uploads` folder.

### Backend (Spring Boot 3)
- **Dependency Management:** Maven (`pom.xml`).
- **Language:** Java 21 LTS.
- **Scaffold:** Standard Spring Boot web, JPA, Flyway, and PostgreSQL driver.

### Frontend (Next.js 16)
- **App Router:** Using the new App router with `src` directory as established in `frontend/`.
- **Styling:** Tailwind v4 (PostCSS config update for Docker).

## Canonical References

- **PROJECT.md:** For vision and modules.
- **REQUIREMENTS.md:** For INF and SYS IDs.
- **NEXUS-Project-Documentation.md:** For original design specs.

## specifics

- **Ports:**
  - Nginx: 80 (Localhost entry)
  - Frontend: 3000 (Internal)
  - Backend: 8080 (Internal)
  - PostgreSQL: 5432 (Internal)

---
*Phase: 01-infrastructure-scaffold*
*Context gathered: April 3, 2026*
