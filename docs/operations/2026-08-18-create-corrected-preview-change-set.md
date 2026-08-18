# Action request: create the corrected public-preview change set

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_6f1a0b9c8d7e6f5a4b3c2d1e0f` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; ongoing deployment authorization |
| Target | `private` AWS profile; `ap-southeast-1`; stack name `codelah-public-preview` |
| Action class | `aws.cloudformation.change-set.create` |
| AWS actions | `cloudformation:CreateChangeSet`, `DescribeChangeSet`, and `DescribeStacks` |
| Data class / criticality | Public static-artifact infrastructure plan; no learner data or runtime |
| Declared blast radius | One review-only CloudFormation change set; no bucket, distribution, object, API, or public URL is created by this action |
| Reversibility | reversible: delete the unexecuted change set |
| Revert handle | `cloudformation:DeleteChangeSet` for the named review change set |
| Detection window | immediate `DescribeChangeSet` confirmation and logical-resource inspection |
| Template delta | removes only Brotli/Gzip flags from `HtmlNoCachePolicy`, which CloudFront rejects when caching is disabled |
| Blocking conditions | execution remains unauthorized until the owner reviews the corrected AWS change list and explicitly approves `ExecuteChangeSet` |

## Justification

The failed stack record has been deleted and the corrected template passed read-only CloudFormation validation. A fresh review-only change set is required because the original change set is obsolete and CloudFront rejected the original HTML cache-policy settings.
