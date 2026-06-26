# Agent Guide

This repository is a reusable Next.js + Sanity boilerplate. It is not a finished website for one client or brand. Treat it as a template that other developers will clone, configure, and adapt for many projects.

## Core Rule

Do not change the core project structure unless the user explicitly asks for a structural change.

The following structure is intentional and should be preserved:

- Root npm workspace with `apps/web` and `apps/studio`.
- Public site code in `apps/web`.
- Sanity Studio code in `apps/studio`.
- Core Sanity documents: `blogPost`, `category`, `author`, `faqItem`, `landingPageSeo`, `redirect`, and `siteSettings`.
- Core Sanity objects: SEO, AI SEO, schema config, redirects, Portable Text, links, images, FAQ lists, analytics, and social defaults.
- Locale-first web routing under `apps/web/src/app/[locale]`.
- Sanity data access through `apps/web/src/sanity/lib` and `apps/web/src/sanity/queries`.
- Metadata through `apps/web/src/seo`.
- JSON-LD through `apps/web/src/seo/schema`.

If a project needs custom website content, add pages, components, or new schema types around this base. Do not remove or rename the boilerplate schema types unless asked explicitly.

## What This Boilerplate Provides

- Next.js frontend with App Router and locale-prefixed routes.
- Sanity Studio with CMS types for blog posts, authors, categories, FAQ items, redirects, landing-page SEO, and site settings.
- Draft Mode and Presentation preview wiring.
- On-demand revalidation webhook endpoint for Sanity publishes.
- SEO inheritance from Site Settings to individual documents.
- JSON-LD schema generators for common website entities.
- Analytics configuration driven from Sanity Site Settings.
- Portable Text renderers for blog content.

## Expected Agent Behavior

- Prefer small, scoped changes that follow existing folder ownership.
- Read `README.md`, `ABOUT.md`, and `SETUP.md` before making broad changes.
- Keep environment-specific IDs, URLs, and secrets in `.env.local` files or `.env.example` templates.
- Never commit real secrets.
- Use npm only. This repo uses npm workspaces and `package-lock.json`.
- Keep files documented with useful module-level comments where behavior is not obvious.
- Update docs when changing setup, folder structure, env variables, or core workflows.
- Put static UI copy in `apps/web/src/messages/<locale>/*.json` instead of hardcoding text in pages or components.
- Blog content localization is document-level in Sanity: filter `blogPost` queries by `language`, link translated posts with `translationGroup`, create translations through the Studio `Translations` tab, and treat missing legacy `language` values as English.

## Web App Boundaries

Use `apps/web` for the public frontend:

- Add app routes under `apps/web/src/app/[locale]`.
- Add shared UI in `apps/web/src/components/shared`.
- Add reusable primitives in `apps/web/src/components/ui`.
- Add blog-only components in `apps/web/src/components/blog`.
- Add GROQ queries in `apps/web/src/sanity/queries`.
- Add SEO behavior in `apps/web/src/seo`.
- Add structured data in `apps/web/src/seo/schema`.
- Add locale behavior in `apps/web/src/i18n`.

Do not fetch Sanity directly from random components. Use `sanityFetch()` and query files.

## Studio Boundaries

Use `apps/studio` for CMS structure and editor tooling:

- Add document types in `apps/studio/schemaTypes/documents`.
- Add reusable object types in `apps/studio/schemaTypes/objects`.
- Add Studio sidebar changes in `apps/studio/structure/index.ts`.
- Add custom document actions in `apps/studio/schemaTypes/actions`.
- Add custom Studio panels or previews in `apps/studio/schemaTypes/components`.

Do not rename existing schema type names unless the user asks. Renaming a Sanity schema type can orphan existing content.

## Test Content Policy

The connected Sanity dataset may contain sample blog posts, FAQ items, categories, authors, and landing-page SEO entries used for testing. Those content documents can be deleted or replaced inside Sanity Studio for a real project.

The schema definitions themselves must remain unless a deliberate migration is requested:

- Keep `blogPost`.
- Keep `category`.
- Keep `author`.
- Keep `faqItem`.
- Keep `landingPageSeo`.
- Keep `redirect`.
- Keep `siteSettings`.

## Deployment Notes

- Web deploys from `apps/web`, usually to Vercel.
- Studio deploys from `apps/studio`, usually with `npx sanity deploy`.
- Sanity project ID, dataset, preview URL, preview secret, revalidation secret, and Studio deployment app id are configurable through env files.
- Vercel must use `apps/web` as the root directory.
- Sanity CORS must include local and production web origins.

