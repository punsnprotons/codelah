# ADR 0004: Choose a budget-first static public preview

## Status

Accepted for M2 planning; not deployed.

## Context

CodeLah needs an adult, public URL without a custom domain while operating under a tight budget. The M2 scope intentionally sends no learner data to AWS and exposes no application API. A separate AWS WAF Web ACL adds recurring cost in pay-as-you-go mode and prevents a CloudFront distribution from subscribing to a flat-rate plan.

## Decision

Deploy only a private S3 origin and public CloudFront distribution after owner review of `infra/cloudformation/public-preview.yaml`.

1. Prefer the CloudFront Free flat-rate plan when the account is eligible. Select it in the CloudFront console after stack creation; it is not a CloudFormation property.
2. Do not create a WAF Web ACL in the M2 template.
3. If the Free plan is unavailable, require explicit owner approval of the static-only pay-as-you-go fallback and its budget notification/cap. Keep the no-data, `GET`/`HEAD`-only boundary and AWS Shield Standard.
4. Do not create a change set or stack until the owner explicitly approves the resources, cost path, blast radius, rollback handle, and detection window.

## Consequences

- The first public URL is a CloudFront `*.cloudfront.net` domain.
- Cost control is a human gate plus CloudFront pricing/budget controls, not a claim of zero cost.
- The Free plan can be unavailable to accounts using AWS Free Tier and has plan-specific eligibility/usage limits; use the documented console check before relying on it.
- Any API, learner-data, WAF rule, request logging, model provider, or institutional release requires a new architecture/security/privacy decision.

## Sources

- [AWS CloudFront flat-rate pricing plan](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)
- [AWS available pricing plans](https://docs.aws.amazon.com/PricingPlanManager/latest/UserGuide/plans.html)
