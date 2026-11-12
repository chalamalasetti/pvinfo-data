import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from 'yaml';
import {buildWorkflow, render, MARKER} from '../scripts/build-jobs.mjs';

const job = `name: Demo
on:
  schedule:
    - cron: '1 2 * * *'
  workflow_dispatch:
  push:
    branches: [main]
  pull_request:
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4
        with: {repository: someone/else, path: other}
      - run: echo hi
`;

test('keeps schedule and manual triggers, drops push and pull_request', () => {
  const w = buildWorkflow('demo.yml', job);
  assert.deepEqual(Object.keys(w.on).sort(), ['schedule', 'workflow_dispatch']);
});

test('checks out the private code repository without persisted credentials and points origin here', () => {
  const steps = buildWorkflow('demo.yml', job).jobs.run.steps;
  assert.equal(steps[0].with.repository, 'chalamalasetti/PV-Info');
  assert.equal(steps[0].with['persist-credentials'], false);
  assert.match(steps[0].with.token, /PVINFO_CODE_TOKEN/);
  assert.match(steps[1].run, /remote set-url origin .*github\.repository/);
  assert.equal(steps[2].with.repository, 'someone/else', 'other checkouts are left alone');
});

test('push-only workflows are skipped', () => {
  assert.equal(buildWorkflow('x.yml', 'on: {push: {}}\njobs: {a: {runs-on: ubuntu-latest, steps: [{run: "true"}]}}'), null);
  assert.equal(buildWorkflow('data-repo-copy.yml', job), null);
});

test('CI becomes a polling check that posts commit statuses on PV-Info', () => {
  const w = buildWorkflow('ci.yml', 'on: {pull_request: {}}\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test\n');
  assert.deepEqual(Object.keys(w.on).sort(), ['schedule', 'workflow_dispatch']);
  assert.equal(w.jobs.test.needs, 'plan');
  assert.equal(w.jobs.test.steps[1].with.ref, '${{ matrix.target.ref }}');
  assert.match(w.jobs.plan.steps[0].with.script, /merge_commit_sha/);
  assert.match(w.jobs.test.steps.at(-1).with.script, /createCommitStatus/);
  assert.equal(w.jobs.test.steps.at(-1).if, 'always()');
});

test('merge-conflict status waits for computed mergeability and is cleared when resolved', async () => {
  const w = buildWorkflow('ci.yml', 'on: {pull_request: {}}\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n');
  const script = w.jobs.plan.steps[0].with.script;
  assert.match(script, /mergeable === null/);
  assert.match(script, /No conflicts with main/);
  const AsyncFunction = (async () => {}).constructor;
  assert.doesNotThrow(() => new AsyncFunction('github', 'core', script.replace(/\$\{\{[^}]+\}\}/g, '')));
});

test('curated requirements publish the newest curation commit on a poll', () => {
  const w = buildWorkflow('curated-requirements.yml', 'name: C\non: {push: {}}\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n');
  assert.equal(w.jobs.publish.needs, 'pick');
  assert.equal(w.jobs.publish.steps[0].with.ref, '${{ needs.pick.outputs.sha }}');
});

test('rendered files carry the generated marker and parse', () => {
  const text = render('demo.yml', buildWorkflow('demo.yml', job));
  assert.ok(text.startsWith(MARKER));
  assert.equal(parse(text).name, 'Demo');
});
