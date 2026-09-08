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

Preisklasse 100 (Europa + USA). TLS-Mindestversion TLS 1.2. 403- und 404-Fehler werden auf `index.html` umgeleitet (SPA-Routing).

### TLS-Zertifikate

Zertifikate müssen manuell in ACM in der Region **`us-east-1`** angelegt werden — das ist eine CloudFront-Voraussetzung, unabhängig davon, wo der Rest des Stacks läuft.

```bash
# Vorhandene Zertifikate nachschlagen
aws acm list-certificates --region us-east-1
```

Die Zertifikat-ARNs werden in `lib/config.ts` je Stage eingetragen.

### DNS

DNS-Records werden derzeit **extern** verwaltet (`createDnsRecord = false` in `bin/cdk.ts`). Nach dem ersten Deploy gibt CloudFront eine Domain aus (`*.cloudfront.net`), auf die der externe DNS-Record (CNAME oder ALIAS) zeigen muss.

Ob die DNS-Zonen langfristig nach Route53 umgezogen werden, ist noch offen — die Infrastruktur dafür ist vorbereitet (`hostedZoneId`/`hostedZoneName` in `lib/config.ts`).

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

Deployments laufen über GitHub Actions. Ein wiederverwendbarer Workflow
(`.github/workflows/_deploy.yml`) baut das Frontend und führt `cdk deploy` aus;
drei schlanke Workflows triggern ihn:

| Workflow | Trigger | Stage | Environment |
|----------|---------|-------|-------------|
| `deploy-dev.yml` | Push auf `develop` (+ manuell) | dev | `dev` |
| `deploy-staging.yml` | Push auf `staging` | staging | `staging` |
| `deploy-production.yml` | Push auf `production` | prod | `prod` (Approval) |

`pr-checks.yml` baut bei Pull Requests gegen `develop`/`production` das Frontend
und synthetisiert den Stack (`cdk synth`) — ohne Deploy und ohne AWS-Zugriff, um
Bundling-, Config- und Template-Fehler vor dem Merge zu fangen.

### Authentifizierung (OIDC)

Die Workflows nehmen per GitHub-OIDC eine IAM-Deploy-Role an — keine statischen
Keys. Einmalige AWS-Einrichtung im Zielaccount:

1. OIDC-Provider für GitHub anlegen (falls noch nicht vorhanden):
   - Provider-URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2. IAM-Role mit Trust-Policy auf dieses Repo anlegen. Da die Deploy-Jobs ein
   `environment:` setzen, ist der Token-`sub` environment- (nicht branch-)
   basiert — die Bedingung muss darauf matchen:

   ```json
   "Condition": {
     "StringEquals": {
       "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
     },
     "StringLike": {
       "token.actions.githubusercontent.com:sub": [
         "repo:wdr-data/code4maus:environment:dev",
         "repo:wdr-data/code4maus:environment:staging",
         "repo:wdr-data/code4maus:environment:prod"
       ]
     }
   }
   ```
3. Der Role Deploy-Rechte geben: am einfachsten das Annehmen der von
   `cdk bootstrap` angelegten Rollen erlauben (`sts:AssumeRole` auf
   `arn:aws:iam::<account>:role/cdk-*`).

### GitHub-Konfiguration

- Drei Environments anlegen: `dev`, `staging`, `prod`.
- In jedem Environment die Variable `AWS_DEPLOY_ROLE_ARN` (ARN der Deploy-Role)
  setzen — bei einem gemeinsamen Account für alle drei dieselbe ARN möglich.
- Beim Environment `prod` einen **Required Reviewer** hinterlegen, damit der
  Deploy erst nach manueller Freigabe läuft.

### Voraussetzungen vor dem ersten CI-Deploy

- `cdk bootstrap aws://<account>/eu-central-1` einmalig ausführen.
- Für staging/prod die Platzhalter in `lib/config.ts` (Account, certArn,
  hostedZoneId) durch echte Werte ersetzen — sonst schlägt deren Deploy fehl.

## Nützliche CDK-Befehle

```bash
npm run build       # TypeScript kompilieren
npm run watch       # TypeScript im Watch-Modus
npm run test        # CDK-Tests ausführen
npx cdk synth       # CloudFormation-Template ausgeben (ohne Deploy)
npx cdk diff        # Vergleich mit deploytem Stack
npx cdk deploy      # Stack deployen
```
