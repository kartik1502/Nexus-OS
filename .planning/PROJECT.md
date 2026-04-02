# ✦ NEXUS Personal OS: Project Context

NEXUS is a self-hosted, full-stack personal productivity ecosystem designed to replace expensive subscription-based tools. It provides a unified platform for issue tracking, documentation management, and certification tracking.

## Core Value

**Eliminate subscription costs and data silos by providing a professional-grade, self-hosted productivity ecosystem.**

## System Architecture

The project uses a standard three-tier architecture:
- **Frontend:** Next.js 16.2.1 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui.
- **Backend (Planned):** Java 21, Spring Boot 3, Spring Security (JWT).
- **Database:** PostgreSQL 16 (Relational + JSONB).
- **Deployment:** Docker Compose, Cloudflare Tunnel (Target).

## Modules

### 1. Issues Tracker
A high-performance issue tracker with Kanban and list views, priorities, status workflows, and tag-based management.

### 2. Documentation Manager
A comprehensive documentation manager featuring a Tiptap-based rich-text editor, slash commands, and split-pane markdown support.

### 3. Certification Manager
A tool to track professional certifications with expiry countdowns, file uploads, and automated email alerts via Spring Scheduler + Gmail SMTP.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **PostgreSQL 16** | Native Relational integrity + JSONB for flexible Tiptap docs. Built-in full-text search. | ✅ Decided |
| **Next.js 16.2.1** | Modern App Router, TypeScript, and superior DX. | ✅ Decided |
| **Spring Boot 3** | Mature ecosystem, production-ready, and strong Spring Security integration. | ✅ Decided |
| **Tailwind v4** | Next-gen styling engine for speed and consistency. | ✅ Decided |

## Roadmap

1. **Phase 1: Infrastructure** — Docker, Spring Boot & Next.js scaffolds. (Current)
2. **Phase 2: Auth** — JWT, Login/Register, Security config.
3. **Phase 3: Issues Tracker** — CRUD, Kanban UI, detail panel.
4. **Phase 4: Docs Module** — Rich-text editor, search, sidebar tree.
5. **Phase 5: Cert Manager** — Expiry scheduler, email notifications.
6. **Phase 6: Dashboard** — Unified overview and feeds.
7. **Phase 7: Deployment** — Local Docker + Cloudflare Tunnel.

---
*Last updated: April 3, 2026 after project initialization.*
