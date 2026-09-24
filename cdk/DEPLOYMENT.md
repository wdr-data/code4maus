# CDK-Deployment PmdM

Im Zuge der App-Erneuerung wurde das Deployment im Mai 2026 vom Serverless Framework auf AWS CDK umgestellt.

## Stages

| Stage | Domain | Projekt-Bucket |
|-------|--------|----------------|
| `dev` | `dev.maus.metahost.org` | `pmdm-projectbucket-dev-<account>` |
| `staging` | `staging.code4maus.wt.wdr.cloud` | `pmdm-projectbucket-staging-<account>` |
| `prod` | `programmieren.wdrmaus.de` | `pmdm-projectbucket-prod-<account>` |

Die aktive Stage wird über die Umgebungsvariable `STAGE` oder den CDK-Kontext-Parameter `--context stage=<stage>` gesetzt. Ohne Angabe wird `dev` verwendet.

## Infrastruktur-Komponenten

### S3-Buckets

**`pmdm-appbucket-{stage}-{account}`** — enthält das gebaute Frontend (statische Dateien). Nur CloudFront hat Lesezugriff.

**`pmdm-projectbucket-{stage}-{account}`** — enthält Nutzerprojekte (`data/projects/`), hochgeladene Assets (`data/assets/`) und geteilte Ergebnisse (`data/sharing/`). Nur CloudFront und die Lambdas haben Zugriff. CORS ist für PUT-Requests von der jeweiligen Stage-Domain konfiguriert.

### Lambda-Funktionen

Die Handler liegen unter `../src/backend/` und werden beim CDK-Build mit esbuild gebundelt (Node.js 24).

| Lambda | Endpunkt | Funktion |
|--------|----------|----------|
| `prepareAssetUpload` | `POST /api/prepareAssetUpload` | Prüft, ob ein Medien-Asset (Maus-Kostüm, Hintergrund, Sound) bereits im Projekt-Bucket existiert, und liefert andernfalls eine Pre-Signed-URL, damit der Browser es direkt in S3 hochladen kann. |
| `saveProject` | `POST /api/saveProject` | Speichert das aktuelle Scratch-Projekt als JSON in S3 und pflegt einen Pro-User-Index mit Projektname und Zeitstempeln. |
| `prepareShareResult` | `POST /api/prepareShareResult` | Generiert einen eindeutigen 5-stelligen Share-Key und eine Pre-Signed-URL, über die die App einen teilbaren Snapshot des Projektergebnisses in S3 ablegen kann. |

### API Gateway

REST-API (`mausapp-{stage}`) mit drei POST-Endpunkten, die je eine Lambda integrieren. CORS ist für POST und OPTIONS von der jeweiligen Stage-Domain erlaubt.

### CloudFront CDN

Einstiegspunkt für alle Anfragen, konfiguriert mit drei Origins:

| Pfad | Origin | Caching |
|------|--------|---------|
| `/*` (Default) | AppBucket | optimiert (`index.html` kein Cache) |
| `/data/*` | ProjectBucket | deaktiviert |
| `/api/*` | API Gateway | deaktiviert |

Preisklasse 100 (Europa + USA). TLS-Mindestversion TLS 1.2.

### Routing der Seiten

Eine CloudFront Function (`EntrypointRewrite`, Quelltext in `functions/entrypoint-rewrite.js`) hängt am Default-Behavior und entscheidet vor dem Origin-Zugriff, ob ein Pfad eine Datei im App-Bucket meint oder eine Seite:

- **Dateien** werden unverändert durchgereicht: alles unter `/static/`, alle `.js` und `.map` im Wurzelverzeichnis sowie `/favicon.png` und `/_redirects`.
- **Seiten** bekommen die passende `index.html`. Die Haupt-App ist eine SPA, alle ihre Routen (`/lernspiele`, `/projekt/123`, …) liefern dieselbe `/index.html`. Daneben gibt es zwei eigenständige Seiten mit eigenem HTML: `/teilen` (Anzeige geteilter Ergebnisse) und `/settings` (Feature-Flags).

