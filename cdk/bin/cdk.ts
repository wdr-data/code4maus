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

// Wartungsmodus: regulär über `maintenance` in lib/config.ts, damit jeder
// Deploy den aktuellen Stand mitführt. Context bzw. Env-Var sind der Notweg,
// falls mal nicht über CI deployt werden kann:
//   npx cdk deploy -c stage=prod -c maintenance=true -c maintenanceToken=…
const maintenanceOverride =
  app.node.tryGetContext('maintenance') ?? process.env.MAINTENANCE
const maintenance =
  maintenanceOverride !== undefined && maintenanceOverride !== ''
    ? String(maintenanceOverride) === 'true'
    : (config.maintenance ?? false)

// Nicht im Repo ablegen: in CI als Secret, lokal als Context-Parameter.
const maintenanceToken =
  app.node.tryGetContext('maintenanceToken') ??
  process.env.MAINTENANCE_TOKEN ??
  ''

if (maintenance && !maintenanceToken) {
  throw new Error(
    `Wartungsmodus für Stage "${stage}" ist aktiv, aber kein maintenanceToken gesetzt. ` +
      'Ohne Token gibt es keinen Weg an der Wartungsseite vorbei.'
  )
}

new MausAppStack(app, `MausApp-${stage}`, {
  stage,
  config,
  createDnsRecord,
  maintenance,
  maintenanceToken,
  env: {
    account: config.account,
    region: config.region,
  },
  description: `PmdM stack (${stage})`,
})
