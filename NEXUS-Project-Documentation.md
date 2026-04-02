# ✦ NEXUS Personal OS
## Project Architecture & Design Documentation

**Eliminate subscription silos. Own your engineering productivity.**

> *Full stack personal ecosystem for Issues, Documentation & Certification Management*

**Version:** 1.0 &nbsp;|&nbsp; **Date:** March 25, 2026 &nbsp;|&nbsp; **Status:** In Progress &nbsp;|&nbsp; **Owner:** Personal Project

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [REST API Design](#5-rest-api-design)
6. [Documentation Module Deep Dive](#6-documentation-module-deep-dive)
7. [Certification Manager](#7-certification-manager)
8. [Hosting & Deployment Options](#8-hosting--deployment-options)
9. [Build Roadmap](#9-build-roadmap)
10. [UI Design Decisions](#10-ui-design-decisions)
11. [Design Discussion Log](#11-design-discussion-log)

---

## 1. Project Overview

NEXUS is a self-hosted, full-stack personal productivity ecosystem built to replace expensive subscription-based tools. It runs entirely on your own infrastructure — free forever — and combines three core modules into a single, unified application.

### 1.1 Motivation

Most project management and documentation tools become expensive once multiple features are needed simultaneously:

- **Issue Trackers** — often limited in free tiers or feature-locked
- **Documentation Tools** — restricted block counts or paid collaboration
- **Relational Wikis** — high cost per user per month
- **Cert tracking tools** — no good free option exists

NEXUS eliminates all subscription costs by running entirely on self-hosted infrastructure, with full control over data and features.

### 1.2 Core Modules

| Module | Replaces | Key Features |
|---|---|---|
| Issues Tracker | Issue Tracking Service | Kanban board, list view, priorities, status workflows, tags |
| Documentation Manager | Documentation Management | Rich text editor, markdown support, tree navigation, full-text search |
| Certification Manager | Custom / Manual | Issue & track certs, expiry countdowns, email alerts |

### 1.3 Design Principles

- 100% self-hosted — no data leaves your machine
- Zero subscription cost
- Docker Compose — one command to run everything
- Mobile-responsive web UI
- Personal-scale — optimised for 1–10 users
- Extensible — clean module separation for future features

---

## 2. Technology Stack

The stack was selected to balance developer familiarity, ecosystem maturity, and operational simplicity for a personal project.

### 2.1 Full Stack Decision

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | SSR, file-based routing, strong ecosystem, mobile-responsive |
| UI Components | Tailwind CSS + shadcn/ui | Utility-first CSS, polished components, dark mode out of the box |
| Backend | Java 21 + Spring Boot 3 | Developer preference, mature ecosystem, production-ready |
| Primary Database | PostgreSQL 16 | Relational data, JSONB for rich text, built-in full-text search |
| File Storage | Local disk / VPS folder | Simple for personal scale — no MinIO overhead needed |
| Auth | Spring Security + JWT | Stateless authentication, role-based access control |
| Email / Alerts | Spring Mail + Gmail SMTP | Free cert expiry notifications via Gmail |
| Scheduler | Spring @Scheduled | Daily cert expiry check — no extra service needed |
| Deployment | Docker Compose | Single-file orchestration, runs anywhere |
| Rich Text Editor | Tiptap (open source) | Comprehensive editor with slash commands, markdown support |

### 2.2 Why PostgreSQL over MongoDB

MongoDB was considered but PostgreSQL was chosen for the following reasons:

- Task, issue, and certification data is inherently relational with foreign keys
- Native JSONB column handles Tiptap rich-text content with full JSON querying
- Built-in `tsvector` full-text search replaces the need for Elasticsearch or Meilisearch
- `pg_trgm` extension provides fuzzy/typo-tolerant search at zero extra cost
- Superior free hosting options: Supabase, Neon, Railway vs MongoDB Atlas 512MB limit
- ACID transactions are rock-solid vs MongoDB which added them only in v4.0

> 💡 **TIP:** PostgreSQL JSONB gives the best of both worlds — store Tiptap doc content as flexible JSON while keeping relational data (tasks, certs, users) structured and queryable in the same database.

### 2.3 Components Excluded (and Why)

| Component | Decision | Reason |
|---|---|---|
| Redis | Removed | No session caching needed at personal scale; JWT is stateless |
| MinIO | Removed | Local disk storage is sufficient; can add later if needed |
| Meilisearch | Removed | PostgreSQL full-text search handles personal-scale doc search |
| Keycloak | Removed | Overkill for personal use; Spring Security + JWT is simpler |
| Elasticsearch | Removed | Not needed until millions of documents |

---

## 3. System Architecture

### 3.1 High-Level Architecture

The system uses a three-tier architecture: a Next.js frontend communicates with a Spring Boot REST API, which persists data to a PostgreSQL database. All services run in Docker containers.

```
Browser / Mobile
      │
      ▼  REST / JSON
[ Next.js Frontend  :3000 ]
      │
      ▼  HTTP API calls
[ Spring Boot Backend  :8080 ]
  /api/issues   /api/docs   /api/certifications   /api/auth
      │
      ▼  Spring Data JPA
[ PostgreSQL  :5432 ]     [ /uploads — File Storage ]
```

### 3.2 Docker Compose Services

Three containers are all that is needed to run the entire application:

| Service | Image | Port | Purpose |
|---|---|---|---|
| frontend | Next.js 14 | 3000 | Web UI — serves the React application |
| backend | Spring Boot 3 | 8080 | REST API — all business logic |
| postgres | PostgreSQL 16 | 5432 | Primary database — all persistent data |

### 3.3 Project Directory Structure

```
nexus/
├── backend/                    ← Spring Boot 3 + Java 21
│   ├── src/main/java/com/nexus/
│   │   ├── auth/               ← JWT, Spring Security
│   │   ├── issues/             ← Issue tracker module
│   │   ├── docs/               ← Documentation module
│   │   ├── certifications/     ← Cert tracker + scheduler
│   │   └── common/             ← Shared config, exceptions
│   ├── src/main/resources/
│   │   ├── db/migration/       ← Flyway SQL migrations
│   │   └── application.yml
│   └── pom.xml
├── frontend/                   ← Next.js 14 + TypeScript
│   ├── app/
│   │   ├── dashboard/
│   │   ├── issues/
│   │   ├── docs/
│   │   └── certifications/
│   ├── components/
│   └── package.json
├── uploads/                    ← Cert file storage
└── docker-compose.yml
```

---

## 4. Database Schema

All data is stored in a single PostgreSQL database with four core tables. Flyway manages schema versioning.

### 4.1 Users Table

| Column | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | Auto-generated UUID |
| email | VARCHAR(255) | UNIQUE NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| full_name | VARCHAR(100) | NOT NULL | Display name |
| role | VARCHAR(20) | NOT NULL | ADMIN or VIEWER |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

### 4.2 Issues Table

| Column | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | Auto-generated UUID |
| issue_key | VARCHAR(20) | UNIQUE NOT NULL | Human key e.g. ISS-001 |
| title | VARCHAR(255) | NOT NULL | Issue title |
| description | TEXT | | Full description |
| status | VARCHAR(30) | NOT NULL | BACKLOG / TODO / IN_PROGRESS / IN_REVIEW / DONE |
| priority | VARCHAR(20) | NOT NULL | LOW / MEDIUM / HIGH / CRITICAL |
| project | VARCHAR(100) | | Project name |
| tags | TEXT[] | | Array of tag strings |
| due_date | DATE | | Optional due date |
| created_by | UUID | FK → users | Issue creator |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### 4.3 Docs Table

| Column | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | Auto-generated UUID |
| title | VARCHAR(255) | NOT NULL | Document title |
| content | JSONB | | Tiptap rich-text JSON content |
| markdown | TEXT | | Raw markdown source (optional) |
| format | VARCHAR(20) | NOT NULL | `'rich'` or `'markdown'` |
| status | VARCHAR(20) | NOT NULL | DRAFT or PUBLISHED |
| project | VARCHAR(100) | | Linked project name |
| topic | VARCHAR(100) | | Topic / concept grouping |
| tags | TEXT[] | | Array of tag strings |
| search_vector | TSVECTOR | | Auto-updated full-text search index |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

> 📝 **NOTE:** A PostgreSQL trigger auto-updates the `search_vector` column whenever `title` or `content` changes, enabling full-text search with zero application-level code.

### 4.4 Certifications Table

| Column | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | Auto-generated UUID |
| name | VARCHAR(255) | NOT NULL | Certification name |
| issuer | VARCHAR(255) | | Issuing organisation |
| issued_date | DATE | NOT NULL | Date of issue |
| expiry_date | DATE | | Expiry date (null = no expiry) |
| status | VARCHAR(20) | NOT NULL | ACTIVE / EXPIRING_SOON / EXPIRED |
| reminder_days | INTEGER | DEFAULT 30 | Days before expiry to send alert |
| cert_file_path | VARCHAR(500) | | Path to uploaded certificate file |
| notes | TEXT | | Personal notes |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

---

## 5. REST API Design

All endpoints are prefixed with `/api`. Authentication is via JWT Bearer token in the `Authorization` header.

### 5.1 Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT tokens |
| POST | `/api/auth/refresh` | Public | Refresh an expired access token |
| POST | `/api/auth/logout` | Auth | Invalidate current token |
| GET | `/api/auth/me` | Auth | Get current user profile |

### 5.2 Issues Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/issues` | Auth | List all issues (filter by status, priority, project) |
| POST | `/api/issues` | Auth | Create a new issue |
| GET | `/api/issues/{id}` | Auth | Get a single issue by ID |
| PUT | `/api/issues/{id}` | Auth | Update an issue |
| DELETE | `/api/issues/{id}` | Auth | Delete an issue |
| PATCH | `/api/issues/{id}/status` | Auth | Update issue status only |
| GET | `/api/issues/stats` | Auth | Get issue count stats by status/priority |

### 5.3 Docs Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/docs` | Auth | List all docs (filter by project, topic, tags, status) |
| POST | `/api/docs` | Auth | Create a new document |
| GET | `/api/docs/{id}` | Auth | Get a single document with full content |
| PUT | `/api/docs/{id}` | Auth | Update a document |
| DELETE | `/api/docs/{id}` | Auth | Delete a document |
| GET | `/api/docs/search?q=` | Auth | Full-text search across title and content |
| GET | `/api/docs/groups` | Auth | Get docs grouped by project or topic |

### 5.4 Certifications Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/certifications` | Auth | List all certs (filter by status) |
| POST | `/api/certifications` | Auth | Add a new certification |
| GET | `/api/certifications/{id}` | Auth | Get single certification |
| PUT | `/api/certifications/{id}` | Auth | Update a certification |
| DELETE | `/api/certifications/{id}` | Auth | Delete a certification |
| POST | `/api/certifications/{id}/upload` | Auth | Upload certificate file (PDF/image) |
| GET | `/api/certifications/expiring` | Auth | Get certs expiring within N days |

---

## 6. Documentation Module Deep Dive

### 6.1 Rich Text Editor — Tiptap

The documentation module uses Tiptap, a headless rich-text editor built on ProseMirror, providing a seamless editing experience:

- **Slash commands** — type `/` to open a command menu (headings, lists, tables, code blocks, dividers, callouts)
- **Markdown paste** — paste raw Markdown and it auto-converts to rich content
- **Drag & drop blocks** — reorder content blocks by dragging
- **Syntax-highlighted code blocks** via `lowlight`
- Content serialised as JSON, stored in PostgreSQL JSONB column

### 6.2 Slash Command Menu

| Command | Result |
|---|---|
| `/heading 1` | Large section title (H1) |
| `/heading 2` | Sub-section title (H2) |
| `/bullet list` | Unordered bullet list |
| `/numbered list` | Ordered numbered list |
| `/todo` | Checkbox task list |
| `/code block` | Syntax-highlighted code |
| `/quote` | Blockquote callout |
| `/divider` | Horizontal rule |
| `/table` | Insert a table |
| `/callout` | Highlighted note box |

### 6.3 Markdown Support

Two modes of Markdown support are available:

- **Mode A** — Paste Markdown directly into the Tiptap editor and it auto-converts to rich content using `@tiptap/extension-markdown`
- **Mode B** — Dedicated split-pane view: raw Markdown on the left, live rendered preview on the right using `react-markdown` + `remark-gfm`

> ℹ️ **INFO:** Both formats can be stored simultaneously — `content` (JSONB for rich text) and `markdown` (TEXT for raw source) columns exist on the docs table, enabling export back to Markdown at any time.

### 6.4 Search Architecture

Full-text search is handled natively by PostgreSQL — no external search service is required:

| Search Type | Mechanism | Notes |
|---|---|---|
| Title search | `ILIKE` query | Instant, case-insensitive |
| Content search | `tsvector` full-text | Searches inside JSONB doc content |
| Tag search | Array `@>` operator | Exact tag matching |
| Fuzzy / typo search | `pg_trgm` extension | Tolerates typos and partial matches |
| Filter by project | `WHERE` clause | Simple equality filter |
| Filter by topic | `WHERE` clause | Simple equality filter |

### 6.5 UI Layout

The documentation UI features a three-panel layout inspired by modern productivity tools:

- **Left sidebar** — collapsible project tree with expandable topic nodes, quick tag filter chips
- **Main area** — card grid view with title, excerpt (3-line preview), tags, status badge, and last-edited timestamp
- **Group By toggle** — switch between grouping by Project, Topic, or no grouping
- **Active filter pills** — visible chips for each active filter with one-click removal
- **Search bar** — live debounced search that filters cards as you type

---

## 7. Certification Manager

### 7.1 Features

- **Card grid view** — each cert shows name, issuer, status badge, days-left countdown, and progress bar
- **Status tracking** — ACTIVE / EXPIRING_SOON / EXPIRED with colour-coded visual indicators
- **File upload** — attach the actual PDF or image of your certificate
- **Expiry alerts** — automated email reminders sent N days before expiry
- **Dashboard alert banner** — prominent warning when any cert is expiring soon

### 7.2 Automated Expiry Scheduler

A Spring `@Scheduled` job runs daily at 8:00 AM and performs the following:

1. Queries the database for all certifications where `expiry_date` is within `reminder_days` days
2. Updates the `status` column to `EXPIRING_SOON` for matching records
3. Sends an email notification via Gmail SMTP for each expiring certification
4. Updates `status` to `EXPIRED` for any certifications where `expiry_date` has passed

> 📧 **NOTE:** Email is sent via Gmail SMTP — completely free. Configure `GMAIL_USER` and `GMAIL_APP_PASSWORD` environment variables in `docker-compose.yml`. No paid email service required.

---

## 8. Hosting & Deployment Options

The application is packaged as three Docker containers and can be deployed on any of the following options:

### 8.1 Hosting Options Comparison

| Option | Cost | Setup Complexity | Notes |
|---|---|---|---|
| Local + Cloudflare Tunnel | $0 forever | Medium | Runs on your machine; goes offline when machine is off |
| Oracle Cloud Free Tier | $0 forever | Medium | 4 CPU + 24GB RAM ARM VM; always-on; best free option |
| Hetzner VPS | ~$4–5/month | Low | 2 vCPU, 4GB RAM; fastest performance per dollar |
| Railway / Render | $0–10/month | Very Low | Managed PaaS; free tier sleeps on inactivity |
| AWS / GCP / Azure | $15–30/month | High | Enterprise-grade; overkill for personal use |

### 8.2 Recommended Path

> **STEP 1 →** Local + Cloudflare Tunnel — Day 1, zero cost. Run `docker-compose up` and expose via one Cloudflare command. Access from anywhere via your custom domain.

> **STEP 2 →** Oracle Cloud Free Tier — When you want 24/7 uptime. Deploy the same `docker-compose.yml` to Oracle's permanently free ARM VM (4 CPU, 24GB RAM).

> **STEP 3 →** Hetzner VPS at ~$4/month — If you outgrow the free tier or want EU/US datacentre proximity with reliable SLA.

### 8.3 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `postgres` | PostgreSQL host (Docker service name) |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `nexus` | Database name |
| `DB_USER` | `nexus_user` | Database username |
| `DB_PASSWORD` | `changeme` | Database password — change in production |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret — use a long random string |
| `JWT_EXPIRY_MS` | `86400000` | Token expiry: 24 hours in milliseconds |
| `GMAIL_USER` | `you@gmail.com` | Gmail address for sending cert alerts |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx` | Gmail app password (not account password) |
| `UPLOAD_DIR` | `/uploads` | Docker volume path for file storage |

---

## 9. Build Roadmap

### 9.1 Phase-by-Phase Plan

| Phase | Timeline | Module | Deliverables |
|---|---|---|---|
| Phase 1 | Day 1 | Infrastructure | Docker Compose, PostgreSQL, Spring Boot scaffold, Next.js scaffold |
| Phase 2 | Day 2 | Auth | JWT login/register, Spring Security config, protected routes |
| Phase 3 | Days 3–5 | Issues Tracker | Full CRUD, Kanban board UI, list view, filters, detail panel |
| Phase 4 | Days 5–7 | Docs Module | Tiptap editor, slash commands, markdown support, search, sidebar tree |
| Phase 5 | Days 8–10 | Cert Manager | Cert CRUD, card grid UI, file upload, Spring scheduler, email alerts |
| Phase 6 | Day 11 | Dashboard | Overview stats, active issues feed, cert status panel, recent docs |
| Phase 7 | Day 12 | Deploy | Cloudflare Tunnel or Oracle Cloud Free Tier deployment |

### 9.2 Current Status

| Status | Detail |
|---|---|
| ✅ DONE | Architecture decisions finalised. Tech stack selected. Database schema designed. UI mockups completed for all three modules (Issues, Docs, Certifications) plus full app shell. |
| 🔜 NEXT | Phase 1 — Spring Boot backend scaffold: `pom.xml`, `application.yml`, Flyway migrations, entity classes, repositories, services, and REST controllers for all three modules. |

---

## 10. UI Design Decisions

### 10.1 Design Language

The application uses a dark, refined aesthetic:

- **Dark background:** `#0A0C10` — deep near-black base
- **Accent colour:** Indigo `#6366F1` — consistent brand colour across all modules
- **Typography:** DM Sans for UI text — clean and readable at small sizes
- **Monospace:** DM Mono for issue IDs and code — adds technical character
- **Colour-coded priorities and statuses** — instant visual scanning

### 10.2 Layout Patterns

| Page | Layout Pattern |
|---|---|
| Dashboard | Grid of stat cards + three feed panels |
| Issues List | Grouped list by status + collapsible sections + detail slide-in panel |
| Issues Kanban | Horizontal scroll of columns with drag-ready cards |
| Docs | Collapsible tree sidebar + card grid with grouping toggle |
| Certifications | Card grid with progress bars + top expiry alert banner |

### 10.3 Responsive Strategy

- Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`) throughout
- Sidebar collapses to icon-only mode on smaller screens
- Card grids use `auto-fill minmax` — reflow naturally on mobile
- Tables switch to stacked card layout on mobile viewports

---

## 11. Design Discussion Log

This section records all key decisions made during the initial architecture and design discussions.

### Decision 1 — Initial Tech Stack

| Concern | Decision |
|---|---|
| Frontend | React / Next.js — recommended given Java backend preference and mobile requirement |
| Backend | Java 21 + Spring Boot 3 — user preference |
| Database | PostgreSQL — relational data fits the modules better than MongoDB |
| Deployment | Docker Compose — simplest for personal project, portable to any server |
| Search | PostgreSQL full-text (`tsvector` + `pg_trgm`) — no extra service required |

### Decision 2 — PostgreSQL vs MongoDB

MongoDB was raised as an alternative. Decision was to keep PostgreSQL because:

- Issue/cert data is relational with clear foreign key relationships
- JSONB handles the flexible Tiptap content perfectly
- Built-in full-text search removes Meilisearch as a dependency
- Better free hosted options (Supabase, Neon vs Atlas 512MB)

### Decision 3 — Documentation Search

Confirmed: full-text search is available with zero extra infrastructure using PostgreSQL `tsvector` (content search), `pg_trgm` (fuzzy/typo tolerance), array operators (tag filtering), and simple `WHERE` clauses (project/topic filtering). A live debounced search bar in the frontend calls `GET /api/docs/search?q=`.

### Decision 4 — Rich Text Editor

Tiptap was selected as the documentation editor because it provides: convenient slash command menus, markdown paste-to-render via `@tiptap/extension-markdown`, drag-and-drop block reordering, syntax-highlighted code blocks, and content serialised as JSON for PostgreSQL JSONB storage. All features are free and open source.

### Decision 5 — Markdown Input

In addition to the Tiptap editor, a dedicated Markdown split-pane view will be available: raw Markdown input on the left, live rendered preview on the right using `react-markdown` + `remark-gfm`. Both formats stored in the database simultaneously to allow export back to Markdown.

### Decision 6 — Hosting Strategy

Recommended path: start with local Docker Compose + Cloudflare Tunnel (free, accessible anywhere), then migrate to Oracle Cloud Free Tier (permanently free, 4 CPU / 24GB RAM ARM VM) for always-on access, with Hetzner VPS (~$4/month) as the paid upgrade path if needed.

---

*✦ NEXUS Personal OS — Architecture & Design Document*
*Generated: March 25, 2026 | Next update: After Phase 1 backend scaffold*
