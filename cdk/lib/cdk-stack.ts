import * as path from 'path'
import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { StageConfig, StageName } from './config'

export interface MausAppStackProps extends StackProps {
  stage: StageName
  config: StageConfig
  createDnsRecord: boolean
}

export class MausAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MausAppStackProps) {
    super(scope, id, props)

    const { stage, config, createDnsRecord } = props

    // S3
    const appBucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: `pmdm-appbucket-${stage}-${config.account}`,
      encryption: s3.BucketEncryption.KMS,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: RemovalPolicy.RETAIN,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })

    const projectBucketCorsRule: s3.CorsRule = {
      allowedMethods: [s3.HttpMethods.PUT],
      allowedOrigins: [
        `https://${config.domain}`,
        // local dev server uploads assets directly to the dev bucket
        ...(stage === 'dev' ? ['http://localhost:8601'] : []),
      ],
      allowedHeaders: ['content-type'],
      id: 'projectBucketCORSRule1',
      maxAge: 1800,
    }

    const projectBucket = new s3.Bucket(this, 'ProjectBucket', {
      bucketName: `pmdm-projectbucket-${stage}-${config.account}`,
      encryption: s3.BucketEncryption.KMS,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: RemovalPolicy.RETAIN,
      cors: [projectBucketCorsRule],
    })

    // Lambda
    const REPO_ROOT = path.resolve(__dirname, '..', '..')
    const FRONTEND_BUILD_DIR = path.join(REPO_ROOT, 'build')
    const HANDLERS_DIR = path.join(REPO_ROOT, 'src', 'backend')
    // generisches Konstrukt, aus dem alle Lambdas erweitert werden
    const lambdaCommon = {
      runtime: lambda.Runtime.NODEJS_24_X,
      memorySize: 256,
      timeout: Duration.seconds(15),
      projectRoot: REPO_ROOT,
      environment: {
        S3_BUCKET_PROJECTS: projectBucket.bucketName,
        ASSET_BASEURL: `https://${config.domain}`,
        API_HOST: `https://${config.domain}`,
      },
      bundling: {
        // aws-sdk v2 wird gebundlet, weil neuere Node-Runtimes es nicht mehr mitliefern
        // TODO ist auch veraltet, austauschen: https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-javascript-v2/
        nodeModules: ['aws-sdk', 'nanoid', 'shortid'],
        externalModules: [],
        target: 'node24',
        sourceMap: true,
      },
    }

    const prepareAssetUploadFn = new NodejsFunction(
      this,
      'PrepareAssetUploadFn',
      {
        ...lambdaCommon,
        entry: path.join(HANDLERS_DIR, 'prepareAssetUpload.js'),
        handler: 'handler',
      }
    )

    const saveProjectFn = new NodejsFunction(this, 'SaveProjectFn', {
      ...lambdaCommon,
      entry: path.join(HANDLERS_DIR, 'saveProject.js'),
      handler: 'handler',
    })

    const prepareShareResultFn = new NodejsFunction(
      this,
      'PrepareShareResultFn',
      {
        ...lambdaCommon,
        entry: path.join(HANDLERS_DIR, 'prepareShareResult.js'),
        handler: 'handler',
      }
    )

    projectBucket.grants.readWrite(prepareAssetUploadFn)
    projectBucket.grants.readWrite(saveProjectFn)
    projectBucket.grants.readWrite(prepareShareResultFn)

    // API Gateway
    const api = new apigw.RestApi(this, 'Api', {
      restApiName: `mausapp-${stage}`,
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

    // Cloudfront
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Cert',
      config.certArn
    )

    const apiOrigin = new origins.RestApiOrigin(api)

    const apiBehavior: cloudfront.BehaviorOptions = {
      origin: apiOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy:
        cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      compress: true,
    }

    // Origin für ProjectBucket: Uploads und Assets
    const projectsOrigin =
      origins.S3BucketOrigin.withOriginAccessControl(projectBucket)
    const dataBehavior: cloudfront.BehaviorOptions = {
      origin: projectsOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      // TODO ist das sinnvoll? -> evtl auf GET_HEAD umstellen
      // außer wir schreiben direkt so in den Bucket von Cloudfront (aber sollte ja eigentlich die Lambda machen)
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      //allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // vorsichtige Einstellung zu Beginn -> langfristig evtl cachen
      compress: true,
    }

    // Origin für AppBucket: App-Code
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
      // 403 und 404 auf 200 und "Upps!"-Seite umbiegen; Originalverhalten
      // langfristig vllt. so ändern, dass das nur App-Pfade betrifft und nicht z.B. API-Pfade
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

    // Frontend in S3
    // Deployment für alle statischen Assets mit Caching
    new s3deploy.BucketDeployment(this, 'FrontendStatic', {
      sources: [s3deploy.Source.asset(FRONTEND_BUILD_DIR)],
      destinationBucket: appBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
      exclude: ['index.html', '**/index.html', 'service-worker.js'],
      memoryLimit: 512, // im Auge behalten -> bei Problemen erhöhen, war anfangs zu wenig
    })

    // Deployment für Assets, die nicht gecachet werden sollen
    new s3deploy.BucketDeployment(this, 'FrontendHtml', {
      sources: [s3deploy.Source.asset(FRONTEND_BUILD_DIR)],
      destinationBucket: appBucket,
      prune: false,
      include: ['index.html', '**/index.html', 'service-worker.js'],
      exclude: ['*'],
      cacheControl: [
        s3deploy.CacheControl.fromString(
          'max-age=0,no-cache,no-store,must-revalidate'
        ),
      ],
    })

    // DNS (Route53) - optional
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
