#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { MausAppStack } from '../lib/cdk-stack'
import { resolveStage, STAGES } from '../lib/config'

const app = new cdk.App()

// Stage über CDK-Context (`cdk deploy -c stage=staging`) bzw. als Fallback die
// STAGE-Env-Var. Account/Region kommen fest pro Stage aus der config.
const stage = resolveStage(app.node.tryGetContext('stage') ?? process.env.STAGE)
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
    account: config.account,
    region: config.region,
  },
  description: `PmdM stack (${stage})`,
})
