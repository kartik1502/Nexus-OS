# STACK.md - Nexus-OS Technology Stack

## Core Technologies
- **Backend**:
  - **Java**: 21
  - **Framework**: Spring Boot 3.4.1
  - **Build Tool**: Maven (as specified in `backend/pom.xml`)
  - **ORM**: Spring Data JPA with Hibernate
  - **Security**: Spring Security 6+
  - **Authentication**: JWT (io.jsonwebtoken:jjwt 0.12.5)
  - **Validation**: Spring Boot Validation (Hibernate Validator)
  - **Mailing**: Spring Boot Starter Mail
  - **Database Migrations**: Flyway 10+
- **Frontend**:
  - **Framework**: Next.js 16.2.1 (using App Router as specified in `frontend/src/app`)
  - **Library**: React 19.2.4
  - **Language**: TypeScript 5
  - **Styling**: Tailwind CSS 4, PostCSS, Lucide React
  - **State/UI**: dnd-kit (drag-and-drop), React Markdown
- **DevOps**:
  - **Containerization**: Docker, Docker Compose (multi-stage builds in `Dockerfile`s)
  - **Proxy/Server**: Nginx (configured in `nginx.conf`)

## Database & Storage
- **Primary Database**: PostgreSQL 15+ (runtime driver in backend)
- **Local Storage**: Filesystem-based uploads (configured in `application.yml`)

## Utilities
- **Backend Utilities**: Lombok (for boilerplate reduction)
- **Frontend Utilities**: clsx, date-fns, next-themes
