#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Report which legacy projects and assets a last-saved cutoff would delete, based on an S3 listing.

Input is the output of
  aws s3api list-objects-v2 --bucket hackingstudio-code4maus-projects-prod --prefix data/
S3 LastModified is the last save; reads leave no trace in S3, so "last opened" is unknowable.

With --projects-dir (a local copy of the bucket's data/projects/, e.g. via aws s3 sync), the
report also covers which assets are still referenced by the kept projects or built into the app.
"""

import argparse
import json
import subprocess
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import date, datetime
from multiprocessing import Pool
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


@dataclass
class Project:
    key: str
    saved: date
    size: int
    assets: frozenset[str] = frozenset()


@dataclass
class User:
    index: date | None = None
    projects: list[Project] = field(default_factory=list)

    @property
    def last_save(self) -> date:
        dates = [p.saved for p in self.projects]
        if self.index:
            dates.append(self.index)
        return max(dates)


@dataclass
class Listing:
    users: dict[str, User]
    assets: dict[str, tuple[date, int]]
    other: Counter


def load(path: str) -> Listing:
    with open(path, encoding="utf-8") as f:
        contents = json.load(f)["Contents"]
    users: dict[str, User] = defaultdict(User)
    assets = {}
    other = Counter()
    for obj in contents:
        parts = obj["Key"].split("/", 3)
        modified = datetime.fromisoformat(obj["LastModified"]).date()
        if parts[:2] == ["data", "projects"] and len(parts) == 4:
            user = users[parts[2]]
            if parts[3] == "index.json":
                user.index = modified
            else:
                user.projects.append(Project(obj["Key"], modified, obj["Size"]))
        elif parts[:2] == ["data", "assets"] and len(parts) == 3:
            if not parts[2].startswith("."):
                assets[parts[2]] = (modified, obj["Size"])
        else:
            other["/".join(parts[:2])] += 1
    return Listing(dict(users), assets, other)


def project_assets(path: Path) -> tuple[str, frozenset[str]]:
    try:
        with open(path, encoding="utf-8") as f:
            project = json.load(f)
        return "ok", frozenset(
            a["md5ext"] if "md5ext" in a else f"{a['assetId']}.{a['dataFormat']}"
            for target in project["targets"]
            for a in target.get("costumes", []) + target.get("sounds", [])
        )
    except FileNotFoundError:
        return "missing locally", frozenset()
    except (ValueError, KeyError, TypeError):
        return "unparseable", frozenset()


def builtin_assets() -> set[str]:
    script = "require('./scripts/lib/assets').getAllAssets().then(a => console.log(JSON.stringify(a)))"
    result = subprocess.run(["node", "-e", script], cwd=REPO, capture_output=True, text=True, check=True)
    return set(json.loads(result.stdout))


def n(value: int) -> str:
    return f"{value:,}"


def pct(part: int, total: int) -> str:
    return f"{100 * part / total:.1f} %" if total else "–"


def gb(size: int) -> str:
    return f"{size / 1e9:.2f} GB"


def table(header: list[str], rows: list[list[str]]) -> str:
    lines = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    lines += ["| " + " | ".join(row) + " |" for row in rows]
    return "\n".join(lines)


def years_before(day: date, years: int) -> date:
    try:
        return day.replace(year=day.year - years)
    except ValueError:  # Feb 29
        return day.replace(year=day.year - years, day=28)


def kept_projects(users: dict[str, User], cutoff: date, per_user: bool) -> list[Project]:
    if per_user:
        return [p for u in users.values() if u.last_save >= cutoff for p in u.projects]
    return [p for u in users.values() for p in u.projects if p.saved >= cutoff]


def projects_report(listing: Listing, users: dict[str, User], cutover: date, years: list[int]) -> list[str]:
    projects = [p for u in users.values() for p in u.projects]
    project_bytes = sum(p.size for p in projects)
    latest = max(p.saved for p in projects)
    out = []

    out.append("## Overview\n")
    out.append(
        table(
            ["", "Count", "Size"],
            [
                ["Users with projects", n(len(users)), ""],
                ["Users with only an index.json", n(len(listing.users) - len(users)), ""],
                ["Users with projects but no index.json", n(sum(u.index is None for u in users.values())), ""],
                ["Project files", n(len(projects)), gb(project_bytes)],
                ["Project files in subfolders (e.g. edu/…)", n(sum(p.key.count("/") > 3 for p in projects)), ""],
                ["Assets", n(len(listing.assets)), gb(sum(s for _, s in listing.assets.values()))],
            ]
            + [[f"Other keys under {k}/", n(v), ""] for k, v in sorted(listing.other.items())],
        )
    )
    out.append(f"\nMost recent project save: {latest}. Cutover date: {cutover}.")

    out.append("\n## Cutoffs\n")
    out.append(
        "*Per project*: delete every project not saved since the cutoff. "
        "*Per user*: delete all projects of users who haven't saved any project since the cutoff. "
        "User counts only include users with at least one project file.\n"
    )
    rows = []
    for y in years:
        cutoff = years_before(cutover, y)
        old = [p for p in projects if p.saved < cutoff]
        gone_users = partial_users = 0
        for u in users.values():
            old_count = sum(p.saved < cutoff for p in u.projects)
            gone_users += old_count == len(u.projects)
            partial_users += 0 < old_count < len(u.projects)
        inactive = [u for u in users.values() if u.last_save < cutoff]
        inactive_projects = [p for u in inactive for p in u.projects]
        rows.append(
            [
                f"{y} y ({cutoff})",
                f"{n(len(old))} ({pct(len(old), len(projects))})",
                gb(sum(p.size for p in old)),
                n(gone_users),
                n(partial_users),
                f"{n(len(inactive))} ({pct(len(inactive), len(users))})",
                f"{n(len(inactive_projects))} ({pct(len(inactive_projects), len(projects))})",
                gb(sum(p.size for p in inactive_projects)),
            ]
        )
    out.append(
        table(
            [
                "Not saved for",
                "Per project: projects deleted",
                "Size",
                "Users losing everything",
                "Users losing some",
                "Per user: users deleted",
                "Projects deleted",
                "Size",
            ],
            rows,
        )
    )

    out.append("\n## Last save by year\n")
    by_year_projects = Counter(p.saved.year for p in projects)
    by_year_users = Counter(u.last_save.year for u in users.values())
    by_year_assets = Counter(d.year for d, _ in listing.assets.values())
    out.append(
        table(
            ["Year", "Projects", "Users (latest save)", "Assets (uploaded)"],
            [
                [str(y), n(by_year_projects[y]), n(by_year_users[y]), n(by_year_assets[y])]
                for y in sorted(by_year_projects | by_year_users | by_year_assets)
            ],
        )
    )

    out.append("\n## Saves in the last 12 months\n")
    out.append("Checks that saving still works on the old deployment.\n")
    by_month = Counter(f"{p.saved.year}-{p.saved.month:02}" for p in projects)
    months = []
    y, m = latest.year, latest.month
    for _ in range(12):
        months.append(f"{y}-{m:02}")
        y, m = (y, m - 1) if m > 1 else (y - 1, 12)
    out.append(table(["Month", "Projects saved"], [[k, n(by_month[k])] for k in reversed(months)]))

    out.append("\n## Busiest days\n")
    out.append(
        "Copying objects resets LastModified. A day far above the rest points to a bulk copy, "
        "not real saves.\n"
    )
    by_day = Counter(p.saved for p in projects)
    out.append(table(["Day", "Projects saved"], [[str(d), n(c)] for d, c in by_day.most_common(10)]))
    return out


def assets_report(
    listing: Listing, users: dict[str, User], projects_dir: Path, cutover: date, years: list[int]
) -> list[str]:
    projects = [p for u in users.values() for p in u.projects]
    with Pool() as pool:
        results = pool.map(project_assets, [projects_dir / p.key for p in projects], chunksize=1000)
    status = Counter()
    for project, (state, assets) in zip(projects, results):
        project.assets = assets
        status[state] += 1

    builtins = builtin_assets()
    in_bucket = set(listing.assets)
    total_bytes = sum(s for _, s in listing.assets.values())
    out = []

    out.append("\n## Assets\n")
    out.append(
        "Kept assets are those referenced by a kept project plus the built-in library, tutorial and "
        "default project assets from `scripts/lib/assets.js` in the current repo.\n"
    )
    out.append(
        table(
            ["", "Count"],
            [[f"Project files {k}", n(v)] for k, v in sorted(status.items())]
            + [
                ["Built-in assets", n(len(builtins))],
                ["Built-in assets missing from the bucket", n(len(builtins - in_bucket))],
            ],
        )
    )
    if missing := sorted(builtins - in_bucket):
        out.append("\nMissing built-ins: " + ", ".join(f"`{a}`" for a in missing))

    rows = []
    scenarios = [("Nothing deleted", None, False)] + [
        (f"{y} y ({years_before(cutover, y)})", years_before(cutover, y), per_user)
        for y in years
        for per_user in (False, True)
    ]
    for label, cutoff, per_user in scenarios:
        kept = projects if cutoff is None else kept_projects(users, cutoff, per_user)
        referenced = set().union(*(p.assets for p in kept))
        keep = (referenced | builtins) & in_bucket
        dropped_bytes = total_bytes - sum(listing.assets[a][1] for a in keep)
        rows.append(
            [
                label,
                "" if cutoff is None else ("per user" if per_user else "per project"),
                n(len(kept)),
                f"{n(len(keep))} ({gb(total_bytes - dropped_bytes)})",
                f"{n(len(in_bucket) - len(keep))} ({pct(len(in_bucket) - len(keep), len(in_bucket))})",
                f"{gb(dropped_bytes)} ({pct(dropped_bytes, total_bytes)})",
                n(len(referenced - in_bucket)),
            ]
        )
    out.append("")
    out.append(
        table(
            [
                "Not saved for",
                "Rule",
                "Projects kept",
                "Assets kept",
                "Assets dropped",
                "Size dropped",
                "Referenced but not in bucket",
            ],
            rows,
        )
    )
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("listing", help="list-objects-v2 JSON output")
    parser.add_argument(
        "--projects-dir", type=Path, help="local copy of the bucket root, containing data/projects/"
    )
    parser.add_argument("--cutover", type=date.fromisoformat, default=date(2026, 10, 20))
    parser.add_argument("--years", type=lambda s: [int(y) for y in s.split(",")], default=[1, 2, 3, 5])
    args = parser.parse_args()

    listing = load(args.listing)
    users = {uid: u for uid, u in listing.users.items() if u.projects}
    out = [f"# Legacy project cleanup report\n\nSource: `{args.listing}`\n"]
    out += projects_report(listing, users, args.cutover, args.years)
    if args.projects_dir:
        out += assets_report(listing, users, args.projects_dir, args.cutover, args.years)
    print("\n".join(out))


if __name__ == "__main__":
    main()
