'use strict';
// Hostile and odd SARIF logs for the adversarial test (invented; the payloads must come out as plain escaped text).
const PAY = ['x | <b>y</b> [link](https://evil.test)', '![t](https://evil.test/p.png)', '<img src=https://evil.test/i.png>', '`code` *b* _i_ ~s~ # h', '<script>alert(1)</script>', 'a|b|c', 'Cost $5 and $x$ here', '\| escaped', 'line\nbreak',
  'see https://evil.test/a?b=c and www.evil.test, mailto:x@evil.test', '\://', 'file://evil.test/x'];
const cases = [];
PAY.forEach((p, i) => {
  const rule = { id: p, name: p, shortDescription: { text: p }, defaultConfiguration: { level: p } };
  const res = { ruleId: p, level: p, kind: p, baselineState: 'new', message: { text: p }, locations: [{ physicalLocation: { artifactLocation: { uri: p }, region: { startLine: 3 } } }],
    suppressions: [{ kind: p, status: 'underReview', justification: p }] };
  cases.push({ name: 'payload ' + i, text: JSON.stringify({ version: '2.1.0', runs: [{ tool: { driver: { name: p, version: p, rules: [rule] } }, results: [res, Object.assign({}, res, { level: 'error', kind: undefined, suppressions: undefined })] }] }) });
});
const NAMES = ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf'];
cases.push({ name: 'prototype names', text: JSON.stringify({ version: '2.1.0', runs: [{ tool: { driver: { name: 'constructor', rules: NAMES.map((n) => ({ id: n, name: n })) } },
  results: NAMES.map((n, i) => ({ ruleId: n, ruleIndex: i, message: { text: n }, baselineState: 'new', locations: [{ physicalLocation: { artifactLocation: { uri: n } } }], suppressions: i % 2 ? [{ kind: n, status: n }] : undefined })) }] }) });
cases.push({ name: 'junk everywhere', text: JSON.stringify({ runs: [null, [], 'x', 1, { tool: [], results: {} }, { tool: { driver: [], extensions: 'x' }, results: [{ rule: 'x', ruleIndex: 1e309 }, { rule: { toolComponent: 'x', index: -1 }, ruleId: {} }, { rule: { toolComponent: { index: 99 }, index: 0 }, ruleId: 'Z' }] }] }) });
cases.push({ name: 'deep nesting', text: '{"version":"2.1.0","runs":[{"tool":{"driver":{"name":"n"}},"results":[{"ruleId":"A","message":{"text":"m"},"properties":' + '{"a":'.repeat(20000) + '1' + '}'.repeat(20000) + '}]}]}' });
cases.push({ name: 'huge strings', text: JSON.stringify({ version: '2.1.0', runs: [{ tool: { driver: { name: 'x'.repeat(100000) } }, results: [{ ruleId: 'y'.repeat(100000), message: { text: 'z|'.repeat(50000) } }] }] }) });
module.exports = { cases };
