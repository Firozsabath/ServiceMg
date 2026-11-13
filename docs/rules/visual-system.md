# Application visual system

The application uses the login page's warm ivory, forest green, and sage palette.

- `src/styles/workspace.css` owns design tokens and shared internal patterns. Use its `--sm-*` variables for new screen styles instead of unrelated hex colors.
- `src/styles/material-theme.scss` defines Angular Material colors and typography. It is loaded by application and Karma configurations in angular.json. Do not add a second prebuilt theme.
- `src/styles.css` contains shared base utilities. Bootstrap remains installed; use the shared theme for primary actions.
- The shared header is compact and light. Keep branding typographic and free of customer logos. Account details truncate gracefully; actions remain available on mobile.
- Admin and technician layouts share the same spacing and colors. Navigation is a side panel on desktop and a dismissible overlay below 960px. A selected link closes the overlay on mobile.
- Sidebars group valid routes, show active navigation and accessible names, and retain public route spelling. Avoid linking to placeholder or unconfigured routes.
- Page headers sit directly on the ivory canvas. White cards and filter panels use subtle borders, 14px corners, and restrained shadows. Avoid stacking a second padded page canvas inside the layout.
- Tables use muted headers, horizontal separators, subtle hover states, readable spacing, and horizontal scrolling when needed. Preserve hidden columns, sorting, pagination, selection, and numeric alignment.
- Use forest for primary actions, sage for secondary emphasis, amber for caution, and muted red for errors or destructive actions. Keep status labels as well as colors.
- Use Inter/IBM Plex Sans and the existing Material Symbols icons. Keep headings compact and body text readable; avoid decorative heading underlines.
- Shared screen selectors are scoped under `.workspace-shell .workspace-main .workspace-content` so they override legacy component presentation consistently without changing login or document table layouts.
- Overlay controls inherit the same Material theme. Financial documents retain their company, bank, tax, and numeric details. Logo/stamp images are replaced with a neutral document label and an empty signature line.
- Recheck desktop and mobile navigation, keyboard access, dense tables, and multi-page financial previews when changing shared patterns. Respect reduced motion.
