# CDK-Deployment PmdM
Im Zuge der App-Erneuerung wurde das alte Deployment mit dem Serverless Framework im Mai 2026 auf AWS-CDK umgestellt. Ziel war, das Deployment auf eine moderne und standardisierte Basis zu setzen, mit der das Entwicklungsteam schon Erfahrung hat.

## Stages
Das Deployment ist in die Stages 'dev', 'staging' und 'prod' aufgeteilt. Die aktive Stage wird über die Umgebungsvariable `STAGE` oder den CDK-Kontext-Parameter `--context stage=<stage>` gesetzt. Ohne Angabe wird `dev` verwendet.

## Komponenten
### S3-Buckets
Das Projekt beinhaltet zwei S3-Buckets:
- pmdm-appbucket-{stage} beinhaltet die statische Applikation, um sie auszuliefern. Nur CloudFront hat Lesezugriff.
- pmdm-projectbucket-{stage} beinhaltet gespeicherte Projekte der User und einige statische Maus-Assets. Nur CloudFront und die Lambdas haben Zugriff. CORS ist für PUT-Requests von der jeweiligen Stage-Domain konfiguriert.

### Lambda-Funktionen
Die Lambdafunktionen laufen mit NodeJS, das im Rahmen des Updates auf die aktuellste Runtime-Version 24 aktualisiert wurde. Die Handler liegen unter `../src/backend/` und werden beim CDK-Build mit esbuild gebundelt.

- `prepareAssetUpload`: Prüft, ob ein Medien-Asset (Maus-Kostüm, Hintergrund, Sound) bereits im Projekt-Bucket existiert, und liefert andernfalls eine Pre-Signed-URL, damit der Browser es direkt in S3 hochladen kann.
- `saveProject`: Speichert das aktuelle Scratch-Projekt als JSON in S3 und pflegt einen Pro-User-Index mit Projektname und Zeitstempeln.
- `prepareShareResult`: Generiert einen eindeutigen 5-stelligen Share-Key und eine Pre-Signed-URL, über die die App einen teilbaren Snapshot des Projektergebnisses in S3 ablegen kann.

### API Gateway
Das API Gateway stellt eine einfache API bereit, mit denen die Applikation die Lambas ansprechen kann. Die drei Endpoints mappen direkt auf die Namen der Lambdafunktionen.

### Cloudfront CDN
Cloudfront stellt den Einstiegspunkt für Aufrufe dar und verteilt Requests an die Buckets und die API. Es ist derzeit in der niedrigsten Preisklasse konfiguriert, die hauptsächlich Europa und die USA einschließt.

### DNS
Hier ist noch zu klären, ob die DNS-Zone tatsächlich in Route53 gehostet wird oder extern. Derzeit ist der Code für externes DNS konfiguriert, eine Route53-Integration ist aber schon vorbereitet.

## Zertifikate
Derzeit müssen die TLS-Zertifikate separat gemanagt werden, damit mit einer externen DNS-Zone zusammengearbeitet werden kann.

## Benutzung
### Vorbereitung
Mit externer DNS-Zone:
- `createDnsRecord` in der bin/cdk.ts auf false setzen
- gewünschte Domains in lib/config.ts eintragen
- aws-cli wie benötigt einrichten inkl. Access Keys o.ä.
- in ACM (AWS Certificate Manager) händisch die Zertifikate anlegen und per DNS-01-Challenge bestätigen
- Zertifikat-ARNs in lib/config.ts eintragen
### Deployment
- im Rootverzeichnis mit `yarn build` die App bauen
- im CDK-Verzeichnis `npx cdk diff` die Änderungen anzeigen lassen, ggf. mit `npx cdk synth` das CloudFormation-Template prüfen
- und dann mit `npx cdk deploy` deployen.
