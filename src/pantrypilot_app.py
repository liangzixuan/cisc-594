"""Generic PantryPilot application entry point for CM demonstration."""

from __future__ import annotations

import json
from pathlib import Path


def load_config(path: str | Path = "config/app_config.json") -> dict:
    """Load the version-controlled PantryPilot configuration file."""
    with Path(path).open("r", encoding="utf-8") as file:
        return json.load(file)


def describe_release(config: dict) -> str:
    """Return a stable release description used by smoke tests and CI."""
    app_name = config["app_name"]
    version = config["baseline_version"]
    release_name = config["release_name"]
    return f"{app_name} {version}: {release_name}"


if __name__ == "__main__":
    print(describe_release(load_config()))