## Files To Read First

- `README.md`: concise overview.
- `ABOUT.md`: full project and file structure reference.
- `SETUP.md`: detailed setup, Sanity, Vercel, and deployment guide.
- `apps/web/AGENTS.md`: Next.js-specific warning for this web app.

## Visual System And CSS Rules

The public website theme is controlled from `apps/web/src/app/globals.css`. When changing the look of the site, update the CSS custom properties there first instead of changing colors component by component.

### Theme Tokens

Use semantic theme tokens everywhere:

- Primary dark brand surface: `--color-primary`, `--color-primary-surface`.
- Accent / CTA green: `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-accent-border`.
- Page surfaces: `--color-surface`, `--color-surface-muted`, `--color-card`, `--color-card-dark`.
- Text: `--color-ink`, `--color-muted`, `--color-subtle`, `--color-text-on-dark`, `--color-text-muted-dark`, `--color-text-on-card`, `--color-text-muted-card`, `--color-text-on-accent`.
- Borders: `--color-line`, `--color-line-soft`, `--color-border-dark`, `--color-border-card`.
- Status colors: `--color-info`, `--color-warning`, `--color-danger` and their soft variants.

Avoid raw Tailwind palette classes such as `text-emerald-*`, `bg-blue-*`, `text-red-*`, or arbitrary hex utilities such as `bg-[#...]` in app components. Prefer `text-[color:var(--color-accent)]`, `bg-[color:var(--color-surface)]`, `border-[color:var(--color-line)]`, or existing utilities from `globals.css`.

### Typography

The site uses Google fonts through `apps/web/src/app/[locale]/layout.js`:

- Headings/display: `Red Hat Display`, exposed as `--font-red-hat` and used by `--font-heading` / `--font-display`.
- Body/UI text: `Manrope`, exposed as `--font-manrope` and used by `--font-body` / `--font-sans`.

Use `font-display` or `font-heading` for page titles and section headings. Use `font-body` for paragraphs, buttons, form labels, cards, and navigation. Do not introduce extra font families unless the whole theme is being changed.

Recommended type scale:

- Hero H1: `text-4xl sm:text-5xl lg:text-6xl`, tight line height.
- Page hero H1: `text-4xl md:text-6xl`, tight line height.
- Section H2: `text-3xl md:text-5xl` for major homepage sections, smaller for compact tool panels.
- Card titles: `text-lg` to `text-2xl`.
- Body copy: `text-sm` to `text-base`, with muted text using `--color-muted` or `--color-text-muted-dark`.
- Fine print / labels: `text-xs` or `text-[0.7rem]`, usually uppercase only for short labels.

Do not scale font sizes with viewport width. Keep letter spacing at `0` except for short uppercase badges or labels.

### Layout And Spacing

Use the shared `.container-max` utility for page-width alignment. It is intentionally matched to the navbar width.

Use `.section-py` for standard vertical section padding unless a section has a specific compact layout. Anchor sections should rely on the global `scroll-padding-top` so sticky navigation does not cover content.

Common layout patterns:

- Homepage sections should be full-width bands or unframed layouts, not nested cards.
- Repeated content items may use cards.
- Tool-like panels can use cards if the border, radius, and shadow are restrained.
- Avoid putting cards inside cards.
- Keep card radius at `8px` or less unless an existing component already uses a larger rounded visual language for a specific reason.

### Buttons And Links

Use shared button utilities where possible:

- `.btn-accent` for primary CTAs.
- `.btn-dark` for dark filled actions.
- `.ghost-badge`, `.ghost-badge-info`, `.ghost-badge-muted` for compact labels.

Buttons should use icons from `lucide-react` when an icon exists for the action. Internal navigation should use `next/link`; anchors to homepage sections should use localized paths where needed.

### Images And Branding

Logo assets live in `apps/web/public/logo`. When the full wordmark is needed, use `/logo/logo_name.png`. If the logo sits on a dark surface, place it inside a white rounded container so the mark remains legible.

Do not hardcode Open Graph images if the CMS or site settings provide them. Prefer Sanity-driven images for blog/content and public assets for fixed brand images.

### Comments

Add comments only where they explain non-obvious behavior, layout constraints, or integration details. Avoid comments that restate JSX or CSS literally. Keep comments ASCII-only.
