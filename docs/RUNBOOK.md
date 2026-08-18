# Engineering and operations runbook

## Scope

This runbook governs the local acceptance phase and the future private-pilot environment. No deployment has occurred at the time of writing.

## Verified target facts

| Fact | Status |
| --- | --- |
| Local repository | initialized after this documentation baseline is committed |
| GitHub target | `punsnprotons/codelah`, verified reachable and empty before first push |
| AWS named profile | `private`, read-only identity verified 2026-08-18: SSO `AdministratorAccess` assumed role in the account ending `5843` |
| Region | `ap-southeast-1` is configured and owner-approved |
| Environment owner | Sufi (user-designated) |
| Data classification / criticality | static lesson artefacts: Public; any learner-entered text/code: untrusted and potentially personal data, prohibited from server storage; aggregate operational metrics: Internal |
| Existing deployed resources | no resources tagged `Project=codelah` found in `ap-southeast-1` on 2026-08-18; untagged or differently tagged resources remain unknown |

Do not provision while the last four facts are unresolved.

## M2 read-only preflight record — 2026-08-18

| Field | Status |
| --- | --- |
| Target / reachability | `private` AWS profile; STS identity verified for the account ending `5843` in `ap-southeast-1` |
| Estate graph | insufficient context: a targeted `Project=codelah` tag query returned no resources, but no service, artifact, owner, data class, criticality, or dependency fan-out is known |
| Action performed | read-only `sts:GetCallerIdentity`, local profile-region lookup, and `Resource Groups Tagging API` query for `Project=codelah`; no resources were created, changed, or deployed |
| Authority | user-authorized M2 read-only preflight |
| Action class | read-only discovery; no rollback required |
| Independent corroboration | AWS STS response received locally; no CloudTrail event ID or approved evidence ledger is available yet |
| Provisioning decision | refused pending the unresolved preflight facts and owner-approved IaC review |
| Exact stack-name check | `codelah-public-preview` does not exist (read-only check, 2026-08-18) |
| Cost-allocation check | `Project` is not an active cost-allocation tag (read-only check, 2026-08-18); do not substitute an account-wide project budget without separate owner approval |

**Preflight decision:** the owner approved a public, no-account preview. The application will use a public CloudFront distribution URL while the S3 origin remains private behind Origin Access Control. No custom DNS is required for this phase. The temporary public URL is the CloudFront distribution domain; when a custom domain is acquired, attach it as an alternate domain name with an ACM certificate in `us-east-1`.

## Public-preview data and retention policy

| Data class | Decision | Retention |
| --- | --- | --- |
| Static application and authored lesson content | Public | Versioned deployment artefacts retained until replaced and rollback window expires |
| Interest selections, diagnostic answers, pseudocode, learner code, and output | Process in browser memory only; do not send to AWS, persist in browser storage, or include in logs/analytics | Session only; cleared by lesson reset or browser close |
| IP addresses, cookies, accounts, or persistent identifiers | Do not add for this MVP | Not collected by the application |
| Operational telemetry | Aggregate availability/security metrics only; no request-body, learner-content, or user-level analytics logging | 30-day operational review window; no export or profiling use |
| Eligibility | 18+ only; no account, age-verification, or personal-data collection in this MVP | Policy notice only; no age data retained |

The public preview is intended for adults aged 18+. Because there is no identity or age-verification system, the app must keep the zero-data boundary above: do not solicit personal data, add accounts, or enable external AI tutoring without a separate privacy/institutional review. Manual screen-reader testing remains deferred, but is required before an institutional education release or any release that collects learner data.

**Current implementation artefact:** `infra/cloudformation/public-preview.yaml` is a no-apply CloudFormation plan for a private S3 origin, CloudFront Origin Access Control, public distribution domain, HTTPS-only access, versioned rollback, and security headers. Owner review of that plan is required before any AWS write.

**Budget-first decision:** prefer CloudFront's Free flat-rate plan if the account is eligible, using the CloudFront console after stack creation. The template intentionally creates no WAF Web ACL because CloudFront flat-rate plans cannot be attached to a distribution with an existing Web ACL. If the plan is unavailable, the fallback remains a zero-data static site with no write endpoints, no request logs, no WAF Web ACL, and AWS Shield Standard; the owner must approve that pay-as-you-go path and its budget cap before deployment.

## Current local acceptance evidence — 2026-08-18

| Check | Command / method | Result |
| --- | --- | --- |
| Calculator branch coverage | `bun run test:lesson` | passed: +, -, *, /, zero division, invalid operation |
| Production build | `bun run build` | passed |
| Browser regression | `bun run test:e2e` | passed: eight Chromium cases, including a full Tab-and-Enter journey, labelled editor/live feedback, malformed code, and runaway-loop recovery |
| Learner smoke journey | local in-app browser | passed: interest → diagnostic → keyboard planner → five modules → assembly → transfer → reset |
| Deployment / AWS resources | not run | none created |

