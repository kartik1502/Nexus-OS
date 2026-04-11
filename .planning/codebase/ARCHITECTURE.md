# ARCHITECTURE.md - Nexus-OS System Architecture

## System Overview
Nexus-OS is a full-stack application with a Java/Spring Boot backend and a Next.js/React frontend. It follows a decoupled architecture where the frontend communicates with the backend via a RESTful API.

## Backend Architecture (Spring Boot)
The backend follows a classic **Layered Architecture**:
1.  **Controller Layer**: Handles HTTP requests, maps them to service methods, and returns responses. (e.g., `AuthController`, `IssueController`)
2.  **DTO (Data Transfer Object)**: Defines the data structures for API requests and responses. (e.g., `LoginRequest`)
3.  **Service Layer**: Contains business logic and orchestrates data flow. (e.g., `AuthServiceImpl`, `IssueServiceImpl`)
4.  **Repository Layer**: Handles data persistence and retrieval using Spring Data JPA. (e.g., `UserRepository`, `IssueRepository`)
5.  **Entity Layer**: Represents the database schema as Java objects. (e.g., `User`, `Issue`, `Role`)
6.  **Security Layer**: Manages authentication and authorization using Spring Security and JWT. (e.g., `JwtAuthenticationFilter`, `SecurityConfig`)

## Frontend Architecture (Next.js)
The frontend uses the **Next.js App Router** with the following design patterns:
- **Route Groups**: Organizes routes logically without affecting the URL structure (e.g., `(auth)`, `(dashboard)`, `(main)`).
- **Component-Based UI**: UI is broken down into reusable components, organized by feature (e.g., `components/issues`, `components/ui`).
- **Shared Utilities**: Common logic, API clients, and type definitions are centralized in `src/lib`.
- **Stateless Authentication**: Uses JWTs stored in the browser (likely handled via `middleware.ts` and `auth-util.ts`).

## Data Flow
1.  **User Interaction**: User interacts with the Next.js frontend.
2.  **API Request**: Frontend sends an authenticated (JWT) request to the Nginx proxy.
3.  **Proxying**: Nginx routes the request to the Spring Boot backend service.
4.  **Security Filter**: Backend security filter validates the JWT and sets the security context.
5.  **Controller**: The appropriate controller receives and processes the request.
6.  **Business Logic**: Service layer executes the necessary business logic, interacting with the database via the repository.
7.  **Response**: The result is returned as a JSON response to the frontend, which updates the UI.
