# Action request: delete the second failed stack record

| Field | Value |
| --- | --- |
| Action request ID | `ar_8b3c2d1e0f9a8b7c6d5e4f3a2b` |
| Owner/co-sign | Sufi; user authorized the third corrected review with “proceed” |
| Target | `private` AWS profile; `ap-southeast-1`; `codelah-public-preview` in `ROLLBACK_COMPLETE` |
| AWS action | `cloudformation:DeleteStack` only, followed by read-only status verification |
| Declared blast radius | One failed CloudFormation stack record; `SiteBucket` has `DELETE_SKIPPED` with no physical identifier, so no bucket, object, distribution, API, or public URL exists |
| Reversibility | reversible: a new review-only change set can recreate the intended plan |
| Detection | immediate `DescribeStacks` terminal-state verification |
| Boundary | does not authorize a new change set execution, artefact upload, or public resource |

The second failed stack cannot be reused. Its cache-policy root cause has been corrected and CloudFormation validation passed; deleting this empty failed record is necessary before creating the third review-only change set.

## Result

2026-08-18: deletion completed. `DescribeStacks` returned that `codelah-public-preview` does not exist.
