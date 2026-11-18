# e2b-sources

Unchanged copies of official E2B(R3) source files, fetched by the manual "Fetch public documents" job
(pvinfo-data run 44201429049, 2026-11-17 23:42 UTC). FDA files are US government works.
The four PV Info bucket files are byte-identical to the archived official captures (file name = document id;
the sha256 in the bucket path matches).

- sources/SHA256SUMS: checksums (verify with `sha256sum -c`)
- sources/MANIFEST.tsv: source URL, content type, size and fetch time per file

The HTTP Last-Modified header was not recorded by the fetch job; fetched_utc is the retrieval time.
Note: ich-e2b-r3-ig-fda-edition.pdf and e2b-ich-core.pdf are the same file (same sha256).

## 2026-11-18 additions (EMA, MHRA, PMDA)
Fetched by "Fetch public documents" runs 44216079133, 44216178834 and 44216384928 from official hosts only
(www.ema.europa.eu, assets.publishing.service.gov.uk, www.pmda.go.jp). MANIFEST.tsv now has a page_title column
(first text line of the document) and lists files that could not be fetched as MISSING rows.
PMDA files are Japanese originals except the two "provisional-translation" files (official PMDA English reference translations).
