# Codebase Structure: Nexus-OS

## Directory Map

```text
nexus/
├── .agent/                    ← GSD workflow skills and system settings
├── .agents/                   ← Additional custom user skills
├── .planning/                 ← GSD project state, roadmap, and codebase map
├── docs/                      ← Project documentation and analysis reports
├── frontend/                  ← Next.js 16.2.1 + TypeScript
│   ├── .next/                 ← Next.js build artifacts
│   ├── public/                ← Static assets (icons, fonts, images)
│   ├── src/                   ← Application source code
│   │   ├── app/               ← App Router routes ( (auth), (main) folders )
│   │   ├── components/        ← Feature-based and UI components
│   │   │   ├── certifications/ ← Cert-specific components
│   │   │   ├── docs/          ← Documentation-specific components
│   │   │   ├── issues/        ← Issues tracker components
│   │   │   ├── layout/        ← Main app shell and navigation
│   │   │   └── ui/            ← Base UI primitives (buttons, inputs)
│   │   └── lib/               ← Shared utilities, hooks, constants
│   ├── next-env.d.ts          ← Next.js TypeScript definitions
│   ├── package.json           ← Project metadata and dependencies
│   ├── postcss.config.mjs     ← PostCSS configuration (Tailwind v4)
│   └── tsconfig.json          ← TypeScript configuration
└── progressctx/               ← Project progress context logs
```

## Key Files & Purpose

| File / Folder | Purpose |
|---|---|
| `frontend/src/app/(main)/page.tsx` | Main dashboard entry point. |
| `frontend/src/app/layout.tsx` | Global app layout (shared across all pages). |
| `frontend/src/components/theme-provider.tsx` | Dark/light mode configuration provider. |
| `NEXUS-Project-Documentation.md` | Core design document and architecture vision. |
| `docker-compose.yml` (Planned) | Unified orchestration for frontend, backend, and DB. |
