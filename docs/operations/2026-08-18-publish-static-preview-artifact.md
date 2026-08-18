# Action request: publish the first static CodeLah artefact

| Field | Value |
| --- | --- |
| Action request ID | `ar_b2c3d4e5f6a7b8c9d0e1f2a3b4` |
| Owner/co-sign | Sufi; user authorized static-artifact publication with “proceed” |
| Target | `private` AWS profile; `ap-southeast-1`; private bucket from stack `codelah-public-preview`; CloudFront distribution from the same stack |
| AWS actions | `s3:PutObject` for 18 build files and one `cloudfront:CreateInvalidation` for `/*`; read-only object/version and HTTP verification afterward |
| Artefact provenance | source commit `7ec14e1eced4147fb7bf0a1ccc956fc71251ebbf`; build-tree SHA-256 `1ee8c5dd290bfb3caea5a72c8869984894afd5d1abb27d29396d4591c2ac1586`; 18 files; 16.6 MiB |
| Test evidence | `bun run test:lesson` and `bun run build` passed immediately before publication; browser regression passed on the same application source before infrastructure-only changes |
| Declared blast radius | Initial upload to a bucket independently verified empty; no object deletion, learner data, API, database, or account state |
| Cache policy | `index.html`: no-cache; Vite `assets/`: one year immutable; Pyodide runtime: one day |
| Reversibility | compensable: upload a prior reviewed artefact or restore a prior S3 object version, then invalidate CloudFront; publication effects within the detection window cannot be recalled |
| Detection | immediate CloudFront HTTPS response, private-S3-origin denial, and deployed asset checks |
| Boundary | no custom domain, CloudFront pricing-plan selection, telemetry, user data, API/model enablement, or extra AWS resource |

The target bucket has zero object versions and zero delete markers before this first upload. The upload is intentionally split by cache class and does not use `--delete`.
