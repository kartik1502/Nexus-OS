# INTEGRATIONS.md - Nexus-OS External Services & APIs

## Core System Integrations
- **PostgreSQL Database**:
  - **Role**: Primary data store for users, projects, and system data.
  - **Connection**: `jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:nexus}`.
  - **Management**: Flyway (automatic migrations on startup).
- **SMTP Server (Gmail)**:
  - **Role**: Sending system notifications, password resets, etc.
  - **Host**: `smtp.gmail.com` (Port 587).
  - **Authentication**: `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
  - **Properties**: TLS/SSL enabled via `spring.mail.properties.mail.smtp.starttls.enable`.

## Authentication & Security
- **JWT (JSON Web Tokens)**:
  - **Provider**: jjwt-api (io.jsonwebtoken).
  - **Purpose**: Stateless authentication for API endpoints.
  - **Config**: `JWT_SECRET` and `JWT_EXPIRY_MS`.
- **Spring Security**:
  - **Role**: RBAC (Role-Based Access Control) and security filter chain.

## Storage
- **Local File System**:
  - **Location**: `${UPLOAD_DIR:/uploads}`.
  - **Usage**: Storing user-uploaded documents and profile assets.

## Networking
- **Nginx Proxy**:
  - **Role**: Reverse proxy for frontend and backend, handling routing and SSL (if configured).
  - **Config**: Root `nginx.conf` and `docker-compose.yml`.
- **Docker Networking**:
  - **Role**: Internal communication between `backend`, `frontend`, and `db` services.
