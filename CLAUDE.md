# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`cccdev` is a CLI tool + embedded devtools panel for Cocos Creator browser preview debugging. The root package is published to npm as `cccdev`. The devtools UI (Preact IIFE) lives in `packages/cccdev-template-3x/` as a private build-only package; its output is copied into `template/3x/` at build time and shipped inside the CLI package.

## Commands

```bash
# Install template dependencies (required before first build)
cd packages/cccdev-template-3x && bun install

# Build template and copy to template/3x/
bun run build

# Type-check CLI code (root tsconfig, excludes packages/)
bun run type-check

# Lint / format
bun run lint          # oxlint
bun run lint:fix      # oxlint --fix
bun run fmt           # oxfmt
bun run fmt:check     # oxfmt --check

# Test CLI locally
bun run bin/cccdev.ts --help
bun run bin/cccdev.ts init          # run inside a Cocos Creator project dir

# Publish
bun run build && npm publish
```

## Architecture

### Two-part structure

1. **CLI** (root `bin/` + `src/`) — published as `cccdev` on npm. Zero runtime deps. Runs TS directly via `#!/usr/bin/env bun`. Uses `util.parseArgs` for command routing.

2. **Template UI** (`packages/cccdev-template-3x/`) — private Preact app built as IIFE via Vite. Output goes to `template/devtools/assets/{index.js,style.css}`. Injected into Cocos Creator's preview page via `template/index.ejs`.

### Build flow

`bun run build` → builds template (tsc + vite) → copies `packages/cccdev-template-3x/template/*` → `template/3x/`. The `template/` dir is gitignored but included in `"files"` for npm publish.

### CLI (`src/`)

- `cli.ts` — parseArgs router, dispatches `init` command
- `commands/init.ts` — detects CC project via `detect.ts`, resolves template from own package dir (`import.meta.dir`), copies with `fs.cpSync`
- `utils/detect.ts` — checks `assets/` + `settings/` dirs to identify CC 3.x project
- `utils/logger.ts` — ANSI-colored console output

### Devtools UI (`packages/cccdev-template-3x/src/`)

- **State**: `@preact/signals` — all state is top-level exported signals in `store.ts`. No Redux/Context.
- **Engine bridge**: `engine.ts` accesses Cocos Creator via `window.cc` global. Provides scene traversal, node inspection, debug drawing.
- **Components**: `App.tsx` (layout, resize, toggle) → `TreePanel` (node tree, search) + `PropPanel` → `ComponentPanel` → `PropItem` (number/string/bool/color editors). `ProfilerPanel` floats independently.
- **Models**: `NodeModel.ts` and `ComponentModels.ts` define getter/setter property maps for cc.Node and specific CC components (UITransform, Label, Sprite).
- **Styling**: Single `style.css` with CSS custom properties (dark theme, purple accent). Panel is `position: fixed` on right side with resizable width via CSS variable `--devtools-width`.

### Key patterns

- Panel open/close state persisted to `localStorage` (`cc_devtools_show`)
- Panel width persisted to `localStorage` (`cc_devtools_width`)
- Tree data rebuilt every frame via `requestAnimationFrame` loop
- Property inputs are uncontrolled with ref-based external sync (only syncs when not focused, to avoid disrupting user input)
- During drag-resize, `pointer-events: none` is set on `#content` to prevent canvas from swallowing mouse events

## Conventions

- Formatter: oxfmt with single quotes (`.oxfmtrc.json`)
- Linter: oxlint
- Template package has its own `tsconfig.json` extending root, adding `jsx: react-jsx` + `jsxImportSource: preact`
- Root tsconfig excludes `packages/` — CLI and template type-check independently
