'use strict';

const LEVELS = ['error', 'warning', 'note', 'none'];
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
const arr = (v) => (Array.isArray(v) ? v : []);
const idx = (v) => (Number.isInteger(v) && v >= 0 ? v : -1);

function effectiveLevel(result, rule) {
  const r = isObj(result) ? result : {};
  if (LEVELS.includes(r.level)) return r.level;
  if (typeof r.kind === 'string' && r.kind && r.kind !== 'fail') return 'none';
  const dc = isObj(rule) && isObj(rule.defaultConfiguration) ? rule.defaultConfiguration : null;
  if (dc && LEVELS.includes(dc.level)) return dc.level;
  return 'warning';
}

function resultLocation(result) {
  const loc = isObj(result) ? arr(result.locations)[0] : null;
  const pl = isObj(loc) && isObj(loc.physicalLocation) ? loc.physicalLocation : null;
  let uri = pl && isObj(pl.artifactLocation) ? str(pl.artifactLocation.uri) : '';
  if (!uri) return '(no location)';
  if (/^file:\/\//i.test(uri)) {                       // file:///C:/a%20b/x.js -> C:/a b/x.js ; file:///home/x.js -> /home/x.js
    uri = uri.replace(/^file:\/\//i, '').replace(/^\/([A-Za-z]:\/)/, '$1');
    try { uri = decodeURIComponent(uri); } catch (e) { /* malformed escapes: keep the text as written */ }
  }
  const line = pl && isObj(pl.region) && Number.isInteger(pl.region.startLine) && pl.region.startLine > 0 ? pl.region.startLine : 0;
  return line ? uri + ':' + line : uri;
}

function isSuppressed(result) {
  const s = isObj(result) ? result.suppressions : null;
  return Array.isArray(s) && s.some((x) => isObj(x) && (x.status === undefined || x.status === 'accepted'));
}

// The rules a result refers to: tool.extensions[k].rules when result.rule.toolComponent.index = k, else tool.driver.rules.
function rulesFor(run, r) {
  const tool = isObj(run) && isObj(run.tool) ? run.tool : {};
  const ref = isObj(r.rule) ? r.rule : {};
  const tc = isObj(ref.toolComponent) ? idx(ref.toolComponent.index) : -1;
  const comp = tc >= 0 ? arr(tool.extensions)[tc] : tool.driver;
  return isObj(comp) ? arr(comp.rules) : [];
}

function findRule(run, r) {
  const rules = rulesFor(run, r);
  const ref = isObj(r.rule) ? r.rule : {};
  const i = idx(ref.index) >= 0 ? idx(ref.index) : idx(r.ruleIndex);
  if (i >= 0 && i < rules.length && isObj(rules[i])) return rules[i];
  const id = str(r.ruleId) || str(ref.id);
  return (id && rules.find((x) => isObj(x) && x.id === id)) || null;
}

function ruleInfo(run, result) {
  const r = isObj(result) ? result : {};
  const rule = findRule(run, r) || {};
  const ref = isObj(r.rule) ? r.rule : {};
  const dc = isObj(rule.defaultConfiguration) ? rule.defaultConfiguration : {};
  return { id: str(rule.id) || str(r.ruleId) || str(ref.id), name: str(rule.name),
    description: isObj(rule.shortDescription) ? str(rule.shortDescription.text) : '', level: LEVELS.includes(dc.level) ? dc.level : 'warning' };
}

const cell = (s) => String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').replace(/([\\`*_{}\[\]()#+!|<>~&$])/g, '\\$1')
  .split('://').join('\\:\\/\\/').replace(/(^|[^A-Za-z0-9])www\./gi, (m, pre) => pre + m.slice(pre.length, pre.length + 3) + '\\.');

function parseSarif(text) {
  let data;
  try { data = JSON.parse(String(text == null ? '' : text).replace(/^﻿/, '')); } catch (e) { return { error: 'the text is not JSON' }; }
  if (!isObj(data) || !Array.isArray(data.runs)) return { error: 'runs is missing' };
  return { data };
}

// Every result of every run, with its run and its rule; runs and results that are not objects are skipped.
function collect(runs) {
  const all = [];
  for (const run of runs) {
    if (!isObj(run)) continue;
    for (const r of arr(run.results)) if (isObj(r)) all.push({ result: r, run, rule: findRule(run, r) });
  }
  return all;
}

const escapeCell = cell;
const ALL_SUPPRESSED = 'Every result in this log is suppressed (see Show Suppression Audit).';
const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function load(text, heading) {
  const parsed = parseSarif(text);
  if (parsed.error) return { md: `${heading}\n\nThis file is not a valid SARIF log: ${parsed.error}.` };
  const allResults = collect(parsed.data.runs);
  if (allResults.length === 0) return { md: `${heading}\n\nThe SARIF log contains no results.` };
  return { runs: parsed.data.runs, allResults, activeResults: allResults.filter((item) => !isSuppressed(item.result)) };
}

function reportSummary(text) {
  const heading = '# SARIF Summary';
  const L = load(text, heading);
  if (L.md) return L.md;

  const toolNames = L.runs.map((run) => {
    const driver = isObj(run) && isObj(run.tool) && isObj(run.tool.driver) ? run.tool.driver : {};
    return escapeCell(((str(driver.name) || 'unknown') + ' ' + str(driver.version)).trim());
  });
  const levelCounts = { error: 0, warning: 0, note: 0, none: 0 };
  const ruleIds = new Set();
  for (const item of L.activeResults) {
    levelCounts[effectiveLevel(item.result, item.rule)]++;
    ruleIds.add(ruleInfo(item.run, item.result).id);
  }
  const totalResults = L.allResults.length;
  const suppressedCount = totalResults - L.activeResults.length;

  const lines = [heading, ''];
  lines.push(`${totalResults} ${pluralize(totalResults, 'result', 'results')} from ${L.runs.length} ${pluralize(L.runs.length, 'run', 'runs')} (${toolNames.join(', ')}).`);
  lines.push('');
  if (L.activeResults.length) {
    lines.push('| Level | Results |');
    lines.push('| --- | ---: |');
    for (const level of LEVELS) if (levelCounts[level] > 0) lines.push(`| ${level} | ${levelCounts[level]} |`);
  } else {
    lines.push(ALL_SUPPRESSED);
  }
  lines.push('');
  lines.push(`${suppressedCount} ${pluralize(suppressedCount, 'suppressed result', 'suppressed results')}.`);
  lines.push('');
  lines.push(`${ruleIds.size} ${pluralize(ruleIds.size, 'rule triggered', 'rules triggered')}.`);
  return lines.join('\n');
}

function reportResultsByFile(text) {
  const heading = '# Results by File';
  const L = load(text, heading);
  if (L.md) return L.md;
  if (!L.activeResults.length) return `${heading}\n\n${ALL_SUPPRESSED}`;

  const fileMap = new Map();
  for (const item of L.activeResults) {
    const file = resultLocation(item.result).replace(/:\d+$/, '');   // only the line number is cut: C:/x.js stays whole
    const level = effectiveLevel(item.result, item.rule);
    if (!fileMap.has(file)) fileMap.set(file, { errors: 0, warnings: 0, notes: 0, total: 0 });
    const stats = fileMap.get(file);
    stats.total++;
    if (level === 'error') stats.errors++;
    else if (level === 'warning') stats.warnings++;
    else if (level === 'note') stats.notes++;
  }
  const files = Array.from(fileMap.entries()).map(([file, stats]) => ({ file, ...stats }));
  files.sort((a, b) => b.total - a.total || byText(a.file, b.file));

  const lines = [heading, ''];
  lines.push('| File | Errors | Warnings | Notes | Total |');
  lines.push('| --- | ---: | ---: | ---: | ---: |');
  for (const f of files) lines.push(`| ${escapeCell(f.file)} | ${f.errors} | ${f.warnings} | ${f.notes} | ${f.total} |`);
  return lines.join('\n');
}

function reportTopRules(text) {
  const heading = '# Top Rules';
  const L = load(text, heading);
  if (L.md) return L.md;
  if (!L.activeResults.length) return `${heading}\n\n${ALL_SUPPRESSED}`;

  const ruleMap = new Map();
  for (const item of L.activeResults) {
    const info = ruleInfo(item.run, item.result);
    if (!ruleMap.has(info.id)) ruleMap.set(info.id, { id: info.id, name: info.name, level: info.level, description: info.description, count: 0 });
    ruleMap.get(info.id).count++;
  }
  const rules = Array.from(ruleMap.values());
  rules.sort((a, b) => b.count - a.count || byText(a.id, b.id));

  const lines = [heading, ''];
  lines.push('| Rule | Name | Default level | Results | Description |');
  lines.push('| --- | --- | --- | ---: | --- |');
  for (const r of rules.slice(0, 25)) {
    lines.push(`| ${r.id ? escapeCell(r.id) : '(no rule id)'} | ${escapeCell(r.name)} | ${r.level} | ${r.count} | ${escapeCell(r.description)} |`);
  }
  if (rules.length > 25) {
    lines.push('');
    lines.push(`Showing the 25 most frequent of ${rules.length} rules.`);
  }
  return lines.join('\n');
}

function reportNewResults(text) {
  const heading = '# New Results';
  const L = load(text, heading);
  if (L.md) return L.md;
  if (!L.allResults.some((item) => str(item.result.baselineState))) return `${heading}\n\nThis log has no baseline information (baselineState).`;

  const newResults = L.activeResults.filter((item) => item.result.baselineState === 'new');
  const absentCount = L.allResults.filter((item) => item.result.baselineState === 'absent').length;

  const lines = [heading, ''];
  lines.push(`${newResults.length} ${pluralize(newResults.length, 'new result', 'new results')}.`);
  if (newResults.length) {
    lines.push('');
    lines.push('| Level | Rule | Location | Message |');
    lines.push('| --- | --- | --- | --- |');
    for (const item of newResults) {
      const msg = isObj(item.result.message) ? str(item.result.message.text) : '';
      lines.push(`| ${effectiveLevel(item.result, item.rule)} | ${escapeCell(ruleInfo(item.run, item.result).id)} | ${escapeCell(resultLocation(item.result))} | ${escapeCell(msg)} |`);
    }
  }
  lines.push('');
  lines.push(`${absentCount} ${pluralize(absentCount, 'result', 'results')} absent since the baseline.`);
  return lines.join('\n');
}

function reportSuppressions(text) {
  const heading = '# Suppressions';
  const L = load(text, heading);
  if (L.md) return L.md;

  const suppressionRows = [];
  for (const item of L.allResults) {
    for (const s of arr(item.result.suppressions)) {
      if (!isObj(s)) continue;
      suppressionRows.push({ ruleId: ruleInfo(item.run, item.result).id, loc: resultLocation(item.result), kind: str(s.kind),
        status: s.status === undefined ? 'accepted' : str(s.status), justification: str(s.justification) });
    }
  }
  if (suppressionRows.length === 0) return `${heading}\n\nNo suppressions in this log.`;

  const suppressedCount = L.allResults.length - L.activeResults.length;
  const lines = [heading, ''];
  lines.push(`${suppressedCount} ${pluralize(suppressedCount, 'suppressed result', 'suppressed results')}.`);
  lines.push('');
  lines.push('| Rule | Location | Kind | Status | Justification |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const row of suppressionRows) {
    lines.push(`| ${escapeCell(row.ruleId)} | ${escapeCell(row.loc)} | ${escapeCell(row.kind)} | ${escapeCell(row.status)} | ${escapeCell(row.justification)} |`);
  }
  return lines.join('\n');
}

module.exports = {
  effectiveLevel,
  resultLocation,
  isSuppressed,
  ruleInfo,
  reportSummary,
  reportResultsByFile,
  reportTopRules,
  reportNewResults,
  reportSuppressions
};
