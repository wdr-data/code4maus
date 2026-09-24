# CDK-Deployment PmdM
Im Zuge der App-Erneuerung wurde das alte Deployment mit dem Serverless Framework im Mai 2026 auf AWS-CDK umgestellt. Ziel war, das Deployment auf eine moderne und standardisierte Basis zu setzen, mit der das Entwicklungsteam schon Erfahrung hat.

Details zu Komponenten, Routing, Zertifikaten, DNS und CI/CD: siehe [DEPLOYMENT.md](DEPLOYMENT.md).

## Benutzung
### Vorbereitung
- gewünschte Domains in lib/config.ts eintragen
- aws-cli wie benötigt einrichten inkl. Access Keys o.ä.
- in ACM (AWS Certificate Manager) in us-east-1 Zertifikate requesten
- per DNS-01-Challenge bestätigen
- Zertifikat-ARNs in lib/config.ts eintragen
- bei Bedarf (neuer AWS-Account): bootstrappen nicht vergessen
### Deployment
- im Rootverzeichnis .env anlegen (kopieren von .env.example) und passende Werte einfüllen
- mit `yarn build` die App bauen
- für alle folgenden CDK-Calls folgende Optionen beachten: `npx cdk <Befehl> -c stage=dev --profile=pmdm-dev` -> dabei ist `stage` eine von `dev`, `staging` und `prod`, Profile ist der Name des Accounts in der lokalen AWSCLI-Config
- im CDK-Verzeichnis `npx cdk diff` die Änderungen anzeigen lassen, ggf. mit `npx cdk synth` das CloudFormation-Template prüfen
- und dann mit `npx cdk deploy` deployen.
- Bei externer DNS-Zone: CloudFront-Domainname aus dem Stack-Output `DistributionDomainName` nehmen und CNAME-Record damit anlegen

## TO DO
- KMS-Wünsche klären
  - gibt es bestehende Policies dazu im WDR? Warnung zu circular dependency erscheint immer -> Key ggf von Hand anlegen o.ä.?
- Tagging?
- Automatisches Aufräumen
  - Log Groups
  - Assets
  - alte Projekte (Löschfunktion)
- Legacy-Deployment entfernen
  - Netlify (ggf. behalten für PR-Previews? Oder wollen wir die anders lösen, wenn überhaupt?)
  - Workflows
  - Serverless
