---
wave: 3
depends_on: [02-PLAN.md]
files_modified:
  - "frontend/src/app/login/page.tsx"
  - "frontend/src/middleware.ts"
  - "frontend/src/lib/auth-util.ts"
autonomous: true
requirements: [REQ-AUTH-2]
---

# Plan: Frontend Auth Integration

<plan_objective>
Create a secure Next.js login interface connecting to the `/api/auth/login` backend endpoint. Implement Next.js App Router Middleware to restrict access to protected routes based on the presence of the `AUTH_TOKEN` cookie.
</plan_objective>

<verification_criteria>
- Submitting the login form successfully directs the user to the `/dashboard`.
- The `AUTH_TOKEN` is automatically managed strictly by cookies.
- Visiting `/dashboard` without `AUTH_TOKEN` redirects the visitor to `/login`.
</verification_criteria>

<must_haves>
- Uses Server Actions or standard fetch with `credentials: 'include'`.
- Login form has basic validation (email required, password required).
- Middleware protects all routes EXCEPT `/login`, `/`, `/_next`, `/favicon.ico`.
</must_haves>

<tasks>

<task>
<objective>Create Next.js Middleware</objective>
<read_first>
- frontend/package.json
- .planning/phases/02-auth-security-planned/02-CONTEXT.md
</read_first>
<action>
Create `frontend/src/middleware.ts`:
- Reads the request `cookies.get('AUTH_TOKEN')`.
- If missing and path is NOT `/login`, redirect to `/login`.
- If present and path IS `/login`, redirect to `/dashboard`.
- Exclude `api`, `_next/static`, `_next/image`, `favicon.ico` in the `matcher`.
</action>
<acceptance_criteria>
- ls frontend/src/middleware.ts exits 0
- grep "AUTH_TOKEN" frontend/src/middleware.ts exits 0
</acceptance_criteria>
</task>

<task>
<objective>Create Login UI (Page and Component)</objective>
<read_first>
- frontend/tailwind.config.ts (or frontend/src/app/layout.tsx to verify styling conventions)
</read_first>
<action>
Create `frontend/src/app/login/page.tsx`.
- Include a simple, clean centering container.
- Create a client form for Email and Password.
- Implement `onSubmit` that sends a `POST` to `/api/auth/login` configured with `credentials: 'include'`.
- On success (`res.ok`), use Next Router `router.push('/dashboard')`.
- On failure, show an error message state (e.g. "Invalid credentials").
- Ensure it aligns with Tailwind CSS guidelines.
</action>
<acceptance_criteria>
- ls frontend/src/app/login/page.tsx exits 0
- grep "POST" frontend/src/app/login/page.tsx exits 0
- grep "router.push" frontend/src/app/login/page.tsx exits 0
</acceptance_criteria>
</task>

</tasks>
