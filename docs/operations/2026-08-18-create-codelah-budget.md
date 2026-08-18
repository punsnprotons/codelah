# Action request: create CodeLah budget alerts

## Request

| Field | Value |
| --- | --- |
| Action request ID | `ar_2b9c7d6e5f4a3b2c1d0e9f8a7b` |
| Created | 2026-08-18, Asia/Singapore |
| Clock | change |
| Actor | Codex; devsecops local policy reviewed 2026-08-18 |
| Owner/co-sign | Sufi; owner provided the budget-alert recipient on 2026-08-18 |
| Target | `private` AWS profile; account ending `5843` (full account identifier intentionally not retained here); AWS Budgets global control plane |
| Action class | `aws.budgets.create.scoped-cost-alert` |
| AWS actions | `budgets:CreateBudget`; `sts:GetCallerIdentity` only to resolve the API-required account argument without printing it |
| Data class / criticality | Internal billing metadata and confidential recipient email; no learner or application data |
| Declared blast radius | One monthly `COST` budget filtered to `user:Project$codelah`; two email notifications; zero runtime services |
| Budget | USD 10 per calendar month; actual-cost alerts at 50% and 100% (USD 5 and USD 10) |
| Reversibility | compensable: delete the named budget after owner approval; notification emails already sent cannot be recalled |
| Revert handle | `budgets:DeleteBudget` for `codelah-public-preview-monthly-10-usd` |
| Detection window | immediate `budgets:DescribeBudget` and `budgets:DescribeNotificationsForBudget` verification |
| Blocking conditions | this request does not authorize a CloudFormation change set, stack, public distribution, bucket, artefact upload, CloudFront pricing-plan selection, or application deployment |

## Justification

The `Project` cost-allocation tag is active. A tightly scoped monthly budget with owner notifications is the required cost guardrail before the public-preview stack can be considered for deployment. The supplied email is used only in the AWS API request and is deliberately not stored in this repository.

## Evidence requirements

Record only the budget name, limit, filter, alert thresholds, and AWS API verification result. Do not retain the alert email, account contact information, credentials, learner data, or raw request bodies. CloudTrail correlation remains to be verified after the action.
