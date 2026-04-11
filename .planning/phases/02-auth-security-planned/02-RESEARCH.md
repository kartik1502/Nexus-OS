# Phase 2: Auth & Security (Planned) - Research

## Context
Implementing stateless authentication (JWT), Login/Register UI, and RBAC based on the user decisions in `02-CONTEXT.md`.

## Current State
- **Backend:** Spring Boot (Java 21) with `spring-boot-starter-security`. JWT dependencies (`io.jsonwebtoken` v0.12.5) and Flyway dependencies are already defined in `pom.xml`.
- **Frontend:** Next.js 16.2.1 App Router, React 19. Tailwind CSS v4. No specific Auth Library is configured, and none is needed since we are using plain HTTP-only cookies.
- **Routing/Infrastructure:** `nginx.conf` is already configured to route `/api/*` to the Spring Boot backend (`http://backend:8080`) and `/` to Next.js (`http://frontend:3000`). This simplifies CORS and cookie management because both the frontend and backend share the same origin.

## Backend Implementation Details
**Database Setup (Flyway):**
- We need a Flyway migration (e.g., `V1__create_users_table.sql`) to create the `users` table. 
- We need a seed script (e.g., `V2__seed_admin.sql`) to fulfill **D-04**, inserting the initial hardcoded administrator account with a bcrypt-hashed password.
- User entity needs fields: `id`, `email`, `password`, `role`.

**Spring Security Config:**
- Disable CSRF (since we use JWT with stateless sessions, though cookie storage changes the CSRF threat landscape. For this phase, we ensure Safe Methods or basic CSRF considerations, but usually stateless + SameSite cookie mitigates this). Actually, since we're using cookies instead of Authorization headers, Spring Security's default CSRF protection should probably be enabled or we must use `SameSite=Strict`. Given the Nginx setup, `SameSite=Strict` on the login cookie is sufficient for a personal OS.
- Session Management must be `STATELESS`.
- `/api/auth/login` must be permitAll.
- Implement a `JwtAuthenticationFilter` that reads the JWT from the `HttpOnly` cookie (e.g., `AUTH_TOKEN`), validates it, and sets the `SecurityContext`.

**JWT Cookie Handling:**
- The login endpoint should authenticate via `AuthenticationManager`, generate a 7-day token, and return it in a `Set-Cookie` header (`HttpOnly`, `Path=/`, `Max-Age=604800`, `SameSite=Strict`).

## Frontend Implementation Details
**Authentication Flow:**
- Client submits credentials to `/api/auth/login` via `fetch`.
- Nginx proxies this to the backend. The backend sets the `HttpOnly` cookie.
- Subsequent `fetch` requests from the Next.js client to `/api/*` will automatically include this cookie.

**Next.js Middleware:**
- We need a `middleware.ts` in Next.js to protect application routes (e.g., `/dashboard`, `/issues`, etc.) and redirect unauthenticated users to `/login`.
- The middleware can simply check for the presence of the `AUTH_TOKEN` cookie. If it's missing, redirect to `/login`.
- Since the JWT is signed by the backend, the frontend middleware cannot cryptographically verify it without the secret, but checking for its existence is sufficient for route protection since the backend will definitively reject invalid/expired tokens on data requests.

**Data Isolation:**
- Users can be purely isolated in future phases by ensuring every data entity has a `user_id` and all queries are strictly filtered by the authenticated user's ID. 

## Validation Architecture
- Backend: Unit test `JwtAuthenticationFilter` and `AuthenticationService`. Integration test `/api/auth/login` to verify the `Set-Cookie` header is returned correctly.
- Frontend: Cypress or Playwright test (or simple manual testing check) to ensure `/login` redirects to protected routes, and protected routes redirect to `/login` if unauthenticated.
- Security: Verify that `AUTH_TOKEN` is `HttpOnly` and cannot be accessed via `document.cookie`.
