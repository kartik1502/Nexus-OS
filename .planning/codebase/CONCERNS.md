# Codebase Concerns: Nexus-OS

## Tech Debt & Challenges

| Concern | Impact | Action |
|---|---|---|
| **Missing Backend** | Broken app flows | Implement the Java/Spring Boot API. |
| **Next.js 16/React 19** | Latest-version stability | Monitor for potential breaking changes. |
| **Tailwind CSS 4.x** | New configuration pattern | Ensure proper setup with PostCSS. |
| **Auth** | Security | Implement Spring Security + JWT before production. |
| **Mobile UX** | User Experience | Regular audits using the `gsd-ui-review` workflow. |

## Technical Decisions (Under Discussion)

1. **Database:** PostgreSQL for relational data with JSONB for Tiptap docs.
2. **Editor:** Tiptap selected for rich text and slash command experience.
3. **Deployment:** Local Docker Compose vs. Oracle Cloud Free VM.
4. **Search:** PostgreSQL `tsvector` and `pg_trgm` vs. external Meilisearch.

## Scalability Concerns

- **File Storage:** Local disk is simple but might need MinIO for large-scale uploads.
- **Search:** Postgres handles thousands of docs, but Meilisearch/Elasticsearch might be needed for millions.
- **Session Management:** JWT is stateless but may need Redis for token blacklisting.
