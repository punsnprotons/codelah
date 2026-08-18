# Engineering and operations runbook

## Scope

This runbook governs the future private-pilot environment. No deployment has occurred at the time of writing.

## Verified target facts

| Fact | Status |
| --- | --- |
| Local repository | initialized after this documentation baseline is committed |
| GitHub target | `punsnprotons/codelah`, verified reachable and empty before first push |
| AWS named profile | `private`, verified as a private AWS account SSO administrator role |
| Region | unknown |
| Environment owner | unknown |
| Data classification / criticality | unknown |
| Existing deployed resources | none known; no estate inventory performed |

Do not provision while the last four facts are unresolved.

## Required preflight before provisioning

1. Obtain written confirmation of AWS region, environment owner, pilot audience, and private-access mechanism.
2. Classify learner/session/model data and approve retention/deletion rules.
3. Confirm whether a dedicated non-production account exists; do not use an unknown shared account as a pilot by assumption.
4. Confirm the DNS zone and certificate ownership.
5. Review IaC plan with the owner; declare resources, cost estimate, blast radius, rollback handle, and detection window.
6. Confirm that no minors will use the product until appropriate institutional/privacy approval exists.

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
3. A human reviews the IaC diff, resource targets, CloudFront/S3/API access policy, WAF rule, secret references, and rollback handle.
4. Deploy to the approved non-production environment using the approved `private` profile/role.
5. Verify served application, session creation, API health, Worker timeout handling, model fallback, logs, metrics, and WAF restriction directly.
6. Record build digest, deployment ID, approver, time, rollback reference, and verification evidence.

## Rollback procedure (future)

| Scope | Rollback handle | Validation |
| --- | --- | --- |
| Static web app | prior immutable S3 object/version or prior CloudFront origin release | fetch deployed build and run smoke journey |
| Lambda API | prior published version/alias | health/session endpoint and state-transition test |
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

Create alarms only after owner/threshold approval. Required metrics are API 5xx rate/latency, session failures, DynamoDB errors, Worker timeouts, model failures/latency, response rejections, fallback-hint rate, WAF blocks, and deployment health.

## Change authority

| Action | Class | Required authority now |
| --- | --- | --- |
| Documentation / local code | reversible | user-authorized implementation work |
| Git push to stated empty repository | compensable external write | explicitly authorized by user in this request |
| AWS discovery | read-only | named profile and user scope; no writes |
| AWS provisioning | compensable | human review after unresolved preflight facts are approved |
| Data deletion / public access / external notification | potentially irreversible | human-only approval |
