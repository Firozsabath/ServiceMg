# Angular and UI rules

Follow [the application visual system](visual-system.md) for layout, colors, navigation, and shared component presentation.

- Follow the existing NgModule architecture, constructor injection, and external component HTML/CSS. Add declarations/imports to the owning module; export shared declarations when consumers need them.
- Use Angular 14-compatible templates and RxJS. Do not introduce signals, newer control-flow syntax, standalone migrations, or later-version APIs incidentally.
- Keep HTTP transport in domain services. Components manage presentation and interaction; extract reusable business logic when the task warrants it.
- Reuse existing Material controls, dialogs, tables, snackbars, Bootstrap utilities, and shared components. Avoid adding another UI framework.
- Prefer reactive forms for new complex forms, following the feature pattern. Validate before saving, show understandable errors, preserve edit values, and prevent duplicate submissions.
- When company/branch/machine selections depend on each other, clear stale child values on parent changes and keep form values consistent with displayed selections.
- Provide loading, empty, success, and failure behavior. Do not leave spinners active after failures or erase useful data on failed requests.
- Prefer async pipes or takeUntil with OnDestroy cleanup for long-lived subscriptions. Angular 14 does not provide takeUntilDestroyed. Use RxJS composition rather than nested subscriptions when practical.
- Use switchMap for replaceable searches where appropriate, but do not accidentally cancel writes or submit twice through multiple subscriptions.
- Preserve filtering, sorting, pagination, and totals. Keep server-paginated operations aligned with backend parameters instead of filtering only the current page.
- Scope CSS locally. Review broad global selectors before changing `src/styles.css`, and verify other affected screens when global changes are needed.
- Provide labels, keyboard access, visible focus, and names for icon-only buttons. Keep wide tables and dialog actions usable on small screens.
- Keep route definitions and sidebar links aligned. Verify direct URL loading and back navigation for route changes; preserve established URLs unless changing them is required.
- Use Angular binding and sanitization. Do not bypass sanitization for API-provided HTML or add unsafe DOM writes for rich text.
