#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Copy a local clone of the legacy prod app bucket and insert banner.html into its pages.

Offline-mode users are served the precached index.html by the service worker and won't
see the banner; the precache manifest is intentionally left untouched.
"""

import argparse
import shutil
import sys
from pathlib import Path

BANNER = Path(__file__).parent / "banner.html"
PAGES = ["index.html", "teilen/index.html", "settings/index.html"]
ANCHOR = '<div id="__mausapp"></div>'
BUCKET = "hackingstudio-code4maus-app-prod"


def patch_page(path: Path, banner: str) -> None:
    html = path.read_text(encoding="utf-8")
    if html.count(ANCHOR) != 1:
        sys.exit(f"{path}: expected exactly one {ANCHOR!r}")
    indent = html[: html.index(ANCHOR)].rsplit("\n", 1)[-1]
    snippet = "\n".join(indent + line if line else line for line in banner.splitlines())
    path.write_text(html.replace(ANCHOR, f"{ANCHOR}\n{snippet}"), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("src", type=Path, help="local clone of the bucket")
    parser.add_argument("dest", type=Path, help="output directory, must not exist")
    args = parser.parse_args()

    if args.dest.exists():
        sys.exit(f"{args.dest} already exists")
    for page in PAGES:
        if not (args.src / page).is_file():
            sys.exit(f"{args.src / page} not found")

    banner = BANNER.read_text(encoding="utf-8").strip()
    shutil.copytree(args.src, args.dest)
    for page in PAGES:
        patch_page(args.dest / page, banner)

    print(f"Patched {len(PAGES)} pages in {args.dest}. Upload with:\n")
    for page in PAGES:
        print(
            f"aws s3 cp {args.dest / page} s3://{BUCKET}/{page} --metadata-directive REPLACE"
            " --cache-control max-age=0,no-cache,no-store,must-revalidate"
            " --content-type text/html --acl public-read"
        )


if __name__ == "__main__":
    main()
