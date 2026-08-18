# Action request: enable the `Project` cost-allocation tag

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_18a8f6e1b2c3d4e5f6a7b8c9de` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; user authorized this step with “proceed” |
| Target | `private` AWS profile; account ending `5843` (full account identifier intentionally not retained here); global Cost Explorer control plane |
| Action class | `aws.cost-allocation-tag.enable` |
| AWS action | `ce:UpdateCostAllocationTagsStatus` for exactly the `Project` key, status `Active` |
| Data class / criticality | Internal billing metadata; no learner or application data |
| Declared blast radius | Account-wide reporting metadata for one existing tag key; zero runtime services; zero learner-visible resources |
| Reversibility | compensable: the key can be deactivated, but historical/reporting effects may persist |
| Revert handle | set the same `Project` key to `Inactive` after owner approval |
| Detection window | immediate read-only `ce:ListCostAllocationTags` verification; AWS activation propagation time remains an external dependency |
| Blocking conditions | no public stack, budget, alert recipient, CloudFront plan selection, artefact upload, or deployment is authorized by this request |

## Justification

The reviewed public-preview runbook requires a project-scoped cost guardrail before AWS provisioning. The required `Project` cost-allocation tag is currently inactive, so the guardrail cannot be configured without first enabling this billing metadata control.

## Evidence requirements

Record the API response and follow with a read-only status check. Do not store account contact information, credentials, learner data, signed URLs, or request bodies in this record. CloudTrail correlation has not yet been verified for this account.
