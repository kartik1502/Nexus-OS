# ✦ NEXUS Personal OS

> *A self-hosted, full-stack personal productivity ecosystem built to replace expensive proprietary SaaS tooling.*

## Overview

NEXUS is an all-in-one personal operating system that runs entirely on your own infrastructure — ensuring your data stays yours. It combines three core modules into a single, unified application:

- 🎯 **Issues Tracker**: Kanban board, list views, priority tracking, and status workflows for comprehensive task management.
- 📝 **Documentation Manager**: Rich-text editing via Tiptap, full markdown support, and native PostgreSQL full-text search for tracking robust project knowledge.
- 🏆 **Certification Manager**: Track your certifications, view graphical expiry countdowns, and receive automated email alerts.

## 🏗️ Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend:** Java 21, Spring Boot 3 *(In-progress)*.
- **Database:** PostgreSQL 16 (Taking full advantage of JSONB, `tsvector` full-text search, and `pg_trgm`).
- **Deployment:** Docker Compose (Single command orchestration).

## 🚀 Getting Started

*Note: Phase 1 frontend development is active. The backend API integration is slated for Phase 2.*

### Running the Frontend locally:
```bash
cd frontend
npm install
npm run dev
```

Then visit the interface at [http://localhost:3000](http://localhost:3000).

## 📖 Deep Dive

For a comprehensive breakdown of the application architecture, system design patterns, database schemas, and REST API endpoints, please check out the [NEXUS Project Documentation](./NEXUS-Project-Documentation.md).
