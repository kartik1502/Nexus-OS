# Phase 1: Infrastructure & Scaffolding - Research

Technical approach for implementing the Nexus-OS development environment and scaffolds.

## Validation Architecture

1. **Connectivity Check:** Verify that the frontend can reach the backend `/api` endpoints through the Nginx proxy.
2. **Database Persistence:** Verify that data survives a container restart using Docker volumes.
3. **App Startup:** Verify that both Spring Boot and Next.js start without errors within their respective containers.
4. **Environment Variables:** Verify that `.env` files are correctly consumed by all three tiers.

## Standard Stacks & Patterns

### 1. Docker Compose (Orchestration)
- **Base Images:** 
  - `eclipse-temurin:21-jdk-alpine` (for Spring Boot).
  - `node:20-alpine` or `node:22-alpine` (for Next.js 16/React 19).
  - `postgres:16-alpine` (for database).
  - `nginx:alpine` (for proxy).
- **Networks:** Standard Bridge network for intra-container communication.
- **Dependencies:** `depends_on` with `healthcheck` for the database.

### 2. Spring Boot 3 (Backend)
- **Maven Structure:** Standard single-module layout.
- **Configuration:** `application.yml` with profiles (dev/prod).
- **Migrations:** Flyway for schema management. Initial SQL script to create `users`, `issues`, `docs`, and `certifications` tables as defined in `NEXUS-Project-Documentation.md`.

### 3. Next.js 16 (Frontend)
- **Docker Multi-stage Build:** For production optimization, though dev mode will focus on volume mapping for hot-reloading.
- **Styling:** Tailwind v4 compatibility checks (ensuring `postcss` is correctly handled).

## Pitfalls to Avoid

- **CORS Issues:** Need to configure Spring Security/WebMvc to allow requests from the Nginx proxy domain.
- **Port Conflicts:** Ensuring port 80 is not occupied on the host machine.
- **Spring Boot 3 + Java 21:** Ensuring the `pom.xml` uses the latest `spring-boot-starter-parent`.

## Implementation Strategy

1. **Root Scaffolding:** Create `docker-compose.yml`, `nginx.conf`, and `.env.example`.
2. **Backend Base:** Create `backend/` folder, `pom.xml`, and initial `application.yml`.
3. **Database Core:** Create initial Flyway migration `V1__Initial_Schema.sql`.
4. **Frontend Integration:** Update `frontend/` to be Docker-ready and establish the `src/components/layout` architecture.

---
*Phase: 01-infrastructure-scaffold*
*Research conducted: April 3, 2026*
