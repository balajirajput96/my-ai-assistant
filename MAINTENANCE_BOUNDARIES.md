# Secure Maintenance Boundary

## Purpose

This repository preserves **project-relevant engineering state** so work can be resumed without rebuilding from zero. The maintained state includes committed source code, package manifests and lockfiles, documented validation commands, Git commit references, GitHub workflow definitions, non-secret configuration examples, test results, and release procedures.

## Explicitly Preserved

| State category | Preservation method | Reason |
| --- | --- | --- |
| Source, tests, documentation, and workflows | Private GitHub repository and versioned commits | Reviewable, reproducible project history |
| Dependency resolution | `package.json` and `pnpm-lock.yaml` | Deterministic installation in CI |
| Validation procedure | GitHub Actions plus documented `pnpm` commands | Repeatable check, lint, test, build, and export verification |
| Maintenance status | Versioned maintenance manifest and workflow summaries | Enables future work to continue from the current known state |
| Safe recovery points | WebDev checkpoints and Git history | Supports rollback without destructive commands |

## Never Stored or Exported

Terminal history, shell history, browser cookies, raw logs that can contain personal data, private keys, OAuth tokens, passwords, API keys, connector credentials, and unrelated machine files are **not** copied into this repository, generated artifacts, or GitHub Actions logs. Valid credentials must remain in the platform’s approved secure configuration and are never extracted, printed, scraped, or committed.

## Automation Boundary

GitHub automation may install dependencies, run deterministic checks, build project artifacts, prepare a non-secret maintenance summary, and report failures. It must not publish the app, modify production secrets, enable external connectors, create external accounts, bypass authentication, or merge/push unreviewed changes on its own.

An AI-assisted maintenance task can investigate reproducible failures, apply scoped changes, rerun checks, create a checkpoint, and push only a verified branch using the authenticated GitHub account already authorized for this task. It must retain least privilege and avoid unsupported third-party CLIs unless they are installed, configured, and legitimately authenticated.

## Continuation Rule

Every maintenance cycle starts by loading the checked-in manifest, checking GitHub workflow status, inspecting incomplete TODO items, running the defined validations, recording a concise outcome, and then stopping when no reproducible repair is available. This prevents repeated work while keeping the workflow bounded and auditable.
