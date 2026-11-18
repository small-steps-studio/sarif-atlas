'use strict';
// Contract tests: written from the specification examples. Do not edit; fix src/core.js instead.
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../src/core');

const plain = (v) => JSON.parse(JSON.stringify(v === undefined ? null : v));

test('core exports every specified function', () => {
  for (const n of ["effectiveLevel", "resultLocation", "isSuppressed", "ruleInfo", "reportSummary", "reportResultsByFile", "reportTopRules", "reportNewResults", "reportSuppressions"]) assert.equal(typeof core[n], 'function', n);
});

test("effectiveLevel example 1", () => {
  assert.deepStrictEqual(plain(core.effectiveLevel({"level": "error"}, null)), "error");
});

test("effectiveLevel example 2", () => {
  assert.deepStrictEqual(plain(core.effectiveLevel({}, {"defaultConfiguration": {"level": "note"}})), "note");
});

test("effectiveLevel example 3", () => {
  assert.deepStrictEqual(plain(core.effectiveLevel({}, null)), "warning");
});

test("effectiveLevel example 4", () => {
  assert.deepStrictEqual(plain(core.effectiveLevel({"kind": "pass"}, null)), "none");
});

test("resultLocation example 1", () => {
  assert.deepStrictEqual(plain(core.resultLocation({"ruleId": "JS001", "ruleIndex": 0, "message": {"text": "eval is used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 12}}}], "baselineState": "new"})), "src/app.js:12");
});

test("resultLocation example 2", () => {
  assert.deepStrictEqual(plain(core.resultLocation({"ruleId": "JS003", "message": {"text": "line too long"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}}}], "baselineState": "new"})), "src/util.js");
});

test("resultLocation example 3", () => {
  assert.deepStrictEqual(plain(core.resultLocation({})), "(no location)");
});

test("isSuppressed example 1", () => {
  assert.deepStrictEqual(plain(core.isSuppressed({"suppressions": [{"kind": "inSource"}]})), true);
});

test("isSuppressed example 2", () => {
  assert.deepStrictEqual(plain(core.isSuppressed({"suppressions": [{"kind": "external", "status": "rejected"}]})), false);
});

test("isSuppressed example 3", () => {
  assert.deepStrictEqual(plain(core.isSuppressed({"suppressions": []})), false);
});

test("isSuppressed example 4", () => {
  assert.deepStrictEqual(plain(core.isSuppressed({})), false);
});

test("ruleInfo example 1", () => {
  assert.deepStrictEqual(plain(core.ruleInfo({"tool": {"driver": {"name": "CodeScan", "version": "3.2.0", "rules": [{"id": "JS001", "name": "NoEval", "shortDescription": {"text": "Avoid eval"}, "defaultConfiguration": {"level": "error"}}, {"id": "JS002", "name": "UnusedVar", "shortDescription": {"text": "Unused variable"}, "defaultConfiguration": {"level": "note"}}]}}, "results": [{"ruleId": "JS001", "ruleIndex": 0, "message": {"text": "eval is used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 12}}}], "baselineState": "new"}, {"ruleId": "JS002", "ruleIndex": 1, "message": {"text": "x is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 3}}}], "baselineState": "unchanged"}, {"ruleId": "JS002", "ruleIndex": 1, "level": "warning", "message": {"text": "y is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}, "region": {"startLine": 7}}}], "baselineState": "unchanged", "suppressions": [{"kind": "inSource", "justification": "kept for API"}]}, {"ruleId": "JS003", "message": {"text": "line too long"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}}}], "baselineState": "new"}]}, {"ruleId": "JS002", "ruleIndex": 1})), {"id": "JS002", "name": "UnusedVar", "description": "Unused variable", "level": "note"});
});

test("ruleInfo example 2", () => {
  assert.deepStrictEqual(plain(core.ruleInfo({"tool": {"driver": {"name": "CodeScan", "version": "3.2.0", "rules": [{"id": "JS001", "name": "NoEval", "shortDescription": {"text": "Avoid eval"}, "defaultConfiguration": {"level": "error"}}, {"id": "JS002", "name": "UnusedVar", "shortDescription": {"text": "Unused variable"}, "defaultConfiguration": {"level": "note"}}]}}, "results": [{"ruleId": "JS001", "ruleIndex": 0, "message": {"text": "eval is used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 12}}}], "baselineState": "new"}, {"ruleId": "JS002", "ruleIndex": 1, "message": {"text": "x is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 3}}}], "baselineState": "unchanged"}, {"ruleId": "JS002", "ruleIndex": 1, "level": "warning", "message": {"text": "y is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}, "region": {"startLine": 7}}}], "baselineState": "unchanged", "suppressions": [{"kind": "inSource", "justification": "kept for API"}]}, {"ruleId": "JS003", "message": {"text": "line too long"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}}}], "baselineState": "new"}]}, {"ruleId": "JS001"})), {"id": "JS001", "name": "NoEval", "description": "Avoid eval", "level": "error"});
});

test("ruleInfo example 3", () => {
  assert.deepStrictEqual(plain(core.ruleInfo({"tool": {"driver": {"name": "CodeScan", "version": "3.2.0", "rules": [{"id": "JS001", "name": "NoEval", "shortDescription": {"text": "Avoid eval"}, "defaultConfiguration": {"level": "error"}}, {"id": "JS002", "name": "UnusedVar", "shortDescription": {"text": "Unused variable"}, "defaultConfiguration": {"level": "note"}}]}}, "results": [{"ruleId": "JS001", "ruleIndex": 0, "message": {"text": "eval is used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 12}}}], "baselineState": "new"}, {"ruleId": "JS002", "ruleIndex": 1, "message": {"text": "x is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/app.js"}, "region": {"startLine": 3}}}], "baselineState": "unchanged"}, {"ruleId": "JS002", "ruleIndex": 1, "level": "warning", "message": {"text": "y is never used"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}, "region": {"startLine": 7}}}], "baselineState": "unchanged", "suppressions": [{"kind": "inSource", "justification": "kept for API"}]}, {"ruleId": "JS003", "message": {"text": "line too long"}, "locations": [{"physicalLocation": {"artifactLocation": {"uri": "src/util.js"}}}], "baselineState": "new"}]}, {"ruleId": "JS003"})), {"id": "JS003", "name": "", "description": "", "level": "warning"});
});

test("reportSummary example 1", () => {
  const md = core.reportSummary("{\"version\": \"2.1.0\", \"$schema\": \"https://json.schemastore.org/sarif-2.1.0.json\", \"runs\": [{\"tool\": {\"driver\": {\"name\": \"CodeScan\", \"version\": \"3.2.0\", \"rules\": [{\"id\": \"JS001\", \"name\": \"NoEval\", \"shortDescription\": {\"text\": \"Avoid eval\"}, \"defaultConfiguration\": {\"level\": \"error\"}}, {\"id\": \"JS002\", \"name\": \"UnusedVar\", \"shortDescription\": {\"text\": \"Unused variable\"}, \"defaultConfiguration\": {\"level\": \"note\"}}]}}, \"results\": [{\"ruleId\": \"JS001\", \"ruleIndex\": 0, \"message\": {\"text\": \"eval is used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 12}}}], \"baselineState\": \"new\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"message\": {\"text\": \"x is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 3}}}], \"baselineState\": \"unchanged\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"level\": \"warning\", \"message\": {\"text\": \"y is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}, \"region\": {\"startLine\": 7}}}], \"baselineState\": \"unchanged\", \"suppressions\": [{\"kind\": \"inSource\", \"justification\": \"kept for API\"}]}, {\"ruleId\": \"JS003\", \"message\": {\"text\": \"line too long\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}}}], \"baselineState\": \"new\"}]}]}");
  assert.equal(typeof md, 'string');
  for (const s of ["# SARIF Summary", "4 results from 1 run (CodeScan 3.2.0).", "| error | 1 |", "| warning | 1 |", "| note | 1 |", "1 suppressed result.", "3 rules triggered."]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportSummary example 2", () => {
  const md = core.reportSummary("not a sarif log");
  assert.equal(typeof md, 'string');
  for (const s of ["# SARIF Summary", "This file is not a valid SARIF log"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportResultsByFile example 1", () => {
  const md = core.reportResultsByFile("{\"version\": \"2.1.0\", \"$schema\": \"https://json.schemastore.org/sarif-2.1.0.json\", \"runs\": [{\"tool\": {\"driver\": {\"name\": \"CodeScan\", \"version\": \"3.2.0\", \"rules\": [{\"id\": \"JS001\", \"name\": \"NoEval\", \"shortDescription\": {\"text\": \"Avoid eval\"}, \"defaultConfiguration\": {\"level\": \"error\"}}, {\"id\": \"JS002\", \"name\": \"UnusedVar\", \"shortDescription\": {\"text\": \"Unused variable\"}, \"defaultConfiguration\": {\"level\": \"note\"}}]}}, \"results\": [{\"ruleId\": \"JS001\", \"ruleIndex\": 0, \"message\": {\"text\": \"eval is used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 12}}}], \"baselineState\": \"new\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"message\": {\"text\": \"x is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 3}}}], \"baselineState\": \"unchanged\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"level\": \"warning\", \"message\": {\"text\": \"y is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}, \"region\": {\"startLine\": 7}}}], \"baselineState\": \"unchanged\", \"suppressions\": [{\"kind\": \"inSource\", \"justification\": \"kept for API\"}]}, {\"ruleId\": \"JS003\", \"message\": {\"text\": \"line too long\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}}}], \"baselineState\": \"new\"}]}]}");
  assert.equal(typeof md, 'string');
  for (const s of ["# Results by File", "| src/app.js | 1 | 0 | 1 | 2 |", "| src/util.js | 0 | 1 | 0 | 1 |"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportResultsByFile example 2", () => {
  const md = core.reportResultsByFile("not a sarif log");
  assert.equal(typeof md, 'string');
  for (const s of ["# Results by File", "This file is not a valid SARIF log"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportTopRules example 1", () => {
  const md = core.reportTopRules("{\"version\": \"2.1.0\", \"$schema\": \"https://json.schemastore.org/sarif-2.1.0.json\", \"runs\": [{\"tool\": {\"driver\": {\"name\": \"CodeScan\", \"version\": \"3.2.0\", \"rules\": [{\"id\": \"JS001\", \"name\": \"NoEval\", \"shortDescription\": {\"text\": \"Avoid eval\"}, \"defaultConfiguration\": {\"level\": \"error\"}}, {\"id\": \"JS002\", \"name\": \"UnusedVar\", \"shortDescription\": {\"text\": \"Unused variable\"}, \"defaultConfiguration\": {\"level\": \"note\"}}]}}, \"results\": [{\"ruleId\": \"JS001\", \"ruleIndex\": 0, \"message\": {\"text\": \"eval is used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 12}}}], \"baselineState\": \"new\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"message\": {\"text\": \"x is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 3}}}], \"baselineState\": \"unchanged\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"level\": \"warning\", \"message\": {\"text\": \"y is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}, \"region\": {\"startLine\": 7}}}], \"baselineState\": \"unchanged\", \"suppressions\": [{\"kind\": \"inSource\", \"justification\": \"kept for API\"}]}, {\"ruleId\": \"JS003\", \"message\": {\"text\": \"line too long\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}}}], \"baselineState\": \"new\"}]}]}");
  assert.equal(typeof md, 'string');
  for (const s of ["# Top Rules", "| JS001 | NoEval | error | 1 | Avoid eval |", "| JS002 | UnusedVar | note | 1 | Unused variable |"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportTopRules example 2", () => {
  const md = core.reportTopRules("not a sarif log");
  assert.equal(typeof md, 'string');
  for (const s of ["# Top Rules", "This file is not a valid SARIF log"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportNewResults example 1", () => {
  const md = core.reportNewResults("{\"version\": \"2.1.0\", \"$schema\": \"https://json.schemastore.org/sarif-2.1.0.json\", \"runs\": [{\"tool\": {\"driver\": {\"name\": \"CodeScan\", \"version\": \"3.2.0\", \"rules\": [{\"id\": \"JS001\", \"name\": \"NoEval\", \"shortDescription\": {\"text\": \"Avoid eval\"}, \"defaultConfiguration\": {\"level\": \"error\"}}, {\"id\": \"JS002\", \"name\": \"UnusedVar\", \"shortDescription\": {\"text\": \"Unused variable\"}, \"defaultConfiguration\": {\"level\": \"note\"}}]}}, \"results\": [{\"ruleId\": \"JS001\", \"ruleIndex\": 0, \"message\": {\"text\": \"eval is used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 12}}}], \"baselineState\": \"new\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"message\": {\"text\": \"x is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 3}}}], \"baselineState\": \"unchanged\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"level\": \"warning\", \"message\": {\"text\": \"y is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}, \"region\": {\"startLine\": 7}}}], \"baselineState\": \"unchanged\", \"suppressions\": [{\"kind\": \"inSource\", \"justification\": \"kept for API\"}]}, {\"ruleId\": \"JS003\", \"message\": {\"text\": \"line too long\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}}}], \"baselineState\": \"new\"}]}]}");
  assert.equal(typeof md, 'string');
  for (const s of ["# New Results", "2 new results.", "| error | JS001 | src/app.js:12 | eval is used |", "| warning | JS003 | src/util.js | line too long |", "0 results absent since the baseline."]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportNewResults example 2", () => {
  const md = core.reportNewResults("not a sarif log");
  assert.equal(typeof md, 'string');
  for (const s of ["# New Results", "This file is not a valid SARIF log"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportSuppressions example 1", () => {
  const md = core.reportSuppressions("{\"version\": \"2.1.0\", \"$schema\": \"https://json.schemastore.org/sarif-2.1.0.json\", \"runs\": [{\"tool\": {\"driver\": {\"name\": \"CodeScan\", \"version\": \"3.2.0\", \"rules\": [{\"id\": \"JS001\", \"name\": \"NoEval\", \"shortDescription\": {\"text\": \"Avoid eval\"}, \"defaultConfiguration\": {\"level\": \"error\"}}, {\"id\": \"JS002\", \"name\": \"UnusedVar\", \"shortDescription\": {\"text\": \"Unused variable\"}, \"defaultConfiguration\": {\"level\": \"note\"}}]}}, \"results\": [{\"ruleId\": \"JS001\", \"ruleIndex\": 0, \"message\": {\"text\": \"eval is used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 12}}}], \"baselineState\": \"new\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"message\": {\"text\": \"x is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/app.js\"}, \"region\": {\"startLine\": 3}}}], \"baselineState\": \"unchanged\"}, {\"ruleId\": \"JS002\", \"ruleIndex\": 1, \"level\": \"warning\", \"message\": {\"text\": \"y is never used\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}, \"region\": {\"startLine\": 7}}}], \"baselineState\": \"unchanged\", \"suppressions\": [{\"kind\": \"inSource\", \"justification\": \"kept for API\"}]}, {\"ruleId\": \"JS003\", \"message\": {\"text\": \"line too long\"}, \"locations\": [{\"physicalLocation\": {\"artifactLocation\": {\"uri\": \"src/util.js\"}}}], \"baselineState\": \"new\"}]}]}");
  assert.equal(typeof md, 'string');
  for (const s of ["# Suppressions", "1 suppressed result.", "| JS002 | src/util.js:7 | inSource | accepted | kept for API |"]) assert.ok(md.includes(s), 'missing: ' + s);
});

test("reportSuppressions example 2", () => {
  const md = core.reportSuppressions("not a sarif log");
  assert.equal(typeof md, 'string');
  for (const s of ["# Suppressions", "This file is not a valid SARIF log"]) assert.ok(md.includes(s), 'missing: ' + s);
});
