# Project Roadmap: Nexus-OS

The project roadmap for building the NEXUS Personal OS, broken down into 7 logical phases.

## Phase 1: Infrastructure & Scaffolding (Active)

Set up the core development environment and initial project structure.
- **[ ]** Docker Compose configuration (Frontend, Backend, PostgreSQL).
- **[ ]** Spring Boot 3 backend scaffold (pom.xml, initial entities).
- **[ ]** flyway migrations for relational core.
- **[ ]** Next.js 16+ frontend layout and shared components.

## Phase 2: Auth & Security (Planned)

Implementing stateless authentication and authorization.
- **[ ]** Spring Security context and JWT filter.
- **[ ]** Login & Registration server-side logic and client UI.
- **[ ]** Role-based access control (RBAC).

## Phase 3: Issues Tracker (Planned)

The first core module: task/issue management.
- **[ ]** Issue CRUD and API endpoints.
- **[ ]** Kanban Board UI with DnD support.
- **[ ]** List view with priority/status filtering.

## Phase 4: Documentation Module (Planned)

The second core module: rich-text documentation.
- **[ ]** Tiptap rich-text editor with slash commands.
- **[ ]** Tree-based navigation and topic grouping.
- **[ ]** PostgreSQL full-text search integration.

## Phase 5: Certification Manager (Planned)

The third core module: cert tracking and alerts.
- **[ ]** Cert tracking CRUD and card grid UI.
- **[ ]** File upload for certificate scans.
- **[ ]** Spring scheduler for daily expiry checks and email alerts.

## Phase 6: Unified Dashboard (Planned)

Bringing it all together into a central command center.
- **[ ]** Overview stats and active issue feed.
- **[ ]** Recently edited docs and expiring certs panel.

## Phase 7: Deployment & Polishing (Planned)

Finalizing the production environment.
- **[ ]** Cloudflare Tunnel secure exposure.
- **[ ]** Oracle Cloud Free Tier / VPS deployment guide.
- **[ ]** Comprehensive UI/UX audit and performance tuning.