Die URL im Browser bleibt dabei unverändert. Die Liste der Dateien ist eine Allowlist: Unbekannte Pfade gelten als Seite und landen in der App, nicht als roher S3-Fehler. Kommt eine neue Datei ins Wurzelverzeichnis (`robots.txt`, `manifest.json`, `/.well-known/…`), muss sie in der Function ergänzt werden.

Bewusst **kein** `errorResponses` an der Distribution: Das hätte für alle Behaviors gegolten und auch Fehler von `/api/*` und `/data/*` in „200 + `index.html`" verwandelt. Fehlende Assets und API-Fehler kommen so als echte Fehler beim Frontend an.

Kommt eine weitere eigenständige Seite dazu, muss sie an drei Stellen eingetragen werden: `customHtmlPlugin` in `webpack.config.js`, die Function in `functions/entrypoint-rewrite.js` und die `navigateFallbackDenylist` des Service Workers.

### TLS-Zertifikate

Zertifikate müssen manuell in ACM in der Region **`us-east-1`** angelegt werden — das ist eine CloudFront-Voraussetzung, unabhängig davon, wo der Rest des Stacks läuft.

```bash
# Vorhandene Zertifikate nachschlagen
aws acm list-certificates --region us-east-1
```

Die Zertifikat-ARNs werden in `lib/config.ts` je Stage eingetragen.

### DNS

DNS wird org-intern außerhalb von AWS verwaltet und nicht über Route53 abgebildet. Die Records werden **manuell** gepflegt: Die Stage-Domain zeigt per CNAME auf die CloudFront-Domain (`*.cloudfront.net`) der jeweiligen Distribution. Die Domain muss außerdem im Zertifikat der Stage enthalten sein.

CloudFront-Domain einer Stage nachschlagen (die Distribution trägt den Kommentar `Code4Maus <stage>`):

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='Code4Maus dev'].DomainName" \
  --output text
```

Die Route53-Logik ist im Stack noch enthalten, aber abgeschaltet (`createDnsRecord = false` in `bin/cdk.ts`). Zum Reaktivieren müssten zusätzlich `hostedZoneId` und `hostedZoneName` je Stage in `lib/config.ts` eingetragen werden.

## Setup

Voraussetzungen:
- Node.js + npm
- AWS CLI konfiguriert (`aws sso login` oder Umgebungsvariablen)
- Das Frontend muss vor dem CDK-Deploy gebaut sein (`yarn build` im Root)

```bash
cd cdk
npm install
npm run build   # TypeScript kompilieren
```

## Deployment

```bash
# Vorschau: was würde sich ändern?
STAGE=dev npx cdk diff

# Deployen
STAGE=dev npx cdk deploy

