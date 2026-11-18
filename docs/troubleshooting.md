# Troubleshooting

## The report says the file is not valid

SARIF Atlas reads SARIF 2.1.0 in JSON (a top-level object with a runs array). A file that is not JSON, or has no runs array, is reported as not a valid SARIF log. A byte order mark at the start of the file is accepted. Rules are looked up in the tool's driver and, where a result points to one, in the tool's extensions, as some scanners write them.

## The file is too large

Reports read files up to the size set in `sarifAtlas.maxFileSizeMB` (50 MB by default and at most). VS Code passes files only up to 50 MB to extensions, so a larger file cannot be read by any extension: split it, or save a shorter one.

## The preview does not open

The report always opens as a Markdown document. If the preview stays closed, set `sarifAtlas.openReportsAsPreview` to true and check that the built-in Markdown extension is enabled.

## Pro or the trial does not unlock

Run **SARIF Atlas: Show Licence Status**. It tells whether a key is stored, whether it was checked, and how many trial days are left. Details are in [licence.md](licence.md).

## Something else

Run **SARIF Atlas: Report A Problem**. It copies a diagnostics block (versions, settings, licence state; no file contents) and opens the issues page.
