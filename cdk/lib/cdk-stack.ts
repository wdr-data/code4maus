import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { StageConfig, StageName } from './config'

export interface MausAppStackProps extends StackProps {
  stage: StageName
  config: StageConfig
  createDnsRecord: boolean
}

export class MausAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MausAppStackProps) {
    super(scope, id, props);

    const { stage, config, createDnsRecord } = props


    // S3
    const appBucket = new s3.Bucket(this, 'AppBucket', {
        bucketName: `pmdm-appbucket-${stage}`,
        encryption: s3.BucketEncryption.KMS,
       //blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, //tbd!
       removalPolicy: RemovalPolicy.RETAIN,
       accessControl: s3.BucketAccessControl.PRIVATE,
       websiteIndexDocument: "index.html",
       websiteErrorDocument: "index.html",
    });

   const projectBucketCorsRule: s3.CorsRule = {
      allowedMethods: [s3.HttpMethods.PUT],
      allowedOrigins: [`https://${config.domain}`], // tbd: ist das die richtige?
      allowedHeaders: ['content-type'],
      id: 'projectBucketCORSRule1',
      maxAge: 1800,
    };

   const projectBucket = new s3.Bucket(this, 'ProjectBucket', {
       bucketName: `pmdm-projectbucket-${stage}`,
       encryption: s3.BucketEncryption.KMS,
       removalPolicy: RemovalPolicy.RETAIN,
       cors: [projectBucketCorsRule],
       accessControl: s3.BucketAccessControl.PRIVATE,
    });

   // Lambda
   const REPO_ROOT = path.resolve(__dirname, '..', '..')
   const FRONTEND_BUILD_DIR = path.join(REPO_ROOT, 'build')
   const HANDLERS_DIR = path.join(REPO_ROOT, 'src', 'backend')
      const lambdaCommon = {
          runtime: lambda.Runtime.NODEJS_24_X,
          memorySize: 256,
          timeout: Duration.seconds(15),
          projectRoot: REPO_ROOT,
          //depsLockFilePath: path.join(REPO_ROOT, 'yarn.lock'),
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
              //externalModules: ['@aws-sdk/*'],
              nodeModules: [
                  'aws-sdk',
                  'nanoid',
                  'shortid',
          ],
          // TODO austauschen https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-javascript-v2/
        externalModules: [],
        target: 'node24',
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

     // Project (user data)
     const projectsOrigin = origins.S3BucketOrigin.withOriginAccessControl(projectBucket)
     const dataBehavior: cloudfront.BehaviorOptions = {
       origin: projectsOrigin,
       viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
       allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
       cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
       cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
       compress: true,
     }

     // App
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
         memoryLimit: 512,
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
   // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