This evidence does **not** approve deployment. It does approve the M2 **read-only preflight** described below. AWS writes remain blocked until the preflight facts and IaC review are owner-approved, a project-scoped cost guardrail is possible, and rollback/detection are rehearsed.

## Accessibility deferral boundary

**Decision:** defer the manual VoiceOver/NVDA acceptance run from the current internal MVP phase. The automated keyboard journey and semantic regression remain required and have passed locally.

**Boundary:** the first AWS environment may expose the zero-data public preview to adults 18+ through CloudFront. Do not add accounts, learner-data collection, external AI tutoring, or age verification without a separate privacy/institutional review. Complete manual screen-reader testing before an institutional education release or any release that collects learner data.

## Offline-support decision

**Decision:** do not ship an offline cache in M1. This is an internal preference, not an observed pilot requirement. A Chromium cache implementation was tested and rejected after it did not load the learner path offline.

**Revisit trigger:** documented pilot evidence of unreliable connectivity on approved devices, together with an owner-approved storage budget, browser matrix, cache-update policy, and offline regression suite. Until then, the product must state its online requirement accurately.

## Required preflight before provisioning

1. Obtain written confirmation of AWS region, environment owner, pilot audience, and private-access mechanism.
2. Classify learner/session/model data and approve retention/deletion rules.
3. Confirm whether a dedicated non-production account exists; do not use an unknown shared account as a pilot by assumption.
4. Confirm the DNS zone and certificate ownership.
5. Review IaC plan with the owner; declare resources, cost estimate, blast radius, rollback handle, and detection window.
6. Publish a clear 18+ eligibility notice; do not collect age or personal data in the MVP.

## Local setup after implementation begins

```bash
git clone https://github.com/punsnprotons/codelah.git
cd codelah
# Install the locked project dependencies after package manifests are introduced.
# Never add cloud credentials to repository files or frontend environment variables.
```

Use the named profile only explicitly:

```bash
AWS_PROFILE=private aws sts get-caller-identity
```

Validate only the account/role expected for the approved environment. Never paste credentials into shell history, source control, browser code, or tickets.

## Deployment procedure (future)

1. CI validates lesson packages, unit/integration/E2E tests, accessibility, security scans, and AI evaluations.
2. Build a versioned immutable web artifact and infrastructure plan.
3. A human reviews the IaC diff, resource targets, CloudFront/S3 access policy, chosen pricing path, versioned rollback handle, and the absence of API, learner-data, logs, and WAF resources.
4. After explicit owner approval, deploy to the approved environment using the approved `private` profile/role, then select the CloudFront Free plan in the console if eligible.
5. Verify the served static application, HTTPS redirect, private-origin access, Worker timeout handling, and reset directly. Confirm the chosen pricing path and record the CloudFront URL.
6. Record build digest, deployment ID, approver, time, rollback reference, and verification evidence.

## Rollback procedure (future)

| Scope | Rollback handle | Validation |
| --- | --- | --- |
| Static web app | prior immutable S3 object/version or prior CloudFront origin release | fetch deployed build and run smoke journey |
| Future API (not M2) | prior published version/alias | health/session endpoint and state-transition test |
| Lesson content | prior versioned lesson package | calculator validation/test fixtures pass |
| AI tutor | disable provider route; authored hints remain | lesson completes with broker unavailable |
| Infrastructure | reviewed IaC rollback only where resource impact is reversible | plan reviewed; no destructive state action without approval |

No rollback handle is considered rehearsed until it is executed successfully in non-production and recorded.

## Incident guide

### Model error spike

1. Disable model route through approved configuration/feature flag.
2. Verify authored hints and deterministic path continue to work.
3. Inspect redacted latency/status metrics only.
4. Do not send live learner payloads to external tools while diagnosing.
5. Restore only after evaluation and owner approval.

### Worker timeout spike

1. Confirm Worker termination/reset works in the deployed browser.
2. Inspect lesson/test release version and aggregate timeout category.
3. Roll back affected lesson package or runner release if correlated.
4. Never move untrusted execution into Lambda as an emergency workaround.

### Suspected secret exposure

1. Stop affected deployment/provider route.
2. Rotate secret through the approved owner process.
3. Audit CloudTrail/CI evidence and log configuration.
4. Preserve evidence without collecting raw learner content.
5. Escalate according to the approved incident policy once available.

## Monitoring and alarms

This zero-data preview creates no application/API, request, WAF, or learner telemetry. Before deployment, set an owner-approved budget notification/cap for the selected billing path. Treat CloudFront console pricing notifications and aggregate service-cost review as the initial detection path. Add API, learner, model, or WAF metrics only with the separate feature and privacy review that enables those components.

## Change authority

| Action | Class | Required authority now |
| --- | --- | --- |
| Documentation / local code | reversible | user-authorized implementation work |
| Git push to stated empty repository | compensable external write | explicitly authorized by user in this request |
| AWS discovery | read-only | named profile and user scope; no writes |
| AWS provisioning | compensable | human review after unresolved preflight facts are approved |
| Data deletion / public access / external notification | potentially irreversible | human-only approval |
