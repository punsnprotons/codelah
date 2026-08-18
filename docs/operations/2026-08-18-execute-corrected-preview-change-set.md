# Action request: execute the corrected public-preview change set

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_7a2b1c0d9e8f7a6b5c4d3e2f1a` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; user explicitly approved “Execute the corrected change set” |
| Target | `private` AWS profile; `ap-southeast-1`; `codelah-public-preview-review-20260818-r2` for stack `codelah-public-preview` |
| Action class | `aws.cloudformation.change-set.execute` |
| AWS actions | `cloudformation:ExecuteChangeSet`, `DescribeStacks`, `DescribeStackEvents`, and `DescribeChangeSet` |
| Data class / criticality | Public static-artifact infrastructure; no learner data, API, account, database, or application runtime |
| Declared blast radius | Exactly eight reviewed additions: private S3 bucket/policy, CloudFront distribution/OAC, three cache policies, and one security-headers policy |
| Reversibility | compensable: public infrastructure can be disabled/deleted, but public availability and any effects in the detection window cannot be recalled |
| Revert handle | disable/delete CloudFront after owner approval, then delete stack configuration; bucket is versioned and retained as declared |
| Detection window | first post-deploy HTTPS/origin/browser smoke; still unmeasured |
| Risk acceptance | owner explicitly authorized execution after review of the corrected change set |
| Blocking conditions | does not authorize artefact upload, CloudFront Free-plan selection, custom DNS, user-data collection, API/model enablement, or broader AWS resources |

## Preconditions met

- The corrected change set is `CREATE_COMPLETE` and `AVAILABLE` with the eight recorded `Add` actions.
- The earlier failed stack has been fully deleted; AWS confirms no prior bucket exists.
- The only template change is removal of compression flags from the disabled HTML cache policy; the corrected template has passed CloudFormation validation.
- The CodeLah USD 10/month budget and USD 5/USD 10 actual-spend alerts remain the required cost guardrail.

## Evidence requirements

Record stack status, logical resources, CloudFormation event identifiers/timestamps when available, and post-deploy verification. Do not retain account IDs, credentials, alert-recipient email, learner data, signed URLs, or raw request bodies. Do not upload artefacts or expose an application build under this request.

## Execution result and remediation

2026-08-18: the corrected execution entered `ROLLBACK_IN_PROGRESS` before any CloudFront distribution or public URL was created. CloudFormation identified `HtmlNoCachePolicy` as the root cause: the `EnableAcceptEncodingGzip` property is required even when caching is disabled, but it cannot be enabled in that mode. The only remaining correction sets that required property to `false`; no other resource definition changed. AWS rollback remains in progress at the time of this record. Do not execute again until rollback is terminal, the revised template is read-only validated, and a new review-only change set is inspected.
