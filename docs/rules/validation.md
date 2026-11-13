# Validation rules

## Choose checks by scope

| Change | Verification |
| --- | --- |
| Documentation | Wording, relative links, paths/commands, and diff |
| TypeScript, templates, module wiring | Development build and relevant focused tests |
| API/auth | Mock-based contract/session tests and build |
| Financial calculations | Focused tests for calculations, rounding, edge cases, and build |
| UI/CSS | Build and relevant visual/responsive checks when available |
| Dependencies, assets, build config, bundle impact | Production build, relevant tests, warnings/budgets |

Development compilation: `npm run build -- --configuration development`.
Production compilation and budgets: `npm run build`.
Do not raise budgets, weaken template checking, or suppress errors to pass validation.

Single headless Jasmine/Karma run:

```sh
npm test -- --watch=false --browsers=ChromeHeadless
```

Focused example using an existing spec (replace with the relevant spec path):

```sh
npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/guards/auth-g.guard.spec.ts
```

Selecting a scaffold spec does not establish sufficient behavioral coverage. Add meaningful tests for changed behavior, mock dependencies and HTTP, and avoid tests that simply mirror implementation details.

## Prerequisites and limits

- Reuse installed dependencies when available. When installation is needed, prefer npm ci with the committed lockfile; do not delete the lockfile or routinely force peer resolution.
- Use a Node version compatible with the installed Angular toolchain. Report runtime blockers rather than incidentally upgrading the framework.
- Karma needs Chrome/Chromium. If discovery fails, set CHROME_BIN to an installed compatible executable or report the prerequisite.
- No lint script, end-to-end target, backend, or deployment pipeline is configured in the files reviewed. Starter README end-to-end guidance does not establish a configured test runner.
- Tests load different styles/scripts from application builds. A test pass does not verify Bootstrap/TinyMCE assets or rendered PDFs.
- Existing creation specs may need mocks before testing real components. Distinguish existing failures from regressions; do not claim a clean baseline without running checks.
- Manual API verification needs an authorized development backend or mocked responses. State exactly what was verified and what still requires backend access.

## Completion checks

- Inspect the final diff for unrelated edits, generated output, secrets, and whitespace errors.
- Run git diff --check for tracked changes and inspect new files too. Report unrelated pre-existing whitespace failures without rewriting those files.
- Summarize only checks actually run, with results. Explain skipped or blocked checks. Builds do not establish backend integration or security correctness.
