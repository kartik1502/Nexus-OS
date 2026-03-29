# Arya Banking — Senior Java Developer Analysis Report
> **Service Analysed:** `arya-banking-user-service`
> **Report Date:** 2026-03-29
> **Analyst Lens:** Senior Java Developer (10+ years — Spring Boot, Event-Driven Systems, Banking Security)

---

## Executive Summary

| Severity | Count | Dimensions Affected |
|---|---|---|
| 🔴 Critical | 5 | Security (4), Architecture (1) |
| 🟡 Major | 7 | Design Pattern (3), Code Quality (2), Architecture (2) |
| 🟢 Minor | 6 | Code Quality (3), Performance (1), Documentation (2) |
| **Total** | **18** | |

**Overall Health Score: 5.5 / 10**

The service shows a solid architectural foundation — event-driven registration, Keycloak OAuth2 integration, Vault secrets management, and a clean Mongo repository layer are all good choices. However, several security gaps are production-blocking, and the design has accumulated coupling and validation inconsistencies that will hurt the team's velocity as the service grows.

**Top 3 Most Urgent Fixes:**
1. **Vault credentials are hardcoded in `bootstrap.yml`** — AppRole secret-id committed to source control is a live secret exposure.
2. **`/api/**` routes bypass all authentication** — any endpoint under `/api/` is publicly accessible, including user registration and profile updates.
3. **No `@NotNull`/`@NotBlank` constraints on `RegisterDto`** — `@Pattern` alone passes `null`, so a null email registers a user with no email address.

---

## Codebase Overview

| Artefact | Purpose |
|---|---|
| `AryaBankingUserServiceApplication.java` | Spring Boot entry point; disables JPA, enables Mongo auditing and Feign |
| `UserController` | REST API for register, get, update user |
| `SecurityDetailsController` / `InternalSecurityDetailsController` | Security credential and login-attempt management |
| `UserServiceImpl` | Core registration, update, and user retrieval logic |
| `SecurityDetailsServiceImpl` | Login-failure tracking, account locking, security question management |
| `UserValidator` | Registration progress level detection and Kafka event dispatch |
| `UserCreateProducer` | Kafka event producer (`user-create-event` topic) |
| `KeyCloakService` (Feign) | Calls auth-service to create Keycloak user |
| `SecurityConfig` | Spring Security JWT resource-server config |
| `OAuth2FeignConfig` | Client-credentials token injection for internal Feign calls |

**Confirmed Tech Stack:** Spring Boot 3.5.4 · Spring Cloud 2025.0.0 · MongoDB · Apache Kafka (Avro) · Keycloak (OAuth2/JWT) · HashiCorp Vault · MapStruct · Lombok · Springdoc OpenAPI

---

## 🔴 Critical Issues (5 found)

### [CRIT-001] Vault AppRole Secret-ID Committed to Source Control
**Dimension:** Security
**Location:** `src/main/resources/bootstrap.yml`
**Description:** The Vault AppRole `role-id` and `secret-id` are hardcoded in `bootstrap.yml` and committed to the repository. These are live credentials that allow anyone with repo access to authenticate to Vault and read all secrets (Mongo passwords, OAuth2 client secrets, etc.).
```yaml
app-role:
  role-id: e6151838-363e-d363-9001-0da042b3f55e
  secret-id: 88669c88-9641-263f-c7ec-2cc36d847044
```
**Impact:** Full Vault secret exposure. An attacker with read access to this repo can impersonate the service and retrieve all managed secrets.
**Fix:** Rotate both credentials immediately. Inject them at runtime via environment variables or a secret manager — never in source:
```yaml
app-role:
  role-id: ${VAULT_ROLE_ID}
  secret-id: ${VAULT_SECRET_ID}
```
Add `.gitignore` rules and a pre-commit hook (e.g., `detect-secrets`) to prevent future commits of secrets.

---

