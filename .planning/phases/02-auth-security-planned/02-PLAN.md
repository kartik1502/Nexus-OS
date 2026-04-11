---
wave: 2
depends_on: [01-PLAN.md]
files_modified:
  - "backend/src/main/java/com/nexus/backend/security/JwtUtils.java"
  - "backend/src/main/java/com/nexus/backend/security/JwtAuthenticationFilter.java"
  - "backend/src/main/java/com/nexus/backend/security/SecurityConfig.java"
  - "backend/src/main/java/com/nexus/backend/security/CustomUserDetailsService.java"
  - "backend/src/main/java/com/nexus/backend/controller/AuthController.java"
  - "backend/src/main/java/com/nexus/backend/dto/LoginRequest.java"
autonomous: true
requirements: [REQ-AUTH-1, REQ-AUTH-2]
---

# Plan: Backend Security & JWT Endpoints

<plan_objective>
Implement the stateless Spring Security JWT filter chain that reads from an HTTP-only cookie (`AUTH_TOKEN`). Create the `/api/auth/login` endpoint that authenticates credentials and issues the token. This fulfills JWT Storage (D-02) and Session Strategy (D-03).
</plan_objective>

<verification_criteria>
- `/api/auth/login` issues an HTTP-only `AUTH_TOKEN` cookie upon valid credentials.
- Protected endpoints return `401 Unauthorized` without the cookie, and `200 OK` with a valid cookie.
- Token expires in 7 days.
</verification_criteria>

<must_haves>
- SecurityConfig strictly allows `/api/auth/login` and `/api/health` without auth.
- JwtAuthenticationFilter is positioned before UsernamePasswordAuthenticationFilter.
- Cookie properties: `HttpOnly = true`, `Path = /`, `Max-Age = 604800` (7 days), `SameSite = Strict`.
</must_haves>

<tasks>

<task>
<objective>Create Security Core Classes</objective>
<read_first>
- backend/pom.xml
- backend/src/main/java/com/nexus/backend/entity/User.java
- backend/src/main/java/com/nexus/backend/repository/UserRepository.java
</read_first>
<action>
1. Create `CustomUserDetailsService` implementing `UserDetailsService` that fetches `User` by email via `UserRepository`.
2. Create `JwtUtils`:
   - Configurable secret key (from `application.properties`, default valid base64 key).
   - Generates JWT encoding `email` and `role`. Expiration: 7 days.
   - Methods to extract email, validate signature, and retrieve claims from JWT.
3. Create `JwtAuthenticationFilter` extending `OncePerRequestFilter`:
   - Extract JWT from `Cookies::AUTH_TOKEN`.
   - If valid, load `UserDetails` and set `SecurityContextHolder.getContext().setAuthentication(...)`.
</action>
<acceptance_criteria>
- ls backend/src/main/java/com/nexus/backend/security/JwtUtils.java exits 0
- ls backend/src/main/java/com/nexus/backend/security/JwtAuthenticationFilter.java exits 0
- grep "Cookie\[\]" backend/src/main/java/com/nexus/backend/security/JwtAuthenticationFilter.java exits 0
</acceptance_criteria>
</task>

<task>
<objective>Create SecurityConfig</objective>
<read_first>
- backend/src/main/java/com/nexus/backend/security/JwtAuthenticationFilter.java
</read_first>
<action>
Create `SecurityConfig.java` utilizing `@EnableWebSecurity`:
- Configure `SecurityFilterChain`.
- Disable CSRF (`.csrf(AbstractHttpConfigurer::disable)`).
- Session Management to `STATELESS`.
- Authorize Requests: `/api/auth/login` -> permitAll. `/api/**` -> authenticated.
- Register `AuthenticationManager`, `AuthenticationProvider`, `PasswordEncoder` (`BCryptPasswordEncoder`).
- Add `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`.
</action>
<acceptance_criteria>
- grep "SessionCreationPolicy.STATELESS" backend/src/main/java/com/nexus/backend/security/SecurityConfig.java exits 0
- grep "BCryptPasswordEncoder" backend/src/main/java/com/nexus/backend/security/SecurityConfig.java exits 0
</acceptance_criteria>
</task>

<task>
<objective>Create AuthController (/api/auth/login)</objective>
<read_first>
- backend/src/main/java/com/nexus/backend/security/JwtUtils.java
</read_first>
<action>
Create `LoginRequest.java` record/DTO (`email`, `password`).
Create `AuthController.java`:
- `/api/auth/login` (POST).
- Injects `AuthenticationManager` and `JwtUtils`.
- On successful authentication, generates a token using `JwtUtils`.
- Adds `Set-Cookie` header to response.
  ```java
  ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", token)
          .httpOnly(true)
          .path("/")
          .maxAge(7 * 24 * 60 * 60)
          .sameSite("Strict")
          .build();
  return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, cookie.toString())
          .body(Map.of("message", "Logged in successfully"));
  ```
</action>
<acceptance_criteria>
- grep "ResponseCookie.from" backend/src/main/java/com/nexus/backend/controller/AuthController.java exits 0
- grep "\"AUTH_TOKEN\"" backend/src/main/java/com/nexus/backend/controller/AuthController.java exits 0
</acceptance_criteria>
</task>

</tasks>
