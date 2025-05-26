# Core Module

## Overview

The `core` module is the heart of the application. It defines the main domain logic, shared types, constants, and utility functions used by other modules and services. It acts as a central dependency for all other features.

## What does it do?

- Provides core types, interfaces, and enums (such as `NetworkId`, `ServiceDefinition`, etc).
- Contains utility helpers that are needed throughout the codebase.
- Maintains application-wide constants and configuration.
- Exposes low-level logic that should not depend on specific platforms or services.

## Typical Usage

- All feature modules (such as service integrations or the tx-parser) import their core types and helpers from here.
- When adding a new feature, always check if its base types or utilities should belong to core first.

## Philosophy

- No platform-specific or business-specific logic should live here.
- Code in `core` must be reusable and framework-agnostic.

## Contribution

- If you need a new shared type or helper, add it here.
- Changes should be backwards compatible as much as possible.