# Alternativ über CDK-Kontext
npx cdk deploy --context stage=staging
```

Beim ersten Deploy einer neuen Stage: sicherstellen, dass Zertifikat-ARN in `lib/config.ts` eingetragen ist (kein Placeholder mehr).

## CI/CD (GitHub Actions)

Deployments laufen über GitHub Actions. Die Branch-Namen bilden die Stages ab:

| Workflow | Trigger | Stage | Ablauf |
|----------|---------|-------|--------|
| `deploy-dev.yml` | Push auf `develop`, manuell (`workflow_dispatch`) | dev | direkt: diff → deploy |
| `deploy-staging.yml` | Push auf `staging` | staging | gated: plan → Freigabe → apply |
| `deploy-production.yml` | Push auf `production` | prod | gated: plan → Freigabe → apply |

Die Trigger-Workflows rufen einen von zwei wiederverwendbaren Workflows auf:

- **`_deploy.yml`** (dev) baut Frontend und Stack, schreibt `cdk diff` ins Log und deployt direkt.
- **`_deploy-gated.yml`** (staging, prod) besteht aus zwei Jobs:
  - `plan` baut und synthetisiert den Stack, schreibt den `cdk diff` in die Run-Summary und sichert das Cloud Assembly (`cdk.out`) als Artefakt.
  - `apply` ist an das GitHub-Environment gebunden. Hat das Environment einen Required Reviewer, pausiert der Run hier bis zur Freigabe. Danach wird exakt das Assembly aus `plan` deployt (`cdk deploy --app cdk.out`).

Freigabe eines gated Deploys: Run öffnen → im `plan`-Job unter *Summary* den Diff prüfen → **Review deployments** → Environment auswählen → **Approve and deploy**. Wird abgelehnt, bleibt der Stack unverändert.

`pr-checks.yml` baut bei Pull Requests gegen `develop`, `staging` und `production` das Frontend und synthetisiert den Stack (`cdk synth`). Das läuft ohne Deploy und ohne AWS-Zugriff und fängt Bundling-, Config- und Template-Fehler vor dem Merge ab.

Hinweise zu den Triggern:

- `workflow_dispatch` (manueller Start) steht erst zur Verfügung, wenn der Workflow auf dem Default-Branch (`develop`) liegt. Danach lässt sich beim Start ein beliebiger Branch auswählen.

### Authentifizierung

Die Workflows authentifizieren sich mit den statischen Access Keys eines eigenen IAM-Users (kein OIDC).

Der IAM-User `code4maus-ci-deploy` hat nur programmatischen Zugriff und eine Customer-Managed-Policy (`code4maus-cdk-deploy`). Sie erlaubt ausschließlich, die von `cdk bootstrap` angelegten Rollen anzunehmen und die Bootstrap-Version zu lesen. Die eigentlichen Deploy-Rechte liegen in diesen `cdk-*`-Rollen, nicht beim User.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AssumeCdkRoles",
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::<account>:role/cdk-hnb659fds-*"
    },
    {
      "Sid": "BootstrapVersion",
      "Effect": "Allow",
      "Action": "ssm:GetParameter",
      "Resource": "arn:aws:ssm:eu-central-1:<account>:parameter/cdk-bootstrap/*"
    }
  ]
}
```

Die Policy setzt voraus, dass der Account mit dem Default-Qualifier `hnb659fds` gebootstrappt ist. Einen Deploy mit den Keys des CI-Users lokal testen:

```bash
aws configure --profile code4maus-ci
AWS_PROFILE=code4maus-ci npx cdk deploy --context stage=dev --require-approval never
```

### GitHub-Konfiguration

- Secrets `AWS_ACCESS_KEY_ID_2026` und `AWS_SECRET_ACCESS_KEY_2026` mit den Keys des CI-Users anlegen, als Repo-Secret oder je Environment.
- Environments `dev`, `staging` und `prod` anlegen. Bei `prod` (und bei Bedarf `staging`) einen **Required Reviewer** hinterlegen. Ohne Reviewer läuft `apply` ohne Pause durch.

### Voraussetzungen vor dem ersten CI-Deploy einer Stage

- Der Account ist gebootstrappt (`cdk bootstrap aws://<account>/eu-central-1`).
- Die Platzhalter für Account und `certArn` in `lib/config.ts` sind durch echte Werte ersetzt (betrifft derzeit staging und prod).
- Der Branch der Stage existiert (`staging` gibt es noch nicht).
- Nach dem ersten Deploy ist der DNS-Record manuell gesetzt (siehe [DNS](#dns)).

## Nützliche CDK-Befehle

```bash
npm run build       # TypeScript kompilieren
npm run watch       # TypeScript im Watch-Modus
npm run test        # CDK-Tests ausführen
npx cdk synth       # CloudFormation-Template ausgeben (ohne Deploy)
npx cdk diff        # Vergleich mit deploytem Stack
npx cdk deploy      # Stack deployen
```
