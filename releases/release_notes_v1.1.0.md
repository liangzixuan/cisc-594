# PantryPilot Release Notes - v1.1.0

## Release Summary

Version `v1.1.0` adds deterministic controls for the major risks identified in
the semester project risk register. The release extends the `v1.0.0` Plan &
Adapt baseline with small but testable behavior for safety filtering, grocery
aggregation, and pantry expiry boundaries.

## Changes Included

- Added allergen alias detection for generated or adapted recipe output.
- Added grocery-list aggregation by canonical ingredient name and unit.
- Added inclusive near-expiry date logic for pantry items.
- Added tests for allergen filtering, safe recipes, grocery aggregation, and
  boundary-date behavior.

## Verification

- Local test command: `pytest`
- Expected CI gate: all tests pass before merge to `main`.
- Release tag: `v1.1.0`

## Rollback

Rollback target is tag `v1.0.0` if the safety or grocery controls fail release
acceptance.
