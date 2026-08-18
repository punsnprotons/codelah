# Security and privacy

## Security posture

This document defines the planned controls for the public, zero-data adult preview. It does not certify compliance or describe deployed resources.

## Assets and boundaries

| Asset | Risk | Required control |
| --- | --- | --- |
| Learner progress and code | Potential personal data | browser memory only; no network submission, persistence, or telemetry |
| Interest tags | Profiling/over-collection | explicit, editable browser-only choice; no inference or persistence |
| AI credential | provider cost/data exposure | no external AI provider in this phase |
| Lesson packages | content manipulation | Git review, schema/test validation, immutable release version |
| Browser code runner | denial of service / unwanted capability | Worker isolation, time budget, bounded output, CSP, no credentials |
| Public static delivery | unwanted origin access or excess delivery cost | private S3 origin, CloudFront OAC, HTTPS-only, cost-path owner review |

## Threat model

| Threat | Mitigation |
| --- | --- |
| Learner attempts to unlock later lesson state in the browser | no completion record or protected entitlement exists in this phase; deterministic local checks still govern the journey. |
| Infinite or resource-heavy Python | terminate/recreate Worker after configured budget; cap output and test count. |
| User code accesses credentials | no secrets or privileged APIs in browser runner; no server-side execution. |
| A future model reveals a solution | model is out of scope; require constrained schema, answer-leak checks, evaluations, and authored fallback before enablement. |
| Public delivery abuse | prefer the eligible CloudFront Free plan; otherwise use a reviewed static-only fallback with no write path, no WAF Web ACL, and AWS Shield Standard. |

## Identity and access

There is intentionally no learner sign-up/sign-in for the first core product. The zero-data preview's only public surface is its CloudFront URL:

- S3 is not public; CloudFront accesses it through Origin Access Control;
- tutor, author, admin, API, and account routes do not exist in this phase;
- local deployment uses the named `private` AWS profile only after a human approves the exact stack and region;
- continuous deployment must later use GitHub OIDC, not long-lived cloud keys.

## Privacy requirements

- Do not request real name, age, employer, school, or job unless a later approved feature needs it.
- Do not infer an interest from a learner's current profession.
- Do not send learner text, code, values entered into programs, or prior conversations to AWS or an external provider.
- Reset clears the in-memory lesson state; closing the browser ends it.
- The audience is adults 18+ under a policy notice; any data-collecting or institutional release requires a new privacy review.

## Logging standard

Allowed: no application telemetry in this phase. Static delivery/cost information may be reviewed only in aggregate through AWS billing/CloudFront controls after owner approval.

Forbidden: cookies, identifiers, request/access logs, API keys, raw prompts, provider responses, source code, input values, IP addresses, or personal free text.

## AWS implementation baseline

- Private S3 bucket with CloudFront Origin Access Control.
- TLS at the edge; HTTPS only.
- CloudFront distribution limited to `GET` and `HEAD`, with versioned S3 rollback and security headers.
- Prefer the eligible CloudFront Free plan; do not add a WAF Web ACL to this preview template because it blocks flat-rate-plan subscription.
- No Lambda, DynamoDB, Secrets Manager, application API, request logging, or AI credential in this phase.

## Security review triggers

Review this document before enabling accounts, tutor dashboards, file upload, voice, images, public sharing, payment, server-side execution, a new model provider, a new data type, or broader pilot access.
