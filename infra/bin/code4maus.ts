#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { Code4MausStack } from '../lib/code4maus-stack'
import { resolveStage, STAGES } from '../lib/config'

const app = new cdk.App()

const stage = resolveStage(process.env.STAGE ?? app.node.tryGetContext('stage'))
const config = STAGES[stage]

const createDnsRecord = (process.env.CREATE_DNS_RECORD ?? app.node.tryGetContext('createDnsRecord') ?? 'true') !== 'false'

new Code4MausStack(app, `Code4Maus-${stage}`, {
  stage,
  config,
  createDnsRecord,
  env: {
    account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: config.region,
  },
  description: `Code4Maus stack (${stage})`,
})
