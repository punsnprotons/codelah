# Public-preview infrastructure plan

## Status

The reviewed CloudFormation plan has been executed for the CodeLah 18+ zero-data public preview in `ap-southeast-1`. Stack `codelah-public-preview` reached `CREATE_COMPLETE` on 2026-08-18. It currently provides only the private S3 origin and CloudFront delivery infrastructure; no application artefact has been uploaded or served yet. Future updates still require explicit owner approval after review.

## Scope

```text
Public browser
  -> CloudFront HTTPS distribution
  -> Origin Access Control
  -> private, versioned S3 bucket

Python execution, lesson state, interests, and learner code stay in the browser.
```

The plan deliberately excludes Lambda, API Gateway, DynamoDB, Cognito, NAT, a custom domain, an application API, request logs, RUM, user analytics, and learner-data storage.

## Cost path

1. **Preferred:** when the account is eligible, subscribe the new CloudFront distribution to the **Free flat-rate plan** in the CloudFront console. AWS documents that the plan includes 1M requests, 100 GB transfer, WAF/DDoS protection, and S3 storage credits at $0/month. This subscription is currently a CloudFront-console step, not represented in this CloudFormation template. See the [AWS CloudFront pricing-plan guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html).
2. **Fallback:** use this template without an AWS WAF Web ACL. It is static, accepts only `GET` and `HEAD`, has no write endpoint or learner data, uses a private S3 origin, and receives AWS Shield Standard protection through CloudFront. Do not add a paid WAF rule group or logs without a separately approved cost review.
3. Before an apply, create account-cost alerts at $5 and $10. In a shared account, first activate and use the `Project=codelah` cost-allocation tag; do not create an account-wide project budget by assumption.

CloudFront flat-rate plans cannot be attached to a distribution with an existing WAF Web ACL, so the template intentionally creates no `AWS::WAFv2::WebACL`. If the Free plan is unavailable, the owner must explicitly approve the pay-as-you-go fallback and its budget cap.

## Planned controls

| Concern | Planned control |
| --- | --- |
| Public URL | CloudFront default `*.cloudfront.net` HTTPS domain; no custom DNS now |
| Origin access | S3 public access block plus CloudFront Origin Access Control with signed requests |
| Methods | `GET` and `HEAD` only |
| TLS | HTTP redirects to HTTPS; CloudFront default certificate; TLS 1.2+ |
| Cache / rollback | S3 versioning; noncurrent versions expire after 30 days; HTML is uncached; Vite-hashed assets are long-lived |
| Telemetry | No request/access/WAF logs or user analytics in this phase |
| Data | No AWS API or persistence; learner state remains in browser memory only |

## Required review before any AWS write

| Field | Current decision |
| --- | --- |
| Account/profile | `private` only |
| Region | `ap-southeast-1` |
| Owner | Sufi |
| Audience | public 18+ zero-data preview |
| Action class | compensable; owner co-sign required |
| Blast radius | one new private S3 bucket and one public CloudFront distribution |
| Rollback | disable distribution, cancel any pricing plan, restore prior S3 object version, then delete only after the distribution is fully disabled |
| Detection window | not measured; requires post-deploy synthetic HTTPS and browser-smoke evidence |
| Existing stack | `codelah-public-preview` is `CREATE_COMPLETE` (2026-08-18) |
| Cost guardrail | `Project` activated successfully; `codelah-public-preview-monthly-10-usd` budget confirmed with USD 5 and USD 10 actual-spend alerts (2026-08-18) |
| Deployment evidence | Eight resources are `CREATE_COMPLETE`: private S3 bucket/policy, CloudFront distribution/OAC, three cache policies, and security headers |
| Remaining conditions | Free-plan eligibility remains console-only; static-artifact upload, post-upload verification, rollback rehearsal, and detection-window measurement remain pending |

## Local validation only

```bash
aws cloudformation validate-template \
  --profile private \
  --region ap-southeast-1 \
  --template-body file://infra/cloudformation/public-preview.yaml
```

Template validation is read-only. It is not a cost estimate, change set, deployment, or proof that the Free CloudFront plan is available in the account.
