# Agent instructions

## Project context

ServiceManagement is an Angular frontend for Bean Balance service operations: companies and branches, machines, technicians, tickets and parts, inventory, quotations, invoices, and reports. The backend is external to this repository.

Before substantial work, read [the project map](docs/project-map.md) and the relevant project rules:

- [Angular and UI](docs/rules/angular-ui.md): components, templates, CSS, routing, and forms.
- [API and authentication](docs/rules/api-auth.md): services, models, sessions, guards, and interceptors.
- [Finance](docs/rules/finance.md): quotations, invoices, calculations, previews, and exports.
- [Validation](docs/rules/validation.md): commands, checks, and completion criteria.

These linked files are project instructions. This file applies throughout the repository; more specific AGENTS.md files add instructions for their directories. Update these documents when architecture or commands change.

## Working agreement

- Check `git status --short` and relevant diffs before editing. Preserve existing staged, unstaged, and untracked work. Do not reset, clean, overwrite, or reformat unrelated changes.
- Trace the affected route, component/template, service, model, and callers before changing behavior.
- Make the smallest complete change. Avoid incidental dependency upgrades, framework migrations, broad renames, and formatting sweeps.
- Follow the installed Angular 14 / TypeScript 4.7 toolchain. Use npm scripts or the local CLI through `npx ng`; do not assume modern Angular APIs exist here.
- Preserve path casing and existing public names, including legacy spelling in routes, imports, selectors, and API fields.
- Follow `.editorconfig`: UTF-8, two spaces, final newline, and single quotes in new TypeScript. Match nearby style without rewriting whole files.
- Prefer explicit types for new logic. Existing `any` and relaxed TypeScript settings do not justify unchecked access or weakening compiler settings.
- Keep credentials, tokens, private keys, and customer data out of source, logs, screenshots, and test fixtures. Browser environment files are public configuration.
- Use mocked services or an authorized development backend for verification. Do not test against production writes, delete real records, or send real invoice emails without explicit authorization.
- Do not edit generated `dist/`, `node_modules/`, `.angular/`, or coverage output. Keep dependency and lockfile changes intentional.
- Report existing defects that affect the task; do not silently repair unrelated business or authentication behavior.

## Commands

Run from the repository root:

| Purpose | Command |
| --- | --- |
| Install locked dependencies when needed | `npm ci` |
| Development server without opening a browser | `npx ng serve` |
| Existing start script, opens browser | `npm start` |
| Development build | `npm run build -- --configuration development` |
| Production build and budgets | `npm run build` |
| Interactive Jasmine/Karma tests | `npm test` |
| Single headless test run | `npm test -- --watch=false --browsers=ChromeHeadless` |

No lint script or end-to-end target is configured. Karma needs Chrome/Chromium; real API workflows require the separate backend.

## Completion

Review the final diff and run appropriate checks from the validation rules. Report changes, actual check results, and limitations. Documentation-only edits need path/link and diff checks rather than an application build. Do not commit, push, or deploy unless requested.
