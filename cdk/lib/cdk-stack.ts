import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3';
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

    //console.log('Domain: ', process.env.baseUrl)

    // S3
    const appBucket = new s3.Bucket(this, 'AppBucket', {
        bucketName: `appbucket-${stage}`,
        encryption: s3.BucketEncryption.KMS,
       //blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, //tbd!
       removalPolicy: RemovalPolicy.RETAIN,
       accessControl: s3.BucketAccessControl.PRIVATE,
       websiteIndexDocument: "index.html",
       websiteErrorDocument: "index.html",
    });

   const projectBucketCorsRule: s3.CorsRule = {
      allowedMethods: [s3.HttpMethods.PUT],
      allowedOrigins: ['https://${file(scripts/env.js):baseDomain}'], // TODO nichtfunktionale Variable aus serverless -> ersetzen
      allowedHeaders: ['content-type'],
      id: 'projectBucketCORSRule1',
      maxAge: 1800,
    };

   const projectBucket = new s3.Bucket(this, 'ProjectBucket', {
       bucketName: `projectbucket-${stage}`,
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
          ],
          // TODO austauschen https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-javascript-v2/
        externalModules: [],
        target: 'node24',
        sourceMap: true,
      },
    }
   /*
   // machen wir später
   const prepareAssetUpload = new lambda.Function(this, "PrepareAssetUploadFunction", {
     runtime: lambda.Runtime.NODEJS_24_X, // Provide any supported Node.js runtime
     handler: "handler",
     code: lambda.Code.fromAsset("src/backend/prepareAssetUpload.js"),
   });
   */
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



   // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
