# Reports

Every report reads the text of the active editor and opens its result as a new Markdown document. Your file is never changed and nothing is sent anywhere. The examples below come from the sample file (Open Sample File).

## Show Summary

Command: **SARIF Atlas: Show Summary**

Shows how many results the log holds, from how many runs and which tools (name and version), how many active results there are per level (error, warning, note, none), how many results are suppressed, and how many distinct rules fired. The level of a result is its own level, or none for results of another kind than fail, or the rule's default level, or warning, in that order, as SARIF 2.1.0 defines it. When every result is suppressed, the report says so.

Example (sample file):

> # SARIF Summary
>
> 14 results from 2 runs (Example Analyzer 4.2.0, example-secrets 1.4.2).
>
> | Level | Results |
> | --- | ---: |
> | error | 4 |
> | warning | 5 |
> | note | 2 |
> | none | 1 |
>
> 2 suppressed results.
>
> 8 rules triggered.

## Show Results By File

Command: **SARIF Atlas: Show Results By File**

Groups the active results by file and lists errors, warnings, notes and the total for each file, sorted by total (most first) and then by path. Results without a location are grouped as (no location). file:// paths are shown as ordinary paths, with Windows drive letters and encoded characters such as spaces restored.

Example (sample file):

> # Results by File
>
> | File | Errors | Warnings | Notes | Total |
> | --- | ---: | ---: | ---: | ---: |
> | src/api/orders.ts | 1 | 2 | 0 | 3 |
> | src/app.js | 1 | 0 | 1 | 2 |
> | src/legacy/report\_builder.cs | 0 | 1 | 1 | 2 |
> | src/util.js | 0 | 2 | 0 | 2 |
> | config/payments.js | 1 | 0 | 0 | 1 |
> | scripts/deploy.sh | 0 | 0 | 0 | 1 |
> | web/views/cart.html | 1 | 0 | 0 | 1 |

## Show Top Rules

Command: **SARIF Atlas: Show Top Rules**

Lists the rules behind the active results with the rule name, its default level, how many results it produced and its short description, sorted by number of results; at most 25 rules are shown, and the report says how many there are. Rules are found in the tool's driver and in its extensions, by index or by id.

Example (sample file):

> # Top Rules
>
> | Rule | Name | Default level | Results | Description |
> | --- | --- | --- | ---: | --- |
> | EX003 | LongLine | warning | 3 | Line too long |
> | EX002 | UnusedVar | note | 2 | Unused variable |
> | EX005 | WeakHash | warning | 2 | Weak hash algorithm |
> | EX001 | NoEval | error | 1 | Avoid eval |
> | EX004 | SqlConcat | error | 1 | SQL built by string concatenation |
> | EX006 | HardcodedSecret | error | 1 | Hard-coded credential |
> | EX007 | MissingCsrf | warning | 1 | Form without CSRF token |
> | EX008 | Todo | none | 1 | Leftover TODO comment |

## Show New Results (Pro)

Command: **SARIF Atlas: Show New Results** (Pro; part of the 14-day trial)

Uses the baselineState of each result, written by the scanning tool when it compares a run with an earlier one. Lists every active result marked new with its level, rule, location and message, in file order, and counts the results marked absent (present in the baseline, gone now). If no result in the log has a baselineState, the report says so.

Example (sample file):

> # New Results
>
> 4 new results.
>
> | Level | Rule | Location | Message |
> | --- | --- | --- | --- |
> | error | EX004 | src/api/orders.ts:88 | Order search builds SQL from the request query string. |
> | warning | EX005 | src/api/orders.ts:141 | MD5 is used for the order token. |
> | error | EX007 | web/views/cart.html:23 | The checkout form has no CSRF token. |
> | error | EX006 | config/payments.js:9 | An API key is written in the source. |
>
> 1 result absent since the baseline.

## Show Suppression Audit (Pro)

Command: **SARIF Atlas: Show Suppression Audit** (Pro; part of the 14-day trial)

Lists every suppression of every result, with the rule, the location, the kind (inSource or external), the status (accepted, underReview or rejected; accepted when the tool gives none) and the justification. The count at the top is the number of results that are really suppressed: suppressions under review or rejected do not hide a result.

Example (sample file):

> # Suppressions
>
> 2 suppressed results.
>
> | Rule | Location | Kind | Status | Justification |
> | --- | --- | --- | --- | --- |
> | EX001 | test/fixtures/run-script.js:5 | inSource | accepted | test fixture only, never shipped |
> | EX005 | src/legacy/report\_builder.cs:77 | external | underReview | cache key, not a security use; waiting for review |
> | EX006 | test/settings.json:4 | external | accepted | dummy password of the local test database |
