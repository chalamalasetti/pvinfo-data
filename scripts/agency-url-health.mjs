// Checks candidate agency URLs (data/agency-url-candidates.json) and writes
// data/agency-url-health.json. HEAD first, GET fallback; 15 s timeout; 4 at a time.
// Usage: node scripts/agency-url-health.mjs [input.json] [output.json]
import fs from 'node:fs';

const input = process.argv[2] || 'data/agency-url-candidates.json';
const output = process.argv[3] || 'data/agency-url-health.json';
const TIMEOUT_MS = 15000;
const PARALLEL = 4;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const HEADERS = {'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8', 'accept-language': 'en;q=0.9,*;q=0.5'};

async function request(url, method) {
  const res = await fetch(url, {method, headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS)});
  if (res.body) await res.body.cancel().catch(() => {});
  return {status: res.status, final_url: res.url || url, content_type: (res.headers.get('content-type') || '').split(';')[0].trim() || null};
}

async function check(row) {
  const checked_at = new Date().toISOString();
  let result = null, error = null, method = 'HEAD';
  try { result = await request(row.url, 'HEAD'); } catch (e) { error = e; }
  if (!result || result.status >= 400) {
    method = 'GET';
    try { result = await request(row.url, 'GET'); error = null; } catch (e) { if (!result) error = e; }
  }
  if (!result) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return {...row, status: null, final_url: null, content_type: null, method, checked_at, ok: false,
      error: timeout ? 'timeout' : String(error?.cause?.code || error?.message || error).slice(0, 120)};
  }
  return {...row, ...result, method, checked_at, ok: result.status >= 200 && result.status < 400,
    redirected: result.final_url !== row.url};
}

const rows = JSON.parse(fs.readFileSync(input, 'utf8')).urls;
const results = new Array(rows.length);
let next = 0;
await Promise.all(Array.from({length: PARALLEL}, async () => {
  while (next < rows.length) { const i = next++; results[i] = await check(rows[i]); }
}));

const summary = {total: results.length, ok: 0, redirect: 0, '4xx': 0, '5xx': 0, timeout: 0, error: 0};
for (const r of results) {
  if (r.error === 'timeout') summary.timeout++;
  else if (r.error) summary.error++;
  else if (r.status >= 500) summary['5xx']++;
  else if (r.status >= 400) summary['4xx']++;
  else { summary.ok++; if (r.redirected) summary.redirect++; }
}
fs.writeFileSync(output, JSON.stringify({checked_at: new Date().toISOString(), source: input, summary, results}, null, 1) + '\n');
console.log('Agency URL health:', JSON.stringify(summary));
console.log('(redirect counts URLs that were ok after following a redirect; error = DNS/TLS/connection failures)');
for (const r of results.filter(r => !r.ok)) console.log(`NOT OK ${r.agency_id} ${r.field} ${r.url} -> ${r.status ?? r.error}`);
