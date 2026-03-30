# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (compiles SCSS + TypeScript, verifies package)
npm run build

# Watch mode for development
npm run watch

# Link plugin locally and watch (for testing in another project)
npm run link-watch

# Lint
npm run lint
npm run lint-fix

# Format
npm run format
```

There are no tests in this project.

## Architecture

This is a **Sanity Studio v3 plugin** (`sanity-plugin-media-video`) that adds a `media` object type to Sanity schemas. It has two distinct halves:

### 1. Studio Side (Sanity plugin)
- **Entry**: `src/index.ts` exports `mediaVideoPlugin`
- **Plugin definition**: `src/plugin/plugin.ts` — uses `definePlugin<MediaVideoPluginOptions>()`, registers the `mediaObject` schema type and i18n bundles (EN/DE)
- **Schema**: `src/schemas/objects/MediaObject/` — defines the `media` Sanity object type with image + video fields
- **Plugin options**: `src/types/MediaVideoPluginOptions.ts` — Zod-validated config (e.g. `isImageRequired`)
- **Input components**: `src/components/sanity/` — custom Sanity input fields used inside Studio

### 2. Frontend/Renderer Side (consumer-facing)
The plugin exports multiple entry points for use in frontend apps (Next.js, etc.):

| Export | Source | Purpose |
|---|---|---|
| `.` (default) | `src/index.ts` | Plugin registration only |
| `./renderer` | `src/exports/components/index.ts` | `MediaVideo` component + `MediaVideoComponents` styled parts |
| `./hooks` | `src/exports/hooks/index.ts` | `useMediaVideoPlayback` and other hooks |
| `./contexts` | `src/exports/contexts/index.ts` | `MediaVideoContext` for playback state |
| `./types` | `src/exports/types/index.ts` | TypeScript types |

### Key Components
- **`MediaVideo`** (`src/components/media-video/MediaVideo.tsx`): Main display component — accepts `videoUrl`, `muxData`, `videoType`, `imagePreview`, and many customization props. Supports autoplay, PiP on scroll, and dialog popout.
- **`MediaVideoComponents`** (`src/components/media-video/MediaVideoComponents.tsx`): Exported styled-components primitives for consumers who need fine-grained control.
- **`MediaVideoContext`** / **`useMediaVideoPlayback`**: React context + hook managing playback state across components.

### CSS
- Source: `src/css/styles.scss` (SCSS)
- Build output: `dist/sanity-plugin-media-video.css`
- CSS is compiled separately via `sass` CLI and must be imported by consumers: `import 'sanity-plugin-media-video/dist/sanity-plugin-media-video.css'`

### i18n
Translations live in `src/utils/i18n/resourceBundles.ts` (EN-US and DE-DE). The i18n namespace constant is in `src/utils/constants.ts`.

### Build System
Uses `@sanity/pkg-utils` (not tsc directly). Config in `tsconfig.dist.json`. The build script runs CSS compilation twice (before and after `pkg-utils build`) to ensure the CSS file is available for verification.

## Conventions

- **Commits**: Must follow Conventional Commits (enforced by CommitLint + Husky). Releases are automated via `@sanity/semantic-release-preset`.
- **Peer dependencies**: `react ^19`, `sanity ^5`, `sanity-plugin-mux-input ^2.8.1`, `zod ^4` — these are not bundled.
- **No test framework** is configured in this repository.
