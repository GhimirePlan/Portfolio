# Contributing

Thanks for taking an interest in this portfolio. Bug reports, accessibility improvements, performance fixes, and focused documentation changes are welcome.

## Development workflow

1. Fork the repository and create a branch for the change.
2. Follow the [local setup](README.md#run-locally) and [configuration guide](docs/configuration.md).
3. Keep changes focused and preserve existing public and admin behavior.
4. Run `npm run lint` and `npm run build`. Check affected flows at phone and laptop widths, including keyboard navigation and reduced-motion preferences where relevant.
5. Open a pull request explaining the problem, resulting behavior, and validation performed. Include screenshots for visible interface changes.

There is no repository-wide `npm test` script at present. Include appropriate reproducible verification for functional changes without assuming a test runner exists.

## Content & integrations

- Keep private credentials and personal contact submissions out of commits, fixtures, screenshots, and public issues.
- Use `.env.example` for configuration names and placeholders.
- Keep private data behind server-side administrator checks.
- Preserve the distinction between browser estimates, confirmed inbox receipts, email acceptance, and external link clicks.
- Keep optional integrations optional and handle provider failures gracefully.
- Update documentation alongside changes to configuration, data flows, or user-facing behavior.

For a bug report, include the affected page, reproduction steps, expected behavior, and browser/device details. Report sensitive security details privately to [contact@plan.com.np](mailto:contact@plan.com.np), rather than posting credentials or private records in an issue.
