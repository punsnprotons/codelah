# Action request: execute the public-preview change set

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_4d9e8f7a6b5c4d3e2f1a0b9c8d` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; user explicitly authorized execution with “proceeed” after the change-set review |
| Target | `private` AWS profile; `ap-southeast-1`; `codelah-public-preview-review-20260818` for stack `codelah-public-preview` |
| Action class | `aws.cloudformation.change-set.execute` |
| AWS actions | `cloudformation:ExecuteChangeSet`, `DescribeStacks`, `DescribeStackEvents`, and `DescribeChangeSet` |
| Data class / criticality | Public static-artifact infrastructure; no learner data, API, account, database, or application runtime |
| Declared blast radius | Exactly eight reviewed additions: private S3 bucket/policy, CloudFront distribution/OAC, three cache policies, and one security-headers policy |
| Reversibility | compensable: the public infrastructure can be disabled/deleted, but public availability and any costs/effects during the detection window cannot be recalled |
| Revert handle | disable/delete CloudFront after owner approval, restore/delete stack configuration, and retain the versioned bucket as declared in the template |
| Detection window | first post-deploy HTTPS/origin/browser smoke; not yet measured |
| Risk acceptance | owner has accepted execution before rollback rehearsal and measurement of the detection window |
| Blocking conditions | this request does not authorize static artefact upload, CloudFront Free-plan selection, custom DNS, user data collection, API/model enablement, or any broader AWS resource |

## Preconditions met

- Change set is `CREATE_COMPLETE` and `AVAILABLE` with the eight recorded `Add` actions.
- CodeLah project budget is USD 10/month with actual-cost alerts at USD 5 and USD 10.
- `bun run test:lesson`, `bun run build`, and `bun run test:e2e` passed against the current source. The build retains the known bundle-size warning; it is not a release blocker for this static MVP.

## Evidence requirements

Record the stack status, created logical resources, CloudFormation event identifiers/timestamps when available, and post-deploy verification evidence. Do not retain account IDs, credentials, alert-recipient email, learner data, signed URLs, or raw request bodies. Do not upload artefacts or expose an application build under this request.

## Execution result and remediation

2026-08-18: the first execution entered `ROLLBACK_IN_PROGRESS`; no CloudFront distribution or public URL was created. CloudFormation identified the root cause as `HtmlNoCachePolicy`: CloudFront rejects `EnableAcceptEncodingGzip` when caching is disabled. All later resource failures were cancellation fallout. CloudFormation deleted the policies and origin control it had created; the bucket was skipped because the template declares it `Retain`. A narrow template correction removes the incompatible Brotli/Gzip settings only from that no-cache policy. The corrected template has passed read-only CloudFormation validation. Do not retry until the current rollback reaches its terminal state and a new review-only change set is generated.

Rollback reached `ROLLBACK_COMPLETE`. The stack's recorded `SiteBucket` physical identifier was checked directly; AWS returned `NoSuchBucket` for both object-version and tag reads, so no retained bucket, object, or public resource exists. The failed stack record must be deleted before the corrected plan can reuse the same stack name.
