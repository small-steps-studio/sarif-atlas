'use strict';
// Builds a SARIF text of about `bytes` characters for the large-file test (invented results).
function make(bytes) {
  const rules = Array.from({ length: 30 }, (_, i) => ({ id: 'EX' + String(i).padStart(3, '0'), name: 'Rule' + i, shortDescription: { text: 'Example rule ' + i }, defaultConfiguration: { level: ['error', 'warning', 'note'][i % 3] } }));
  const head = '{"version":"2.1.0","runs":[{"tool":{"driver":{"name":"Example Analyzer","version":"4.2.0","rules":' + JSON.stringify(rules) + '}},"results":[';
  const parts = [head]; let size = head.length, i = 0;
  while (size < bytes) {
    const c = '{"ruleId":"EX' + String(i % 30).padStart(3, '0') + '","ruleIndex":' + (i % 30) + ',"baselineState":"' + ['new', 'unchanged', 'absent'][i % 3] + '","message":{"text":"' + 'x'.repeat(150) + '"},' +
      '"locations":[{"physicalLocation":{"artifactLocation":{"uri":"src/module' + (i % 400) + '/file' + (i % 7) + '.js"},"region":{"startLine":' + (1 + i % 900) + '}}}]' + (i % 50 === 0 ? ',"suppressions":[{"kind":"inSource"}]' : '') + '}';
    parts.push((i ? ',' : '') + c); size += c.length + 1; i++;
  }
  parts.push(']}]}');
  return parts.join('');
}
module.exports = { make };
