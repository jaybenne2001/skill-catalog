# CLAUDE.md

This file provides guidance for AI assistants working on the Skill Catalog codebase.

## Project Overview

Skill Catalog is a Next.js web application that performs **capability-based skill analysis** for resume-to-job matching. Instead of simple keyword matching (like traditional ATS systems), it maps individual technologies to root capabilities (e.g., both Python and Go map to "scripting logic"), revealing hidden transferable value.

**Author:** Jay Bennett
**Live URL:** Hosted on AWS Amplify (auto-deploys from `main`)

## Tech Stack

- **Framework:** Next.js 14.2.18 with App Router
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 3.4.1 with HSL-based CSS custom properties for theming
- **Icons:** Lucide React
- **Charts:** Custom SVG implementations (Sankey diagrams, Radar charts)
- **Deployment:** AWS Amplify (CI/CD on push to `main`)
- **Backend:** AWS Lambda for chart generation
- **No testing framework is currently configured**

## Commands

```bash
npm run dev       # Start development server on localhost:3000
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Next.js linting (ESLint)
```

There are no test commands configured.

## Project Structure

```
skill-catalog/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with nav bar (Inter font, global nav)
│   ├── page.tsx                  # Home page (redirects to /skill-topology)
│   ├── globals.css               # Tailwind directives + CSS custom properties
│   ├── api/                      # API route handlers
│   │   ├── analyze/route.ts      # POST - Main analysis (calls Lambda)
│   │   ├── scrape-job/route.ts   # POST - Job posting URL scraper
│   │   └── scrape-linkedin/route.ts  # POST - LinkedIn profile scraper
│   └── skill-topology/           # Main feature area
│       ├── page.tsx              # Landing page (methodology explanation)
│       ├── analyze/page.tsx      # Analysis form (client component)
│       ├── demo/page.tsx         # Demo results with sample data
│       └── results/page.tsx      # Results display (reads sessionStorage)
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx            # Button with variant system (CVA)
│   │   ├── card.tsx              # Card wrapper
│   │   ├── input.tsx             # Text input
│   │   └── textarea.tsx          # Multi-line input
│   └── skill-topology/
│       └── charts.tsx            # SankeyChart + RadarChart (custom SVG)
├── lib/
│   ├── skill-matcher.ts          # Core matching algorithm + data structures
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── public/images/                # Static assets
├── .github/workflows/deploy.yml  # GitHub Actions (triggers Amplify)
├── deploy.sh                     # Manual deployment script
├── tailwind.config.ts            # Tailwind theme (HSL colors, container)
├── tsconfig.json                 # TypeScript config (strict, path aliases)
└── postcss.config.mjs            # PostCSS (Tailwind + Autoprefixer)
```

## Architecture & Data Flow

### Request Flow

1. User provides resume text + job description on `/skill-topology/analyze`
2. Optional: Scrape from URL via `/api/scrape-job` or `/api/scrape-linkedin`
3. Client sends POST to `/api/analyze` with `{ resumeText, jobDescription }`
4. API route extracts skills, calls AWS Lambda for chart generation
5. Results stored in `sessionStorage` as JSON
6. Client navigates to `/results`, which reads from `sessionStorage`

### Core Algorithm (`lib/skill-matcher.ts`)

- `CAPABILITY_MAP` — Maps 75+ technologies to root capabilities
- `CAPABILITY_AXES` — 8 capability dimensions for radar charts
- `extractTechs(text)` — Regex-based tech extraction from free text
- `extractTechCounts(text)` — Counts occurrences per technology
- `getCapabilities(techs)` — Maps tech list to capability set
- `analyzeMatch(jobDescription, resumeText)` — Full analysis producing:
  - Keyword match % and capability match %
  - Delta (hidden value = capability - keyword)
  - Gap analysis, ATS priority ranking
  - Transfer map (missing tech -> related resume tech)
  - Risk flags for hard requirements
  - Sankey and radar visualization data

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/analyze` | POST | Main analysis; calls Lambda for charts |
| `/api/scrape-job` | POST | Scrapes job posting HTML from URL |
| `/api/scrape-linkedin` | POST | Scrapes LinkedIn profile from URL |

### External Dependencies

- **Lambda endpoint:** `https://1k8m52a28i.execute-api.us-east-1.amazonaws.com/default/skill-topology-analyzer`
  - Input: `{ skills: string[], job_description: string }`
  - Output: `{ sankey_chart, radar_chart, skill_mapping }`

## Code Conventions

### File & Naming

- **Components:** PascalCase (`SankeyChart`, `RadarChart`)
- **Files/directories:** kebab-case (`skill-matcher.ts`, `skill-topology/`)
- **Variables/functions:** camelCase (`extractTechs`, `jobDescription`)
- **Constants:** UPPER_SNAKE_CASE (`CAPABILITY_MAP`, `CAPABILITY_AXES`)
- **Types/interfaces:** PascalCase (`CapabilityMap`, `SankeyNode`)

### Component Patterns

- Functional components throughout (arrow functions or function declarations)
- `'use client'` directive for components requiring client-side interactivity
- `React.forwardRef` for UI components that accept refs (button, input, textarea)
- Props typed via interfaces extending native React HTML element types
- `cn()` utility from `lib/utils.ts` for conditional Tailwind class merging

### Styling

- Tailwind utility classes for all layout and styling
- CSS custom properties (HSL values) defined in `globals.css` for theming
- Component variants via `class-variance-authority` (see `button.tsx`)
- Inline SVG for custom chart visualizations
- Container: centered, 2rem padding, max 1400px

### State Management

- No global state library — uses React built-in patterns only
- `useState` for local component state
- `sessionStorage` for cross-page data persistence (analysis results)
- URL query parameters as fallback for results page

### Import Style

- Path alias `@/*` maps to project root (configured in `tsconfig.json`)
- Always use `@/components/...`, `@/lib/...` instead of relative paths
- Destructured imports preferred
- TypeScript `type` keyword used for type-only imports

### Error Handling

- Try-catch blocks in all API routes
- `NextResponse.json()` with appropriate HTTP status codes
- Client-side error state via `useState` with error message display
- `console.error()` for server-side debugging

## Key Files to Understand

| File | Why It Matters |
|---|---|
| `lib/skill-matcher.ts` | Core business logic — capability mapping and analysis algorithm |
| `app/api/analyze/route.ts` | Main API endpoint orchestrating skill extraction and Lambda calls |
| `components/skill-topology/charts.tsx` | Custom SVG Sankey and Radar chart implementations |
| `app/skill-topology/analyze/page.tsx` | Primary user interaction form |
| `app/skill-topology/results/page.tsx` | Results display with interactive weight sliders |
| `app/layout.tsx` | Root layout with navigation structure |
| `tailwind.config.ts` | Theme configuration (colors, spacing, container) |

## Deployment

- **Primary:** AWS Amplify auto-deploys on push to `main` branch
- **CI/CD:** `.github/workflows/deploy.yml` triggers on push to `main`
- **Manual:** `deploy.sh` script handles commit, push, and Amplify trigger
- No build or test steps in CI — Amplify handles the build pipeline

## Known Gaps & TODOs

- No test framework configured (no Jest, Vitest, or Testing Library)
- No `.env` files — Lambda endpoint URL is hardcoded in `app/api/analyze/route.ts`
- `capability_match` has a placeholder value (85) in the API route
- No authentication or database storage
- PDF/DOCX resume upload not yet implemented
