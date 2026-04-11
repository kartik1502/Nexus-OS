# CONVENTIONS.md - Nexus-OS Coding Conventions

## General Principles
- **Clean Code**: Prioritize readability and maintainability.
- **DRY (Don't Repeat Yourself)**: Extract common logic into utilities or services.
- **Separation of Concerns**: Keep business logic in services, data access in repositories, and UI logic in components.

## Backend (Spring Boot)
- **Naming Conventions**:
  - Classes: `PascalCase` (e.g., `IssueController`, `IssueService`)
  - Methods and Variables: `camelCase` (e.g., `getAllIssues`, `issueService`)
  - Packages: `lowercase` (e.g., `com.nexus.backend.controller`)
- **Controllers**:
  - Use `@RestController` and `@RequestMapping("/api/...")`.
  - Prefer constructor injection over field injection (`@Autowired`).
  - Use `ResponseEntity` to return appropriate HTTP status codes (200 OK, 201 Created, 404 Not Found, 400 Bad Request).
- **Services**:
  - Use an interface-and-implementation pattern (`Service` interface + `ServiceImpl` class).
  - Annotate implementation with `@Service`.
- **Entities**:
  - Use JPA annotations (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`).
  - Use Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`) to reduce boilerplate.

## Frontend (Next.js/React)
- **Naming Conventions**:
  - Components and Files: `PascalCase` or `kebab-case` for directories (e.g., `IssueCard.tsx`, `issues/page.tsx`).
  - Hooks and Variables: `camelCase` (e.g., `useIssues`, `isLoaded`).
- **Components**:
  - Prefer functional components and React hooks.
  - Use 'use client' directive for interactive components.
  - Organize components by feature under `src/components/{feature}/`.
- **Styles**:
  - Use Tailwind CSS for all styling.
  - Follow mobile-first responsive design.
- **API Communication**:
  - Centralize API logic in `src/lib/api.ts` or use dedicated service files.
  - Use `fetch` for data fetching, with proper error handling and loading states.
- **Types**:
  - Use TypeScript for all components and utilities.
  - Centralize common types in `src/lib/types.ts`.
