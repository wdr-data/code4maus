"""Gruppiert eine S3-Objektliste nach Account und entscheidet, wer migriert wird.

Liest von stdin TSV-Zeilen `Key<TAB>LastModified<TAB>Size`, wie sie
`aws s3api list-objects-v2 --query 'Contents[].[Key,LastModified,Size]'
--output text` ausgibt, und schreibt die Planungsdatei nach stdout.

Aufruf: migration-plan.py <prefix> <jahre>
Siehe scripts/migrate-projects.sh.
"""

import sys
from collections import defaultdict
from datetime import datetime, timedelta, timezone


def main():
    if len(sys.argv) != 3:
        print(__doc__, file=sys.stderr)
        return 1

    prefix, years = sys.argv[1], int(sys.argv[2])
    cutoff = datetime.now(timezone.utc) - timedelta(days=365 * years)

    users = defaultdict(lambda: {"last": None, "objects": 0, "bytes": 0})

    for line in sys.stdin:
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 3:
            continue
        key, last_modified, size = parts[0], parts[1], parts[2]
        rest = key[len(prefix) :]
        if "/" not in rest:
            # Objekt direkt unter dem Prefix, gehört zu keinem Account
            continue
        user = rest.split("/", 1)[0]
        timestamp = datetime.fromisoformat(last_modified.replace("Z", "+00:00"))
        entry = users[user]
        if entry["last"] is None or timestamp > entry["last"]:
            entry["last"] = timestamp
        entry["objects"] += 1
        entry["bytes"] += int(size)

    kept = dropped = kept_bytes = dropped_bytes = 0

    print("\t".join(["decision", "user", "last_modified", "objects", "bytes"]))
    for user in sorted(users):
        entry = users[user]
        keep = entry["last"] >= cutoff
        if keep:
            kept += 1
            kept_bytes += entry["bytes"]
        else:
            dropped += 1
            dropped_bytes += entry["bytes"]
        print(
            "\t".join(
                [
                    "KEEP" if keep else "DROP",
                    user,
                    entry["last"].isoformat(),
                    str(entry["objects"]),
                    str(entry["bytes"]),
                ]
            )
        )

    def gigabytes(value):
        return f"{value / 1024 ** 3:.2f} GB"

    print(
        f"Stichtag: {cutoff.date().isoformat()}\n"
        f"  behalten:  {kept:>7} Accounts, {gigabytes(kept_bytes)}\n"
        f"  verworfen: {dropped:>7} Accounts, {gigabytes(dropped_bytes)}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
