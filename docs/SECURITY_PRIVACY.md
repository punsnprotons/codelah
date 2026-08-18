# Security and privacy

## Security posture

This document defines target controls for a private pilot. It does not certify compliance or describe deployed resources.

## Assets and boundaries

| Asset | Risk | Required control |
| --- | --- | --- |
| Learner progress | Potentially child-linked learning data | pseudonymous IDs, minimal fields, TTL, deletion endpoint, no public sharing |
| Interest tags | Profiling/over-collection | controlled taxonomy, explicit selection, editable, optional, no inferred profession |
| AI credential | provider cost/data exposure | Secrets Manager only, least-privilege read, no client or logs |
| Lesson packages | content manipulation | Git review, schema/test validation, immutable release version |
| Browser code runner | denial of service / unwanted capability | Worker isolation, time budget, bounded output, CSP, no credentials |
| API | abuse / state manipulation | WAF/rate limits, request schema validation, signed cookie, server state machine |

## Threat model

| Threat | Mitigation |
| --- | --- |
| Learner attempts to unlock later lesson state in the browser | API validates allowed state transitions; client state is not authoritative. |
| Infinite or resource-heavy Python | terminate/recreate Worker after configured budget; cap output and test count. |
| User code accesses credentials | no secrets or privileged APIs in browser runner; no server-side execution. |
| Model reveals a solution | constrained schema, short output, answer-leak filter, model evaluation suite, authored fallback. |
| Model hallucinates interest facts | only approved fact cards may be used; no live web search in learner flow. |
| Credential leaks | Secrets Manager, no client environment variables, secret scanning, log redaction. |
| API scraping or abuse | WAF, rate limits, opaque session cookies, payload limits, IP allowlist for private pilot. |
| Third-party provider outage | authored hint ladder and deterministic lesson completion remain available. |

## Identity and access

There is intentionally no learner sign-up/sign-in for the first core product. That does **not** mean every surface is public:

- learner access is restricted at the deployment edge for the private pilot;
- tutor/author/admin routes do not exist until roles, consent, and authorization are designed;
- local deployment uses the named `private` AWS profile only after a human approves the exact stack and region;
- continuous deployment must later use GitHub OIDC, not long-lived cloud keys.

## Privacy requirements

- Do not request real name, age, employer, school, or job unless a later approved feature needs it.
- Do not infer an interest from a learner's current profession.
- Do not send raw code, free text, values entered into programs, or entire prior conversations to the model by default.
- Provide reset/deletion of the current anonymous session.
- Retention period, legal basis, child consent, regional storage, and incident notification obligations are unresolved and require owner approval before a live pilot.

## Logging standard

Allowed: correlation ID, lesson/version ID, state transition, typed failure category, latency, HTTP status, provider availability, and aggregate counters.

Forbidden: cookies, authorization headers, API keys, raw prompts, raw provider responses, raw source code, input values, unredacted IPs, or personal free text.

## AWS implementation baseline

- Private S3 bucket with CloudFront Origin Access Control.
- TLS at the edge; HTTPS only.
- AWS WAF managed rules plus pilot-specific rate/access rules.
- Least-privilege Lambda roles, distinct deployment/runtime roles, and no wildcard data permissions.
- DynamoDB encryption at rest and TTL.
- Secrets Manager for Groq credentials.
- CloudTrail and deployment/CI evidence retained according to the approved environment policy.

## Security review triggers

Review this document before enabling accounts, tutor dashboards, file upload, voice, images, public sharing, payment, server-side execution, a new model provider, a new data type, or broader pilot access.
