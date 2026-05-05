#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { MausAppStack } from '../lib/cdk-stack'
import { resolveStage, STAGES } from '../lib/config'

const app = new cdk.App()

const stage = resolveStage(process.env.STAGE ?? app.node.tryGetContext('stage'))
const config = STAGES[stage]

// tbd: arbeiten wir überhaupt mit hosted zones oder nur externen DNS-Records?
/*
const createDnsRecord =
  (process.env.CREATE_DNS_RECORD ??
    app.node.tryGetContext('createDnsRecord') ??
    'true') !== 'false'
    */
    const createDnsRecord = false // für Entwicklungsphase und Testing

new MausAppStack(app, `MausApp-${stage}`, {
  stage,
  config,
  createDnsRecord,
  env: {
    account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: config.region || process.env.CDK_DEFAULT_REGION,
  },
  description: `PmdM stack (${stage})`,
})
