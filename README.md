# roXtra Processes SDK for JavaScript/TypeScript

This is the open source repository for the roXtra Processes SDK.

https://www.roxtra.com

## Development linting

Use Node.js 24 and npm 11 or 12. Run `npm ci`, then `npm run lint` from the repository root. The existing build, test, and release workflows use this same lint command.

Oxlint checks the supported syntax rules in `src` first. ESLint retains type-aware checks, naming conventions, Lodash import rules, focused-test checks, and Prettier. Both linters preserve the existing exclusion for `src/process/types/`. The configuration-based `eslint-plugin-oxlint` bridge disables only rules already checked by Oxlint.

All 15 `eslint-plugin-security` rules report non-blocking warnings. Existing lint errors remain blocking. Security findings identify code for review and do not establish exploitability.

Maintain native rules and their options in `.oxlintrc.json`, and the remaining checks in `eslint.config.js`. Use `oxlint-disable` comments for native rules and `eslint-disable` comments for ESLint rules; unused directives remain warnings. Keep both Oxc and ESLint editor extensions enabled, alongside the existing Prettier formatter.
