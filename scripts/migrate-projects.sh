#!/usr/bin/env bash
#
# Migriert die Nutzerdaten aus dem alten in den neuen Projekt-Bucket.
#
# Projekte werden dabei aufgeräumt: Übernommen wird ein Account nur, wenn
# mindestens eines seiner Objekte innerhalb des Stichtags zuletzt geändert
# wurde. Wer also in den letzten Jahren etwas bearbeitet hat, behält alle
# seine Projekte, alle anderen fallen weg.
#
#   SRC_BUCKET=… ./scripts/migrate-projects.sh plan    # Auswahl berechnen
#   SRC_BUCKET=… DST_BUCKET=… ./scripts/migrate-projects.sh apply
#
# Assets und geteilte Ergebnisse werden dagegen vollständig kopiert, ohne
# Auswahl. Assets sind inhaltsadressiert und über alle Nutzer geteilt, und
# Share-Links sind öffentlich im Umlauf:
#
#   SRC_BUCKET=… DST_BUCKET=… ./scripts/migrate-projects.sh shared
#
# `apply` und `shared` sind ohne DRY_RUN=0 nur Probeläufe. Beide nutzen
# `aws s3 sync`, sind also inkrementell: Ein erster Lauf vor dem Wartungs-
# fenster und ein zweiter darin holt nur noch die Differenz.
#
# Als Stichtag dient `LastModified` der S3-Objekte. Die index.json eines
# Accounts wird bei jedem Speichern neu geschrieben, der Wert entspricht also
# dem `updated_at` aus den Projektdaten. Vorsicht: Wurde der Quell-Bucket
# jemals im Ganzen umkopiert, sind die Zeitstempel zurückgesetzt und die
# Auswahl wäre wertlos. Das vorher einmal stichprobenartig prüfen.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SRC_BUCKET="${SRC_BUCKET:-}"
DST_BUCKET="${DST_BUCKET:-}"
PREFIX="${PREFIX:-data/projects/}"
SHARED_PREFIXES="${SHARED_PREFIXES:-data/assets/ data/sharing/}"
YEARS="${YEARS:-2}"
PLAN_FILE="${PLAN_FILE:-migration-plan.tsv}"
# Profile der lokalen AWS-CLI-Config. SRC_PROFILE darf leer bleiben, wenn die
# Credentials aus DST_PROFILE den Quell-Bucket lesen dürfen.
SRC_PROFILE="${SRC_PROFILE:-}"
DST_PROFILE="${DST_PROFILE:-}"
PARALLEL="${PARALLEL:-8}"
DRY_RUN="${DRY_RUN:-1}"

src_args=()
if [ -n "$SRC_PROFILE" ]; then
  src_args=(--profile "$SRC_PROFILE")
fi
dst_args=()
if [ -n "$DST_PROFILE" ]; then
  dst_args=(--profile "$DST_PROFILE")
fi

die() {
  echo "Fehler: $*" >&2
  exit 1
}

usage() {
  cat >&2 <<'EOF'
Aufruf: migrate-projects.sh plan|apply|shared

  plan     Auswahl der Accounts berechnen und als Planungsdatei schreiben
  apply    die auf KEEP stehenden Accounts kopieren
  shared   Assets und geteilte Ergebnisse vollständig kopieren

Umgebungsvariablen:
  SRC_BUCKET        Quell-Bucket (Pflicht)
  DST_BUCKET        Ziel-Bucket (Pflicht für apply und shared)
  PREFIX            Standard: data/projects/
  SHARED_PREFIXES   Standard: data/assets/ data/sharing/
  YEARS             Stichtag in Jahren, Standard: 2
  PLAN_FILE         Standard: migration-plan.tsv
  SRC_PROFILE       AWS-Profil für den Quell-Bucket (optional)
  DST_PROFILE       AWS-Profil für den Ziel-Bucket
  PARALLEL          parallele Kopiervorgänge, Standard: 8
  DRY_RUN           1 (Standard) = nur anzeigen, 0 = wirklich kopieren
EOF
  exit 1
}

# Kopiert serverseitig. Die Credentials aus DST_PROFILE brauchen dafür
# Lesezugriff auf den Quell-Bucket und kms:GenerateDataKey auf den Key des
# Ziel-Buckets.
sync_args=(--only-show-errors)
prepare_sync() {
  [ -n "$SRC_BUCKET" ] || die "SRC_BUCKET ist nicht gesetzt"
  [ -n "$DST_BUCKET" ] || die "DST_BUCKET ist nicht gesetzt"
  if [ "$DRY_RUN" != "0" ]; then
    sync_args+=(--dryrun)
    echo "Probelauf. Zum echten Kopieren DRY_RUN=0 setzen." >&2
  fi
}

# ---------------------------------------------------------------- plan -----

plan() {
  [ -n "$SRC_BUCKET" ] || die "SRC_BUCKET ist nicht gesetzt"

  echo "Liste Objekte unter s3://$SRC_BUCKET/$PREFIX ..." >&2

  aws "${src_args[@]}" s3api list-objects-v2 \
    --bucket "$SRC_BUCKET" \
    --prefix "$PREFIX" \
    --query 'Contents[].[Key,LastModified,Size]' \
    --output text \
    | python3 "$SCRIPT_DIR/lib/migration-plan.py" "$PREFIX" "$YEARS" \
      >"$PLAN_FILE"

  echo "Plan geschrieben: $PLAN_FILE" >&2
}

# --------------------------------------------------------------- apply -----

apply() {
  prepare_sync
  [ -f "$PLAN_FILE" ] || die "$PLAN_FILE fehlt - erst 'plan' ausführen"

  local total
  total=$(awk -F'\t' '$1 == "KEEP"' "$PLAN_FILE" | wc -l)
  echo "Kopiere $total Accounts mit $PARALLEL parallelen Vorgängen ..." >&2

  awk -F'\t' '$1 == "KEEP" { print $2 }' "$PLAN_FILE" \
    | xargs -P "$PARALLEL" -I{} \
      aws "${dst_args[@]}" s3 sync \
      "s3://$SRC_BUCKET/$PREFIX{}/" \
      "s3://$DST_BUCKET/$PREFIX{}/" \
      "${sync_args[@]}"

  echo "Fertig." >&2
}

# -------------------------------------------------------------- shared -----

shared() {
  prepare_sync

  # Bewusst ohne Auswahl: Assets sind inhaltsadressiert und werden über alle
  # Nutzer geteilt, geteilte Ergebnisse hängen an öffentlich verschickten Links.
  for shared_prefix in $SHARED_PREFIXES; do
    echo "Kopiere s3://$SRC_BUCKET/$shared_prefix ..." >&2
    aws "${dst_args[@]}" s3 sync \
      "s3://$SRC_BUCKET/$shared_prefix" \
      "s3://$DST_BUCKET/$shared_prefix" \
      "${sync_args[@]}"
  done

  echo "Fertig." >&2
}

case "${1:-}" in
  plan) plan ;;
  apply) apply ;;
  shared) shared ;;
  *) usage ;;
esac
