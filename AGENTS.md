<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->
# Project Rules

## No Custom CSS -- Tailwind Only
- All styling MUST use Tailwind CSS utility classes exclusively.
- The ONLY `.css` file allowed is `src/app/globals.css`, which exists solely for Tailwind's required `@import "tailwindcss"` directive and `@theme inline` token declarations.
- Do NOT create additional `.css` files anywhere in the project.
- Do NOT use inline `style={}` props in React components.
- Do NOT write custom CSS selectors, keyframes, or `@apply` directives.

## Full Responsivity
- ALL UI components and pages must be fully responsive across mobile, tablet, and desktop screens.
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:) appropriately.
- Ensure touch targets are adequately sized on mobile devices.

## No Emojis & Use react-icons
- Do NOT use emoji characters anywhere: code, comments, UI text, commit messages, or documentation.
- ALWAYS use the `react-icons` library for icons (e.g., `react-icons/fi`, `react-icons/lu`). Do not use raw SVGs unless strictly necessary.

## Domain-Driven Flat Folder Structure
- Organize code under `src/` using flat domain folders:
  - `src/app/` -- Next.js App Router (pages, layouts, metadata files)
  - `src/components/` -- All reusable UI components
  - `src/providers/` -- React context providers
  - `src/hooks/` -- Custom React hooks
  - `src/lib/` -- Utilities, constants, and helper functions
- Do NOT create nested folders inside any domain folder (e.g., no `src/components/ui/buttons/`).
- Each file should be a single, focused module placed directly inside its domain folder.
<!-- END:project-rules -->
