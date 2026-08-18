# Action request: create a review-only public-preview change set

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_3c8d7e6f5a4b2c1d0e9f8a7b6c` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; user authorized continuation with “proceed” |
| Target | `private` AWS profile; `ap-southeast-1`; stack name `codelah-public-preview` |
| Action class | `aws.cloudformation.change-set.create` |
| AWS actions | `cloudformation:CreateChangeSet`, `DescribeChangeSet`, and `DescribeStacks` |
| Data class / criticality | Public static-artifact infrastructure plan; no learner data or application runtime |
| Declared blast radius | One review-only CloudFormation change set; no bucket, distribution, object, DNS record, application API, or public URL is created by this action |
| Reversibility | reversible: delete the unexecuted change set |
| Revert handle | `cloudformation:DeleteChangeSet` for the named review change set |
| Detection window | immediate `DescribeChangeSet` confirmation; inspect exact planned logical resources before execution |
| Blocking conditions | execution remains unauthorized until the owner reviews the generated AWS change list and explicitly approves `ExecuteChangeSet` |

## Justification

The cost guardrail has been confirmed. A review-only change set is the smallest AWS action that proves the exact resource graph and stack targets without creating the public preview. It is required to make the final execute decision evidence-led rather than template-only.

## Evidence requirements

Record only the change-set status and logical resource changes. Do not retain account IDs, CloudFormation ARNs, credentials, learner data, signed URLs, or raw API bodies. Do not execute this change set under this request.
