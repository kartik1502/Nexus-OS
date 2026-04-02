# ✦ NEXUS Personal OS

**Eliminate SaaS silos. Own your engineering productivity.**
Nexus-OS is a high-performance, self-hosted personal productivity ecosystem designed to replace expensive subscription-based tools. It provides a unified platform for issue tracking, documentation management, and certification tracking.

---

## 🚀 Key Modules

- **Issues Tracker:** A high-performance issue tracker with Kanban and list views, priorities, and status workflows.
- **Docs Manager:** A comprehensive documentation manager featuring a Tiptap-based rich-text editor and search.
- **Cert Manager:** A tool to track professional certifications with expiry countdowns and automated email alerts.
- **Engineering Dashboard:** A unified overview and recent activity feed for your entire personal ecosystem.

## 🛠️ Architecture & Tech Stack

Nexus-OS uses a standard three-tier architecture optimized for self-hosting:

- **Frontend:** Next.js 16.2.1 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui.
- **Backend:** Java 21, Spring Boot 3.4.1 (Spring Security + JWT), PostgreSQL 16.
- **Persistence:** PostgreSQL with JSONB support for rich-text and Flyway for schema management.
- **Orchestration:** Docker Compose + Nginx Reverse Proxy.

## 🛰️ Getting Started (Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- JDK 21+ (Optional for local development)
- Maven (Optional for local development)

### 1. Configure the Environment
Copy the example environment file and update your variables:
```bash
cp .env.example .env
```

### 2. Launch with Docker
```bash
docker-compose up -d --build
```
The app will be available at:
- **Frontend / Proxy:** [http://localhost](http://localhost)
- **Backend API:** [http://localhost/api](http://localhost/api) (via Nginx)
- **Postgres:** `localhost:5432`

## 🏗️ Development Context (GSD)

This project is managed using the **GSD (Get Shit Done)** workflow. All project decisions, requirements, and roadmaps are stored in the [`.planning/`](file:///c:/Users/HP/OneDrive/Documents/Nexus-OS/.planning/) directory.

- **[PROJECT.md](file:///c:/Users/HP/OneDrive/Documents/Nexus-OS/.planning/PROJECT.md):** Unified project vision and architectural design.
- **[REQUIREMENTS.md](file:///c:/Users/HP/OneDrive/Documents/Nexus-OS/.planning/REQUIREMENTS.md):** Detailed technical requirements.
- **[ROADMAP.md](file:///c:/Users/HP/OneDrive/Documents/Nexus-OS/.planning/ROADMAP.md):** Phased execution roadmap.

---
Built with ❤️ by **Antigravity AI**.
Dedicated to personal-scale engineering excellence.
