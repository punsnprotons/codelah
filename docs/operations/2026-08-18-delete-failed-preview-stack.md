# Action request: delete the failed stack record

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_5e0f9a8b7c6d5e4f3a2b1c0d9e` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; deployment authorization covers cleanup of this failed, non-public stack record |
| Target | `private` AWS profile; `ap-southeast-1`; stack `codelah-public-preview` in `ROLLBACK_COMPLETE` |
| Action class | `aws.cloudformation.failed-stack.delete` |
| AWS actions | `cloudformation:DeleteStack`, `DescribeStacks`, and `DescribeStackEvents` |
| Data class / criticality | Public static-infrastructure metadata; no data, active bucket, distribution, API, or public URL exists |
| Declared blast radius | One failed CloudFormation stack record only |
| Reversibility | reversible: a corrected review-only change set may recreate the intended stack; no resource state is being removed |
| Revert handle | none needed for absent resources; retain the failure evidence and recreate only through a new reviewed change set |
| Detection window | immediate terminal delete status plus `NoSuchBucket` evidence for the prior logical bucket |
| Blocking conditions | does not authorize a new change set, stack execution, artefact upload, or any new public resource |

## Justification

CloudFormation will not create a new stack using the same name while its previous attempt remains `ROLLBACK_COMPLETE`. AWS has independently confirmed that the only retained logical resource does not physically exist. Deleting this failed stack record is necessary cleanup before a corrected change-set review.
