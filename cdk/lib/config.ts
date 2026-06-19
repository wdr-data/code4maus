export type StageName = 'prod' | 'staging' | 'dev'

export interface StageConfig {
  domain: string
  projectBucketSuffix: 'prod' | 'staging'
  /**
   * ACM certificate ARN. Must be in us-east-1 (CloudFront requirement).
   * Look up once with:
   *   aws acm list-certificates --region us-east-1 \
   *     --query "CertificateSummaryList[?DomainName=='*.code4maus.wt.wdr.cloud' || DomainName=='programmieren.wdrmaus.de'].CertificateArn"
   */
  certArn: string
  /** Route53 hosted zone id (without the /hostedzone/ prefix). */
  hostedZoneId: string
  /** Route53 hosted zone name (must end with a trailing dot). */
  hostedZoneName: string
  /** AWS account id (for stack env binding). */
  account: string
  /** AWS region for the stack (everything except the cert lives here). */
  region: string
}

const DEFAULT_REGION = 'eu-central-1'

const ACCOUNTS: Record<StageName, string> = {
  prod: 'TODO_PROD_ACCOUNT_ID',
  staging: 'TODO_STAGING_ACCOUNT_ID',
  dev: '391322831368',
}

// TODO before first deploy: replace the placeholder certArn (us-east-1) and
// hostedZoneId values below with the real ones for each stage.
// Look them up with:
//   aws acm list-certificates --region us-east-1
//   aws route53 list-hosted-zones
const PLACEHOLDER_CERT_ARN =
  'arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-0000-0000-000000000000'

// tbd: arbeiten wir überhaupt mit hosted zones oder nur externen DNS-Records?
export const STAGES: Record<StageName, StageConfig> = {
  prod: {
    domain: 'programmieren.wdrmaus.de',
    projectBucketSuffix: 'prod',
    certArn: PLACEHOLDER_CERT_ARN,
    hostedZoneId: 'TODO_PROD_HOSTED_ZONE_ID',
    hostedZoneName: 'wdrmaus.de.',
    account: ACCOUNTS.prod,
    region: DEFAULT_REGION,
  },
  staging: {
    domain: 'staging.code4maus.wt.wdr.cloud',
    projectBucketSuffix: 'staging',
    certArn: PLACEHOLDER_CERT_ARN,
    hostedZoneId: 'TODO_STAGING_HOSTED_ZONE_ID',
    hostedZoneName: 'code4maus.wt.wdr.cloud.',
    account: ACCOUNTS.staging,
    region: DEFAULT_REGION,
  },
  dev: {
    domain: 'dev.maus.metahost.org',
    projectBucketSuffix: 'staging',
    certArn:
      'arn:aws:acm:us-east-1:391322831368:certificate/b2d1f159-5248-4f44-9bef-b94f9b69b260',
    hostedZoneId: 'TODO_DEV_HOSTED_ZONE_ID',
    hostedZoneName: 'maus.metahost.org.',
    account: ACCOUNTS.dev,
    region: DEFAULT_REGION,
  },
}

export function resolveStage(input: string | undefined): StageName {
  if (input === 'prod' || input === 'staging' || input === 'dev') return input
  if (input === undefined || input === '') return 'dev'
  throw new Error(
    `Unknown stage: ${input}. Expected one of: prod, staging, dev.`
  )
}
