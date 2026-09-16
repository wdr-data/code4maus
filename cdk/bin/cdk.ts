#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { MausAppStack } from '../lib/cdk-stack'
import { resolveStage, STAGES } from '../lib/config'

const app = new cdk.App()

// Stage über CDK-Context (`cdk deploy -c stage=staging`) bzw. als Fallback die
// STAGE-Env-Var. Account/Region kommen fest pro Stage aus der config.
const stage = resolveStage(app.node.tryGetContext('stage') ?? process.env.STAGE)
const config = STAGES[stage]

// DNS wird org-intern außerhalb von AWS verwaltet; die Records (CNAME auf die
// CloudFront-Domain) werden manuell gepflegt. Zonenverwaltung in ROute53 ist
// vorhanden, aber abgeschaltet. Zum Reaktivieren auf true setzen und
// hostedZoneId/hostedZoneName je Stage in lib/config.ts eintragen.
const createDnsRecord = false

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
