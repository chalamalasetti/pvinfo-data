# Jobs and schedules

All times UTC. GitHub may delay scheduled runs; the published data and the site's status page show when data was actually collected.

| Workflow | Schedule | What it does |
|---|---|---|
| Refresh public PV data (`fda-collector.yml`) | Checks hourly at :23, plus an external hourly dispatch | Collects only when the admin-set interval is due (12 hours by default) or a refresh is queued |
| Collect regulatory source documents (`documents.yml`) | Hourly at :17 | Captures a bounded batch of registered public documents, oldest first |
| Feed health check (`feed-health.yml`) | Hourly at :47 | Opens one `feed-alert` issue here when data stops refreshing; closes it when healthy |
| Backfill public company clinical portfolios (`clinical-backfill.yml`) | Every 6 hours at :11 | Runs when its pipeline is due |
| Refresh company registry (`company-registry.yml`) | 01:09, 07:09, 13:09, 19:09 | Runs when its pipeline is due |
| Label snapshots (`label-snapshots.yml`) | 03:43 and 15:43 | DailyMed and PMDA label versions |
| DailyMed and safety alerts check (`safety-daily.yml`) | 05:41 and 17:41 | New label versions and agency alerts |
| Label dates (`label-dates.yml`) | Daily 03:11 | Dates labelled events from label history |
| Document text (`document-text.yml`) | Daily 05:47 | Text and OCR for archived documents |
| Backup mirror (`mirror.yml`) | Daily 02:37 | Only when a mirror is configured |
| Approvals (`approvals-data.yml`) | Mondays 04:23 | |
| Regulatory calendar dates (`regulatory-dates.yml`) | Tuesdays 05:41 | |
| Evidence repository (`evidence-repository.yml`) | Saturdays 04:23 | |
| Country product registries (`country-products.yml`) | Sundays 03:43 | |
| Product safety snapshot (`safety-data.yml`) | Sundays 06:17 | Up to about 2.5 hours |
| Literature watch (`literature.yml`) | Sundays 07:17 | Only when enabled |
| Canada Vigilance counts (`canada-vigilance.yml`) | 9th of each month, 04:23 | |
| Publish curated requirements (`curated-requirements.yml`) | Every 30 minutes | Publishes the newest checked curation set, if changed |
| PV-Info checks (`pv-info-checks.yml`) | Every 30 minutes | Tests new application changes and reports the result to the application repository |
| Sync jobs from PV-Info (`sync-jobs.yml`) | Every 2 hours | Rebuilds the generated workflows |
| Vercel refresh (`vercel-refresh.yml`) | Manual | Shortcut that starts Refresh public PV data with Force |

## Running a job by hand

Maintainers: open **Actions**, pick the workflow, **Run workflow** on `main`. Inputs:

- Refresh public PV data: `force` collects even if not due.
- Collect regulatory source documents: `document_id` puts one source first.
- Product safety snapshot: `limit`, `scope` (`all` or `manifest`), `minutes`.
- Publish curated requirements: `ref` publishes a given branch or commit now.
- PV-Info checks: `sha` checks one commit now; `recheck` re-tests commits that already have a result.
