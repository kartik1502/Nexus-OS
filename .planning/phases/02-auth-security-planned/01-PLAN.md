---
wave: 1
depends_on: []
files_modified:
  - "backend/src/main/resources/db/migration/V1__create_users_table.sql"
  - "backend/src/main/resources/db/migration/V2__seed_admin.sql"
  - "backend/src/main/java/com/nexus/backend/entity/User.java"
  - "backend/src/main/java/com/nexus/backend/entity/Role.java"
  - "backend/src/main/java/com/nexus/backend/repository/UserRepository.java"
autonomous: true
requirements: [REQ-AUTH-3, REQ-AUTH-4]
---

# Plan: Backend Database & Entities

<plan_objective>
Create the relational schema for the `users` table via Flyway, seed an initial Admin user, and establish the Spring Data JPA entities. This addresses Data Isolation (D-05) foundation and Initial Admin Setup (D-04).
</plan_objective>

<verification_criteria>
- Flyway migrations execute cleanly on application startup.
- `User` and `Role` entities map successfully to the PostgreSQL table.
- Initial admin user is verifiable in the database.
</verification_criteria>

<must_haves>
- Uses `java.util.UUID` for user IDs.
- Password is a bcrypt hash.
- Email column is marked `UNIQUE`.
</must_haves>

<tasks>

<task>
<objective>Create Flyway migration scripts</objective>
<read_first>
- .planning/phases/02-auth-security-planned/02-CONTEXT.md
- backend/pom.xml
</read_first>
<action>
Create `backend/src/main/resources/db/migration/V1__create_users_table.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

Create `backend/src/main/resources/db/migration/V2__seed_admin.sql`:
```sql
-- Password is 'admin123' hashed with bcrypt (cost 10)
INSERT INTO users (id, email, password, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@nexus.local', '$2a$10$UoE3O4v.Kk0U2A0Y1hZl0OWP1/J1YhH1y2gOIMfC1x5rPzIHErXo2', 'ROLE_ADMIN')
ON CONFLICT (email) DO NOTHING;
```
</action>
<acceptance_criteria>
- ls backend/src/main/resources/db/migration/V1__create_users_table.sql exits 0
- ls backend/src/main/resources/db/migration/V2__seed_admin.sql exits 0
- grep "CREATE TABLE users" backend/src/main/resources/db/migration/V1__create_users_table.sql exits 0
</acceptance_criteria>
</task>

<task>
<objective>Create User and Role JPA Entities and Repository</objective>
<read_first>
- backend/pom.xml
- backend/src/main/resources/db/migration/V1__create_users_table.sql 
</read_first>
<action>
Create `backend/src/main/java/com/nexus/backend/entity/Role.java` (Enum: `ROLE_ADMIN`, `ROLE_USER`).
Create `backend/src/main/java/com/nexus/backend/entity/User.java` implementing `org.springframework.security.core.userdetails.UserDetails`:
- Mapped to `users` table. 
- Fields: `UUID id`, `String email`, `String password`, `Role role`.
- Implementation of UserDetails methods (using email for username).

Create `backend/src/main/java/com/nexus/backend/repository/UserRepository.java` extending `JpaRepository<User, UUID>`.
- Add `Optional<User> findByEmail(String email);`
</action>
<acceptance_criteria>
- ls backend/src/main/java/com/nexus/backend/entity/User.java exits 0
- ls backend/src/main/java/com/nexus/backend/repository/UserRepository.java exits 0
- grep "extends JpaRepository" backend/src/main/java/com/nexus/backend/repository/UserRepository.java exits 0
</acceptance_criteria>
</task>

</tasks>
