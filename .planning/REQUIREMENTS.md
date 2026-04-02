# Project Requirements: Nexus-OS

Detailed requirements for the NEXUS Personal OS, mapping to the 3 core modules and underlying infrastructure.

## Infrastructure (INF)

- **REQ-INF-1:** Docker Compose setup for unified frontend, backend, and DB.
- **REQ-INF-2:** PostgreSQL 16 relational core for all modules.
- **REQ-INF-3:** Local disk / VPS volume for file uploads (`/uploads`).
- **REQ-INF-4:** Automated email alerting via Spring Mail + Gmail SMTP.

## Authentication & Security (AUTH)

- **REQ-AUTH-1:** JWT-based stateless authentication (Spring Security).
- **REQ-AUTH-2:** Login and Registration routes (Next.js client-side).
- **REQ-AUTH-3:** Role-based access control (Admin, Viewer).
- **REQ-AUTH-4:** Secure password hashing (bcrypt).

## Issues Tracker (ISS)

- **REQ-ISS-1:** Full CRUD for issues (title, description, status, priority).
- **REQ-ISS-2:** Kanban board UI with drag-and-drop Ready cards.
- **REQ-ISS-3:** List view with priority-based sorting and filtering.
- **REQ-ISS-4:** Status workflows (Backlog, Todo, In-Progress, In-Review, Done).

## Documentation Manager (DOC)

- **REQ-DOC-1:** Tiptap-based rich-text editor with convenient slash commands.
- **REQ-DOC-2:** Multi-format storage: JSONB (Rich-text) and Text (Markdown).
- **REQ-DOC-3:** Collapsible tree-based navigation for topics/projects.
- **REQ-DOC-4:** Full-text search over titles and content via PostgreSQL `tsvector`.

## Certification Manager (CERT)

- **REQ-CERT-1:** Track certifications with name, issuer, issue date, and expiry.
- **REQ-CERT-2:** Automated status tracking (Active, Expiring Soon, Expired).
- **REQ-CERT-3:** Automated daily expiry check via Spring `@Scheduled` job.
- **REQ-CERT-4:** File upload for certificate scans (PDF/Images).

## Dashboard & System (SYS)

- **REQ-SYS-1:** Unified dashboard with stat cards and recent activity feeds.
- **REQ-SYS-2:** Mobile-responsive design using Tailwind v4.
- **REQ-SYS-3:** Persistent dark/light mode toggle.
- **REQ-SYS-4:** Multi-user support (1–10 personal scale users).
