# Phase 2: Auth & Security (Planned) - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementing stateless authentication and authorization. This includes configuring the Spring Security context, JWT filter, integrating Next.js client-side Login & Registration routes, and establishing Role-Based Access Control (RBAC).
</domain>

<decisions>
## Implementation Decisions

### Registration Flow
- **D-01:** Invite-only / Manual user creation. No open public signup to prevent unauthorized access.

### JWT Storage
- **D-02:** Store JWTs in HTTP-only cookies to prevent XSS attacks while maintaining a stateless backend.

### Session Strategy
- **D-03:** Long-lived single tokens (e.g., 7-day expiration) to simplify implementation; no refresh token rotation necessary due to the personal-scale user base.

### Initial Setup
- **D-04:** The initial Administrator account is created via DB seed (e.g., Flyway script or startup bean).

### Data Isolation
- **D-05:** Complete data isolation. Each user only sees and interacts with their own data.

### the agent's Discretion
- Login screen visual design and layout.
- Precise implementation details of the Spring Security filter chain.
- Handling of expired token UX on the Next.js client.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` — REQ-AUTH-1 through REQ-AUTH-4 (JWT stateless, Next.js routes, RBAC, bcrypt).

</canonical_refs>

<specifics>
## Specific Ideas

No specific requirements — open to standard secure approaches for Spring Security and Next.js.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 02-auth-security-planned*
*Context gathered: 2026-04-11*
