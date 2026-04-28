# code4maus infra (CDK)

AWS CDK app that owns the Lambdas, API Gateway, S3 buckets, CloudFront distribution, and Route53 alias for code4maus. Replaces the legacy Serverless Framework setup.

## Prerequisites

- Node.js 20+
- AWS credentials with permission to deploy in `eu-central-1`
- An ACM certificate covering `programmieren.wdrmaus.de` and `*.code4maus.wt.wdr.cloud` (or per-stage equivalents) issued in **us-east-1** (CloudFront requirement)
- Route53 hosted zones for `wdrmaus.de` and `code4maus.wt.wdr.cloud`
- The static cert ARNs and hosted zone IDs in [lib/config.ts](lib/config.ts) filled in (look them up with `aws acm list-certificates --region us-east-1` and `aws route53 list-hosted-zones`)
- The frontend already built into `../build/` (run `yarn build` from the repo root)
- The CDK environment bootstrapped: `yarn cdk bootstrap aws://<account>/eu-central-1`

## First-time deploy

```sh
# from the repo root
yarn install         # installs root deps including aws-sdk + esbuild for handler bundling
yarn build           # populates ../build/ for the frontend bucket deployment

# then in infra/
cd infra
yarn install
STAGE=dev yarn cdk bootstrap aws://<account>/eu-central-1
STAGE=dev yarn cdk deploy
```

`STAGE` is one of `prod`, `staging`, `dev`. Defaults to `dev`.

## Day-to-day

```sh
cd infra
STAGE=<stage> yarn diff
STAGE=<stage> yarn deploy
```

CI does this automatically: pushes to `develop` deploy staging, pushes to `production` deploy prod (see [.github/workflows/](../.github/workflows/)).

## Stack contents

- **AppBucket** (`code4maus-app-{stage}`) — frontend, private, served via CloudFront OAC
- **ProjectBucket** (`code4maus-projects-{prod|staging}`) — user data, private, OAC; `staging` and `dev` share one bucket (matches legacy bucketSuffix logic)
- **3 Lambdas** (`prepareAssetUpload`, `saveProject`, `prepareShareResult`) — `nodejs22.x`, esbuild-bundled with aws-sdk v2 inlined
- **API Gateway REST API** (`code4maus-{stage}`) at stage `{stage}` so CloudFront origin path stays `/{stage}`
- **CloudFront distribution** with three behaviors: default→AppBucket, `data/*`→ProjectBucket, `api/*`→API Gateway. 403/404→`/index.html` for SPA routing.
- **Route53 A-alias** at `{baseDomain}` → CloudFront

## Notes

- Handler bundle size is ~22 MB each because aws-sdk v2 is inlined. Migrating handlers to `@aws-sdk/*` v3 (separate effort) drops this to <1 MB.
- ProjectBucket suffix is `prod` for prod and `staging` for both staging and dev — `dev` and `staging` share user data, matching the legacy setup.
- The Lambda execution role is created and managed by CDK. The legacy externally-managed role at `arn:aws:iam::*:role/hackingstudio/code4maus/...` (defined in `scripts/deployment-iam-cf.yml`) is no longer used.
- If you ever need to operate on the *old* AWS account's serverless stack (e.g. `serverless remove`), check out a commit from before this migration.
