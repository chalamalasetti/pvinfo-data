# Operations (maintainers)

## How the workflows are produced

`scripts/build-jobs.mjs` converts the job definitions maintained with the application into the workflows here:

- scheduled and manual triggers are kept; push and pull-request triggers are dropped;
- each job checks out the application at the needed commit with a read-only token, without persisting credentials, and uses this repository as `origin` for cache branches;
- application checks run on a 30-minute poll and report a commit status back;
- curated requirements publish on a 30-minute poll instead of per commit.

`npm test` runs the generator tests. The **Sync jobs from PV-Info** workflow runs the tests, rebuilds the workflows and commits any change. Run it by hand after changing a job definition.

## Repository settings

Actions secrets (values are never printed; do not paste them anywhere else):

| Secret | Used for |
|---|---|
| `PVINFO_CODE_TOKEN` | Read the application code; post check results |
| `PVINFO_DATA_TOKEN` | Publish to dataset branches and update workflow files |
| `OPENFDA_API_KEY` | openFDA request allowance |
| `NCBI_API_KEY`, `NCBI_EMAIL` | NCBI E-utilities (literature) |
| `MIRROR_URL` | Optional backup mirror |

Actions variable: `PV_LITERATURE_ENABLED` (`true` turns the literature watch on).

The workflows have no `pull_request` triggers, so pull requests from forks cannot run them or read secrets. Jobs that write to the PV Info database identify themselves with a short-lived GitHub OIDC token that the server checks against this repository's ID, branch `main` and the exact workflow file.

## Troubleshooting

- **A job failed:** open the run, read the failing step. Source outages keep the last good data; rerun when the source is back.
- **A dataset looks stale:** check the branch's latest commit date and its `manifest.json` source statuses, then the matching workflow's recent runs.
- **A `feed-alert` issue opened:** it lists what is stale or failing; it closes itself after a healthy check.
- **Workflows look out of date:** run **Sync jobs from PV-Info**.
- **Never** commit application code, credentials or personal data to any branch here.
