# Datasets

Every dataset is published on its own branch. A branch holds one complete snapshot; a new run replaces it. Unless noted, each branch has a `manifest.json` at its root with:

- `schema` (or `generated`/`built`) — format version and build time (UTC)
- `sources` — each source's id, name, landing page, status, record counts and stated limits
- checksums for the published files

The site only switches to a new snapshot after its checks pass, so a failed source keeps its last good data, marked with its real collection date.

| Branch | Main files | Updated by | Notes |
|---|---|---|---|
| `fda-feed-cache` | `fda-feeds.json` | Refresh public PV data | Regulator and news updates; the site's runtime snapshot is built from it |
| `safety-data-cache` | `manifest.json` and data files | Refresh product safety snapshot (weekly) and the twice-daily DailyMed/alerts check | openFDA counts are reports, not incidence; see the site's safety snapshot page for interpretation |
| `approvals-data-cache` | `manifest.json` and data files | Refresh approvals (weekly) | First and latest approvals by market |
| `regulatory-dates-cache` | `manifest.json` and data files | Refresh regulatory calendar dates (weekly) | Counts by kind and country in the manifest |
| `codex/country-products-cache` | `manifest.json`, gzip shards | Refresh country product registries (weekly) | Source formats and limits per register in the manifest |
| `product-data-cache` | `registry.json`, `substance-products.json` | Refresh company registry | Holder-to-company links keep the source record locator and file hash |
| `clinical-data-cache` | `clinical/<company>.json` | Backfill public company clinical portfolios | From public trial registries |
| `evidence-data-cache` | `manifest.json` | Evidence repository (weekly) | Large files are release assets (`evidence-…` releases) |
| `literature-data-cache` | `index.json`, `objects/` | Literature watch (weekly, when enabled) | Bibliographic metadata only |
| `regulatory-document-cache` | `index.json`, `documents/<id>/<sha256>.json` | Collect regulatory source documents | Key information per archived version, addressed by content hash |
| `document-text-cache` | `<document-id>/…`, `index.json` | Document text for requirement curation (daily) | Plain text (with OCR where needed) of public regulatory documents |
| `curated-requirements` | `manifest.json`, `*.json` payloads | Publish curated requirements | Only files that passed the curation checks; the database fetches and loads them |

## Citing

Cite the original source named in the manifest (agency, document or database, and its date), and PV Info with the snapshot date and branch commit, for example: "PV Info safety snapshot, safety-data-cache @ <commit>, built 2026-11-09".
