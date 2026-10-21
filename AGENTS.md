<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Edelweiss Development Guidelines

## 1. Zero Comments Policy
- Do not write any code comments (`//`, `/* */`, `<!-- -->`, `{/* */}`) in any source code files.
- Code must be self-explanatory with descriptive naming for variables, functions, and types.

## 2. Clean, Concise & Modular Logic
- Avoid deeply nested `if-else` statements.
- Use early returns / guard clauses, object lookup dictionaries, and concise expressions.
- Strictly separate UI components from business logic, custom hooks, services, and utilities.
- Never hardcode strings, URLs, or configuration values in components or handlers. Use `src/constants/` and environment variables.

## 3. Styling & Aesthetics
- Use SCSS (Sass modules) for styling.
- Primary brand color: `#63AB45` (Edelweiss Green).
- Accent brand color: `#F7921E` (Warm Orange).
- Dark text/headings: `#1E2833`.
- Reusable mixins and SCSS variables in `src/styles/`.

## 4. Reusability & Architecture
- Maintain maximum component reusability. Do not duplicate components for minor variations.
- Backend: Supabase (Auth, PostgreSQL DB, Storage, RLS).
- Frontend: Next.js (App Router, TypeScript).
- Admin Scope: Tour Package management and Article management only.

## 5. Admin Experience (User-Friendly & Streamlined CRUD)
- Interface must be clean, highly intuitive, and guided without verbose text or confusing terminology.
- Provide straightforward field labels, instant media previews, dynamic row controls (for package options/facilities), and clear action buttons.
- Provide immediate visual feedback: loading states, toast notifications, and modal confirmation for deletes.

