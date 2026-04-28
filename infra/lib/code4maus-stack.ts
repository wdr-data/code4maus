import * as path from 'path'
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import { StageConfig, StageName } from './config'

export interface Code4MausStackProps extends StackProps {
  stage: StageName
  config: StageConfig
  /**
   * When false, the Route53 alias record is not created. Use this for the initial
   * cutover deploy: deploy CDK without DNS, validate against the CloudFront domain,
   * then `serverless remove` the old stack to free the DNS name, then redeploy CDK
   * with this flag set to true.
   */
  createDnsRecord: boolean
}

const REPO_ROOT = path.resolve(__dirname, '..', '..')
const FRONTEND_BUILD_DIR = path.join(REPO_ROOT, 'build')
const HANDLERS_DIR = path.join(REPO_ROOT, 'src', 'backend')

export class Code4MausStack extends Stack {
  constructor(scope: Construct, id: string, props: Code4MausStackProps) {
    super(scope, id, props)
    const { stage, config, createDnsRecord } = props

    // ---- S3 buckets ---------------------------------------------------------
    const appBucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: `code4maus-app-${stage}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const projectBucket = new s3.Bucket(this, 'ProjectBucket', {
      bucketName: `code4maus-projects-${config.projectBucketSuffix}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
      cors: [
        {
          allowedHeaders: ['content-type'],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: [`https://${config.domain}`],
          maxAge: 1800,
        },
      ],
    })

    // ---- Lambdas ------------------------------------------------------------
    const lambdaCommon = {
      runtime: lambda.Runtime.NODEJS_22_X,
      memorySize: 256,
      timeout: Duration.seconds(15),
      projectRoot: REPO_ROOT,
      depsLockFilePath: path.join(REPO_ROOT, 'yarn.lock'),
      environment: {
        S3_BUCKET_PROJECTS: projectBucket.bucketName,
        ASSET_BASEURL: `https://${config.domain}`,
        API_HOST: `https://${config.domain}`,
      },
      bundling: {
        // Handlers still use aws-sdk v2 (require('aws-sdk')). The Node 18+ Lambda
        // runtime no longer bundles it, so esbuild includes it in the bundle.
        // Override CDK's default of externalizing aws-sdk v2.
        // Migrate handlers to @aws-sdk/* v3 in a follow-up to shrink the zip.
        externalModules: ['@aws-sdk/*'],
        target: 'node22',
        sourceMap: true,
      },
    }

    const prepareAssetUploadFn = new NodejsFunction(this, 'PrepareAssetUploadFn', {
      ...lambdaCommon,
      entry: path.join(HANDLERS_DIR, 'prepareAssetUpload.js'),
      handler: 'handler',
    })

    const saveProjectFn = new NodejsFunction(this, 'SaveProjectFn', {
      ...lambdaCommon,
      entry: path.join(HANDLERS_DIR, 'saveProject.js'),
      handler: 'handler',
    })

    const prepareShareResultFn = new NodejsFunction(this, 'PrepareShareResultFn', {
      ...lambdaCommon,
      entry: path.join(HANDLERS_DIR, 'prepareShareResult.js'),
      handler: 'handler',
    })

    projectBucket.grantReadWrite(prepareAssetUploadFn)
    projectBucket.grantReadWrite(saveProjectFn)
    projectBucket.grantReadWrite(prepareShareResultFn)

    // ---- API Gateway --------------------------------------------------------
    // Stage name matches the deploy stage so the CloudFront origin path stays /{stage}.
    const api = new apigw.RestApi(this, 'Api', {
      restApiName: `code4maus-${stage}`,
      deployOptions: { stageName: stage },
      defaultCorsPreflightOptions: {
        allowOrigins: [`https://${config.domain}`],
        allowMethods: ['POST', 'OPTIONS'],
      },
    })

    const apiRoot = api.root.addResource('api')
    apiRoot
      .addResource('prepareAssetUpload')
      .addMethod('POST', new apigw.LambdaIntegration(prepareAssetUploadFn))
    apiRoot
      .addResource('saveProject')
      .addMethod('POST', new apigw.LambdaIntegration(saveProjectFn))
    apiRoot
      .addResource('prepareShareResult')
      .addMethod('POST', new apigw.LambdaIntegration(prepareShareResultFn))

    // ---- CloudFront ---------------------------------------------------------
    const certificate = acm.Certificate.fromCertificateArn(this, 'Cert', config.certArn)

    const apiOrigin = new origins.RestApiOrigin(api)

    const apiBehavior: cloudfront.BehaviorOptions = {
      origin: apiOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      compress: true,
    }

    const projectsOrigin = origins.S3BucketOrigin.withOriginAccessControl(projectBucket)
    const dataBehavior: cloudfront.BehaviorOptions = {
      origin: projectsOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      compress: true,
    }

    const appOrigin = origins.S3BucketOrigin.withOriginAccessControl(appBucket)
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: `Code4Maus ${stage}`,
      domainNames: [config.domain],
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: appOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      additionalBehaviors: {
        'data/*': dataBehavior,
        'api/*': apiBehavior,
      },
      // Private buckets fronted by OAC return 403 (not 404) for missing keys.
      // Map both to /index.html so the SPA router can take over.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
      ],
    })

    // ---- Frontend deployment -----------------------------------------------
    // Two deployments so cache-control can differ per file:
    //   1. Long-cached static assets (everything except index.html and service-worker.js)
    //   2. No-cache HTML + service worker (must always be revalidated)
    new s3deploy.BucketDeployment(this, 'FrontendStatic', {
      sources: [s3deploy.Source.asset(FRONTEND_BUILD_DIR)],
      destinationBucket: appBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
      exclude: ['index.html', '**/index.html', 'service-worker.js'],
    })

    new s3deploy.BucketDeployment(this, 'FrontendHtml', {
      sources: [s3deploy.Source.asset(FRONTEND_BUILD_DIR)],
      destinationBucket: appBucket,
      prune: false,
      include: ['index.html', '**/index.html', 'service-worker.js'],
      exclude: ['*'],
      cacheControl: [
        s3deploy.CacheControl.fromString('max-age=0,no-cache,no-store,must-revalidate'),
      ],
    })

    // ---- Route53 ------------------------------------------------------------
    if (createDnsRecord) {
      const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
        hostedZoneId: config.hostedZoneId,
        zoneName: config.hostedZoneName,
      })
      new route53.ARecord(this, 'DnsRecord', {
        zone,
        recordName: config.domain,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      })
    }
  }
}