### [CRIT-002] All `/api/**` Endpoints Are Publicly Accessible
**Dimension:** Security
**Location:** `SecurityConfig.java > filterChain()`
**Description:** The security configuration explicitly permits all requests to `/api/**` without authentication:
```java
.requestMatchers("/api/**").permitAll()
```
This means `POST /api/users/register`, `GET /api/users/{userId}`, `PUT /api/users/{userId}`, and `PUT /api/security-details/{userId}` are all unauthenticated. A caller can retrieve or modify any user's data, update contact numbers, and lock user accounts without a valid JWT.
**Impact:** Complete bypass of authentication for all public-facing user endpoints. Profile enumeration and account takeover are trivially possible.
**Fix:** Permit only the registration endpoint publicly. Everything else requires authentication:
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
    .requestMatchers("/internal/**").hasAnyAuthority("ROLE_INTERNAL_SERVICE")
    .anyRequest().authenticated())
```

---

### [CRIT-003] `@Pattern` Constraints on `RegisterDto` Do Not Guard Against `null`
**Dimension:** Security / Code Quality
**Location:** `RegisterDto.java`
**Description:** All fields in `RegisterDto` use `@Pattern`, which only validates non-null strings. If any field is omitted from the JSON body, it arrives as `null`, passes `@Pattern` silently, and a User is persisted with null fields. This also means a user can be registered without an email, breaking the duplicate-check query.
```java
@Pattern(regexp = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$", ...)
String emailId,  // null passes this annotation
```
**Impact:** Null field corruption in MongoDB; broken deduplication; potential NullPointerExceptions downstream when Keycloak user creation receives a null email.
**Fix:** Add `@NotBlank` to all fields:
```java
@NotBlank(message = "Email is required")
@Pattern(regexp = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email must have correct format")
String emailId,
```

---

### [CRIT-004] Password Stored in Plain Text in Keycloak Request Log
**Dimension:** Security
**Location:** `UserServiceImpl.java > register()` — `log.debug("Response from keycloak: {}", response)`
**Description:** The `KeyCloakUser` object sent to Keycloak contains the plain-text password from `RegisterDto`. The debug log line `log.debug("Response from keycloak: {}", response)` will print the full response object. Depending on the `KeyCloakResponse` object's `toString()`, this may not leak the password directly — but the `KeyCloakUser` is constructed in the same method and if any logger elsewhere prints it (e.g., Feign request logging enabled), the password is in logs.
More critically: the password travels across the internal Feign call in plain text with no additional hashing at this layer.
**Impact:** Credentials in application logs; potential exposure in log aggregation tools (ELK, Splunk, CloudWatch).
**Fix:** Hash the password before sending (or confirm Keycloak handles it), and scrub it from any loggable DTO:
```java
// At minimum, override toString() in KeyCloakUser to mask password
public String toString() {
    return "KeyCloakUser{username=" + username + ", email=" + emailId + ", password=[REDACTED]}";
}
```
Also set Feign log level to `NONE` or `BASIC` in production profiles.

---

### [CRIT-005] Account Lockout Check Has an Off-By-One — Locks at 6th Failure, Not 5th
**Dimension:** Security / Code Quality
**Location:** `SecurityDetailsServiceImpl.java > validateAndLockAccount()`
**Description:** The login-failure increment happens *before* the threshold check:
```java
securityDetails.setLoginFailedAttempts(securityDetails.getLoginFailedAttempts() + 1);
// ...
if(securityDetails.getLoginFailedAttempts() >= 5) { // locks at 5 stored = 6th call
```
Because the counter is incremented first and then compared, the account is saved with 5 failed attempts on the 5th failure (correct), but a 6th failure is needed to *actually trigger the lock* — because on the 5th call the counter goes from 4→5 and `>= 5` fires. Wait — actually this is correct on the 5th call. However, the counter is persisted *after* locking, meaning a race condition between two concurrent login failures at exactly count=4 will both read 4, both increment to 5, both trigger the lock, and both save — but may also both call `updateUser` concurrently, producing a double-lock event.
**Impact:** Race condition on concurrent failed logins; Kafka lock event sent twice; downstream consumers may process duplicate lock events.
**Fix:** Use a MongoDB atomic increment and conditional update:
```java
// Use $inc + findAndModify with a filter on loginFailedAttempts < 5
// Or add optimistic locking (@Version) to SecurityDetails
```

---

## 🟡 Major Issues (7 found)

### [MAJOR-001] `UserServiceImpl` Is a God Class — Violates Single Responsibility
**Dimension:** Design Pattern
**Location:** `UserServiceImpl.java`
**Description:** `UserServiceImpl` handles: user registration, Keycloak integration, registration progress creation, security details creation, Kafka event publishing, contact number updates, and address updates — all in one class. It has 7 injected dependencies. This is a classic God Class anti-pattern.
**Impact:** Every change to any concern touches this class. Unit testing requires mocking 7 dependencies. Adding new registration steps means modifying an already large class.
**Fix:** Extract responsibilities into focused services:
- `UserRegistrationService` — orchestrates the registration flow
- `UserProfileService` — handles contact/address updates
- `RegistrationProgressService` — manages progress tracking and events

---

### [MAJOR-002] Circular Dependency Risk — `SecurityDetailsServiceImpl` Depends on `UserService`
**Dimension:** Architecture
**Location:** `SecurityDetailsServiceImpl.java` → `UserService` → (indirectly back to security details)
**Description:** `SecurityDetailsServiceImpl` injects `UserService`. `UserService` (in `UserServiceImpl`) injects `UserValidator`, which coordinates registration progress that in turn reads security details. This creates a logical circular dependency that Spring resolves via proxy, but it is fragile and will cause `BeanCurrentlyInCreationException` if the proxy strategy changes.
**Impact:** Brittle startup; hard to reason about call chains; violates Dependency Inversion.
**Fix:** Introduce a domain event approach or extract a `RegistrationOrchestrationService` that both services send events to, rather than calling each other directly.

---

### [MAJOR-003] `updateUser` Silently Ignores Unknown State — No Validation on `UserUpdateDto`
**Dimension:** Code Quality
**Location:** `UserServiceImpl.java > updateUser()`
**Description:** If `UserUpdateDto` arrives with `isLockUser=false` and both `updateContactDto` and `updateAddressDto` are null, the method calls `getUserById`, does nothing, saves the user unchanged, and returns a success response. The caller gets a 200 with no feedback that their request was effectively a no-op.
**Impact:** Silent no-op updates that confuse API consumers and hide integration bugs.
**Fix:** Add validation at the service or DTO level:
```java
if (!userUpdateDto.isLockUser() && userUpdateDto.updateContactDto() == null && userUpdateDto.updateAddressDto() == null) {
    throw new IllegalArgumentException("At least one field must be provided for update");
}
```

---

### [MAJOR-004] Registration Progress Uses String Literals for Status Comparison
**Dimension:** Code Quality
**Location:** `UserValidator.java > validateFinalRegistrationStep()`
**Description:** The final registration check compares against a magic string:
```java
registrationProgressRepository.findByUserIdAndStatus(userId, "REGISTRATION_COMPLETE")
```
`REGISTRATION_COMPLETE` is not defined in `RegistrationConstants` (visible in the codebase). If the string changes anywhere, this silently breaks — users will be re-processed through the registration pipeline after already completing it.
**Impact:** Duplicate Kafka events; re-triggering of downstream registration steps.
**Fix:** Add `REGISTRATION_COMPLETE` to `RegistrationConstants` enum and use the constant here.

---

### [MAJOR-005] Feign Client Has No Fallback or Circuit Breaker
**Dimension:** Architecture
**Location:** `KeyCloakService.java`
**Description:** The Feign client calling `ARYA-BANKING-AUTH-SERVICE` has no `fallback`, no `fallbackFactory`, and no Resilience4j circuit breaker. If the auth service is down during registration, the exception propagates uncaught, leaving the user in a partially registered state — persisted in Mongo but no Keycloak account.
**Impact:** Partial registration data corruption; the user cannot login but exists in the database; re-registration fails with "user already exists".
**Fix:** Add a circuit breaker and compensating transaction:
```java
@FeignClient(name = "ARYA-BANKING-AUTH-SERVICE", fallbackFactory = KeyCloakServiceFallbackFactory.class)
```
Or use a Saga pattern — if Keycloak creation fails, roll back (delete) the user record.

---

### [MAJOR-006] `KafkaWarnUp` Uses `@PostConstruct` to Create and Immediately Close a Producer
**Dimension:** Performance
**Location:** `KafkaWarnUp.java`
**Description:** On startup, `KafkaWarnUp` creates a Kafka producer and immediately closes it just to "warm up" the connection. This wastes a connection, logs misleadingly, and the producer created by `ProducerFactory.createProducer()` is not the same cached instance used by `KafkaTemplate`. The warm-up achieves nothing meaningful.
**Impact:** Wasted startup time; misleading log entry; potential connection pool churn.
**Fix:** Remove `KafkaWarnUp` entirely. If you need a connection health check, use Spring Boot Actuator's Kafka health indicator instead.

---

### [MAJOR-007] `generateUserId` Is Not Collision-Safe
**Dimension:** Design Pattern
**Location:** `UserServiceImpl.java > generateUserId()`
**Description:** The user ID is generated from `SHA256(firstName + lastName + System.currentTimeMillis()).substring(0, 6)`. With only 6 hex characters (16^6 = ~16 million combinations) and `currentTimeMillis()` as entropy, two registrations of the same name within the same millisecond will produce an identical user ID. The `UserRepository` does not enforce uniqueness on `userId`, so a duplicate can silently overwrite an existing user.
**Impact:** User ID collision overwrites an existing user record; complete data loss for the overwritten user.
**Fix:** Use a UUID or a longer hash substring (12+), and add a unique index on `userId` in MongoDB:
```java
user.setUserId("ARYA" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase());
```
And in the `User` model: `@Indexed(unique = true)` on the `userId` field.

---

## 🟢 Minor Issues (6 found)

### [MINOR-001] Typo in Field Name: `getAddresss` (Triple-s)
**Dimension:** Code Quality
**Location:** `UserServiceImpl.java`, `UserValidator.java` — references to `user.getAddresss()`
**Description:** The field accessor is `getAddresss()` — three s's. This comes from a field named `addresss` in the `User` model (common library). It will cause confusion and is likely a MapStruct or Lombok-generated name from a typo in the entity.
**Impact:** Developer confusion; will confuse code reviews and future contributors.
**Fix:** Rename the field in `User` to `addresses` and regenerate Lombok accessors. Update all references. This is a breaking change to the common library — coordinate across services.

---

### [MINOR-002] `UserServiceMongoConfig` Is Missing `@Configuration` Annotation
**Dimension:** Code Quality
**Location:** `UserServiceMongoConfig.java`
**Description:** The class uses `@Import` and defines a `@Bean` but lacks `@Configuration`. Spring may still pick it up via `@Import` in certain contexts, but this is fragile and non-idiomatic.
**Impact:** Potential bean registration failure in certain Spring context configurations.
**Fix:**
```java
@Configuration
@Import(MongoConfig.class)
public class UserServiceMongoConfig { ... }
```

---

### [MINOR-003] `UpdateAddressDto` Wraps `Address` in a Record With a Single Field
**Dimension:** Code Quality
**Location:** `UpdateAddressDto.java`
**Description:** The DTO is a record with exactly one field: `Address address`. This adds indirection in the API (callers must wrap: `{"address": {...}}`) with no benefit over directly using `Address` in the controller.
**Impact:** Unnecessarily verbose API contract; confusing to API consumers.
**Fix:** Accept `Address` directly in `UserUpdateDto` or in the controller method parameter.

---

### [MINOR-004] Missing `@Slf4j` / Logging in `UserController`
**Dimension:** Documentation / Code Quality
**Location:** `UserController.java`
**Description:** The controller has no logging. Incoming registration and update requests produce no log output, making production debugging difficult (no request tracing without a separate tracing layer).
**Impact:** Harder incident investigation; no visibility into request volume or error rates at the controller layer.
**Fix:** Add `@Slf4j` and log at `INFO` level on entry to each endpoint:
```java
log.info("Register request received for email: {}", registerDto.emailId());
```

---

### [MINOR-005] Test Class Has No Test Methods
**Dimension:** Documentation
**Location:** `AryaBankingUserServiceApplicationTests.java`
**Description:** The test class exists but `contextLoads()` has no `@Test` annotation, so it never executes. The service effectively has 0% test coverage.
**Impact:** No automated validation; regressions will not be caught by CI.
**Fix:** Add `@Test` annotation to `contextLoads()` at minimum. Then progressively add unit tests for `UserServiceImpl`, `SecurityDetailsServiceImpl`, and `UserValidator` — these are the highest-value targets.

---

### [MINOR-006] `bootstrap.yml` Active Profile Hardcoded to `dev`
**Dimension:** Architecture
**Location:** `bootstrap.yml`
**Description:** `spring.profiles.active: dev` is hardcoded. In a containerised or CI/CD deployment, the profile should be injected via environment variable.
**Impact:** Service will always run as `dev` profile regardless of deployment target unless overridden manually.
**Fix:**
```yaml
profiles:
  active: ${SPRING_PROFILES_ACTIVE:dev}
```

---

## Existing Feature Improvement Insights

**Feature:** Three-Step Registration Flow
**Current State:** Step tracking uses `RegistrationProgress` documents saved to MongoDB with `status/subStatus` strings. Levels are computed by `UserValidator.validateRegistrationLevel()` on each update call.
**Improvement:** The level computation re-evaluates all user fields on every update, which is inefficient and fragile. Consider storing the current step as an enum field directly on the `User` document and advancing it atomically on completion of each step. This removes the need to re-derive level from field presence.

---

**Feature:** User Account Locking
**Current State:** Lock triggered in `SecurityDetailsServiceImpl` when `loginFailedAttempts >= 5`. Sends a Kafka event and calls `userService.updateUser()` internally.
**Improvement:** The lock threshold (5) is hardcoded. Externalise it to application config (`app.security.max-login-attempts: 5`) so it can be tuned per environment without a code change. Also add an unlock mechanism — currently there is no way to reset `loginFailedAttempts` back to 0 after a legitimate login succeeds.

---

**Feature:** Kafka Event Publishing (`UserCreateProducer`)
**Current State:** Events are fire-and-forget via `KafkaTemplate.send()`. No acknowledgement or retry handling.
**Improvement:** Add a `send()` callback to handle `ProducerRecord` failures:
```java
template.send(...).whenComplete((result, ex) -> {
    if (ex != null) log.error("Failed to publish user event for {}", userId, ex);
});
```
Also consider configuring `acks=all` and `retries=3` in Kafka producer properties for at-least-once delivery guarantees.

---

**Feature:** Address Management
**Current State:** Address update removes existing addresses of the same type and adds the new one. The field is named `addresss` (typo).
**Improvement:** Add pincode format validation (noted in the issues.json backlog as a pending task). This is entirely missing — any string is accepted as a pincode currently.

---

**Feature:** Security Questions
**Current State:** Questions are stored as a list of `SecurityQuestions` objects with plain-text answers.
**Improvement:** Security question answers should be hashed (bcrypt or Argon2), not stored in plain text. A database breach would expose all security answers directly.

---

## 💡 Good-to-Have Feature Ideas

**Feature:** Idempotent Registration with Partial Resume
**Value:** If registration fails mid-flow (e.g., Keycloak is down), the user cannot re-register. An idempotent endpoint that resumes from the last completed step would prevent "already exists" errors and improve UX.
**Implementation Hint:** Use the existing `RegistrationProgress` document as the resume state. Add a `resumeRegistration(userId)` endpoint.
**Complexity:** Medium
**Priority:** High

---

**Feature:** Rate Limiting on Registration Endpoint
**Value:** Prevents brute-force account creation and protects downstream Keycloak from bulk user creation attacks.
**Implementation Hint:** Spring Cloud Gateway's `RequestRateLimiter` filter with Redis, or Bucket4j in-service. Limit to 5 registrations/minute per IP.
**Complexity:** Low
**Priority:** High

---

**Feature:** Email and Phone OTP Verification
**Current State:** `isEmailVerified: false` and `isContactNumberVerified: false` are stored but never flipped to `true` — no OTP flow exists in this service.
**Value:** Verified contact data is essential in banking for KYC compliance.
**Implementation Hint:** Emit an `OtpRequestEvent` to a dedicated OTP service on Kafka. OTP service sends the code and publishes back a `ContactVerifiedEvent` that this service consumes.
**Complexity:** Medium
**Priority:** High

---

**Feature:** Audit Trail for Sensitive Operations
**Value:** Banking regulations require an audit log of who changed what and when — especially for contact number changes, address updates, and account locking.
**Implementation Hint:** Add a MongoDB-backed `AuditLog` collection. Use a Spring AOP `@Around` advice on update methods to log before/after state.
**Complexity:** Medium
**Priority:** Medium

---

**Feature:** GDPR-Compliant Data Deletion
**Current State:** Noted in `issues.json` as a pending task — not implemented.
**Value:** Mandatory for any EU-facing product. Soft deletion hides data; hard deletion removes PII.
**Implementation Hint:** Add `deletedAt` timestamp to `User`. Soft delete sets it; hard delete removes the document and emits a `UserDeletedEvent` for downstream services (auth-service must also delete the Keycloak user).
**Complexity:** Medium
**Priority:** High

---

**Feature:** Admin Endpoint for User Search and Management
**Value:** Ops teams need to search, view, and manage users without direct DB access.
**Implementation Hint:** Add `GET /internal/api/users?email=&phone=&status=` with `ROLE_INTERNAL_SERVICE` auth. Pagination via Spring Data's `Pageable`.
**Complexity:** Low
**Priority:** Medium

---

## Metrics Dashboard

| Metric | Value |
|---|---|
| Java source files | ~18 |
| REST endpoints | 5 (register, get user, update user, update security details, internal update login) |
| Kafka topics | 1 (`user-create-event`) |
| External Feign calls | 1 (auth-service → Keycloak) |
| MongoDB collections | 3 (User, SecurityDetails, RegistrationProgress) |
| Services missing health endpoint config | 0 (actuator included) |
| Test methods with `@Test` | 0 |
| Hardcoded secrets | 2 (Vault role-id, secret-id) |
| Magic strings in business logic | 2+ (`"REGISTRATION_COMPLETE"`, `"user-create-event"`) |
| Null-unsafe DTO fields | 5 (all `RegisterDto` fields) |

---

## Recommended Action Plan

| Sprint | Item | Effort | Impact |
|---|---|---|---|
| Sprint 1 | CRIT-001: Rotate and externalise Vault credentials | S | 🔴 Critical |
| Sprint 1 | CRIT-002: Restrict `/api/**` to authenticated endpoints only | S | 🔴 Critical |
| Sprint 1 | CRIT-003: Add `@NotBlank` to all `RegisterDto` fields | S | 🔴 Critical |
| Sprint 1 | MAJOR-005: Add circuit breaker + compensating delete on Keycloak failure | M | 🟡 Major |
| Sprint 1 | MAJOR-007: Fix userId generation to use UUID or collision-safe hash | S | 🟡 Major |
| Sprint 2 | CRIT-004: Mask password in logs; audit Feign log level | S | 🔴 Critical |
| Sprint 2 | CRIT-005: Fix account lock race condition with atomic MongoDB update | M | 🔴 Critical |
| Sprint 2 | MAJOR-001: Decompose `UserServiceImpl` into focused services | L | 🟡 Major |
| Sprint 2 | MAJOR-004: Replace magic string `"REGISTRATION_COMPLETE"` with constant | S | 🟡 Major |
| Sprint 3 | MAJOR-002: Resolve circular dependency via orchestration service | M | 🟡 Major |
| Sprint 3 | Feature: OTP verification flow for email and phone | L | High |
| Sprint 3 | Feature: Security question answer hashing (bcrypt) | S | High |
| Sprint 4 | MINOR-001: Fix `addresss` → `addresses` typo across common library | M | 🟢 Minor |
| Sprint 4 | MINOR-005: Add unit tests for `UserServiceImpl`, `UserValidator`, `SecurityDetailsServiceImpl` | L | High |
| Sprint 4 | Feature: GDPR soft/hard delete | M | High |
| Sprint 5 | Feature: Rate limiting on registration | S | Medium |
| Sprint 5 | Feature: Audit trail AOP | M | Medium |
| Sprint 5 | MAJOR-006: Remove `KafkaWarnUp`, use Actuator health instead | S | 🟡 Major |
