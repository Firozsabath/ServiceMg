# Project map

## Stack and configuration

- Angular core/CLI 14.2, TypeScript 4.7, RxJS 7.5, and NgModule architecture.
- Angular Material/CDK 13, Bootstrap 5, and plain CSS. Mixed package versions exist; upgrades require an intentional compatibility review.
- ngx-charts, TinyMCE, jsPDF/html2canvas, and xlsx support charts, rich text, PDFs, and spreadsheet exports.
- Jasmine/Karma with Chrome. Existing specs include generated creation tests and do not establish complete workflow coverage.
- TypeScript strict mode is disabled, but Angular strict templates are enabled. Preserve settings unless the task changes them explicitly.
- `angular.json` defines `ServiceManagement`. Build defaults to production; serve defaults to development. Output is `dist/service-management`.
- Production budgets: initial bundle warning/error at 3 MB/4 MB; component styles at 6 KB/8 KB.
- No Node version pin was found in the root configuration reviewed. Use a runtime supported by the installed Angular toolchain; an installed runtime is not proof of compatibility.

## Source layout

| Location | Responsibility |
| --- | --- |
| `src/app/app.module.ts` | Root imports, interceptors, TinyMCE provider |
| `src/app/app-routing.module.ts` | Lazy auth, admin, and user modules |
| `src/app/auth/` | Login and auth layout |
| `src/app/admin/` | Admin module, layout, routing |
| `src/app/admin/Components/` | Dashboard, lists, tickets, settings, charts, reports, finance |
| `src/app/admin/dialogs/` | CRUD, ticket updates/parts, financial previews, invoice status/email |
| `src/app/user/` | Technician request list, ticket details, companies |
| `src/app/shared-module/` | Headers, sidebars, spinner, shared exports |
| `src/app/service/` | Domain HTTP services, auth, loader state |
| `src/app/models/` | Domain classes, DTOs, filters, response shapes |
| `src/app/guards/`, `src/app/Interceptors/` | Navigation and HTTP behavior |
| `src/app/Validators/`, `src/app/directives/` | Validators and UI directives; admin also has directives |
| `src/styles.css` | Global CSS, including broad Material/table selectors |
| `src/assets/Images/` | Branding and imagery, with case-sensitive filenames |
| `src/environments/` | Development and production API/static-file URLs |

## Routing and data

The root lazy-loads auth at the empty path, admin at `/admin`, and the technician area at `/user`. Feature routing files define layout children. Admin finance uses `/admin/fin/...`. Several public URLs have legacy spelling; inspect routing files rather than guessing or correcting them.

Components generally consume observables from domain services using HttpClient and `environment.baseApiUrl`. Invoice and quotation services also expose BehaviorSubject state between views. Check direct navigation and reload behavior when changing those flows.

Development targets `https://localhost:7053/api/`; production targets `https://api.beanbalance.ae/api/`. Server assets use `staticFileUrl`. Backend source, authoritative API schemas, and deployment configuration are outside this frontend repository.

## Review findings requiring care

These observations are not a complete audit or instructions to preserve defects:

- Authentication writes local storage key `token`, while the interceptor reads `id_token` and concatenates `Bearer` without a separating space.
- AuthGGuard redirects unauthenticated navigation but returns true; the user layout route currently has no guard. Do not assume access or roles are correctly enforced.
- Authentication uses local session state, expiry timers, and Admin/Technician navigation. Changes require coordinated checks across login, service, guard, interceptor, and routes.
- Multiple finance and preview implementations coexist. `Invoice.ts` and `invoice.model.ts` serve different data shapes; inspect consumers before consolidating.
- Invoice data entry rounds line calculations to two decimals; quotation data entry currently uses unrounded intermediate values. Do not silently unify financial semantics.
- The shared forest/sage Material theme and workspace design tokens are configured in src/styles/. Keep screen styles consistent with docs/rules/visual-system.md.
- Substantial existing feature edits were present at initial review. Always inspect current git status rather than treating this document as a clean baseline.
