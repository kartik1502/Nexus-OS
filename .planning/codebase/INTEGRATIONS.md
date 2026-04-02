# Codebase Integrations: Nexus-OS

## Primary Integrations

| Integration | Library / Service | Purpose |
|---|---|---|
| **Iconography** | `lucide-react` | Unified SVG icon set for UI. |
| **Theming** | `next-themes` | Dark and light mode switching and persistence. |
| **Markdown Rendering** | `react-markdown` / `remark-gfm` | Rendering GFM-compliant markdown in Docs module. |
| **Date/Time** | `date-fns` | date manipulation and formatting. |
| **Classes** | `clsx` / `tailwind-merge` | Dynamic class merging and conflict resolution. |

## External Services (Planned)

| Service | Category | Use Case |
|---|---|---|
| **PostgreSQL** | Primary Database | Persistent storage for all relational and JSON data. |
| **Gmail SMTP** | Notifications | Automated email alerts for certification expiries. |
| **Tiptap** | Editor | Headless rich-text editor for Notion-like documentation. |

## Future Integrations

- **Cloudflare Tunnel:** Exposing local Docker deployment safely to the web.
- **Oracle Cloud Free Tier VM:** Target deployment platform for 24/7 uptime.
- **MinIO (Optional):** If local file storage needs scaling to object storage.
