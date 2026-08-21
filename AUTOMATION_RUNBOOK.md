# Automation Runbook

## Scheduled Maintenance Cycle

The GitHub maintenance workflow is designed to run a bounded deterministic cycle. It loads the checked-in maintenance manifest, attempts to retrieve the latest non-expired state artifact, installs the locked dependencies, performs validation, writes a fresh machine-readable state summary, and uploads that summary for up to 100 days. Each state record carries a cycle number, prior commit reference when available, and a `continuationLimitReached` flag at the intended 2,400-cycle boundary.

The workflow intentionally **does not** commit repairs, push branches, alter repository settings, publish the app, rotate credentials, or enable integrations. A failed cycle is an actionable signal for a reviewed engineering repair; it is not permission to make autonomous external changes.

| Cycle step | Evidence | Safe output |
| --- | --- | --- |
| Load prior state | Latest `maintenance-state` artifact when available | Prior result metadata only |
| Validate | Type check, lint, tests, server build, Android export | GitHub Actions logs and run conclusion |
| Record | `maintenance-state.json` generated in the runner workspace | Compact JSON artifact without credentials |
| Continue | Next scheduled run starts from manifest and latest artifact | Bounded, repeatable validation |

## Manual Repair Procedure

When GitHub validation fails, reproduce the failure on a branch. Make a scoped change, rerun every command from `MAINTENANCE_MANIFEST.json`, inspect the diff for secrets or unrelated files, rebase against the latest `github/main`, and then push the verified change. Use a checkpoint before changing runtime configuration or dependencies that could affect release behavior.

## Authentication and CLI Policy

The approved GitHub integration and GitHub Actions token are used only through their normal authenticated mechanisms. Third-party developer CLIs are not treated as automatically configured merely because their binaries may exist. A tool may be used only when it is installed, the relevant account is legitimately authenticated, and its use is necessary for this repository. No key extraction, bypass, credential copying, or terminal-history upload is permitted.
