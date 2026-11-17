# e2b-sources

Unchanged copies of official E2B(R3) source files, fetched by the manual "Fetch public documents" job
(pvinfo-data run 44201429049, 2026-11-17 23:42 UTC). FDA files are US government works.
The four PV Info bucket files are byte-identical to the archived official captures (file name = document id;
the sha256 in the bucket path matches).

- sources/SHA256SUMS: checksums (verify with `sha256sum -c`)
- sources/MANIFEST.tsv: source URL, content type, size and fetch time per file

The HTTP Last-Modified header was not recorded by the fetch job; fetched_utc is the retrieval time.
Note: ich-e2b-r3-ig-fda-edition.pdf and e2b-ich-core.pdf are the same file (same sha256).
