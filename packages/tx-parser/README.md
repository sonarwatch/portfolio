# TX-Parser Module

## Overview

The `tx-parser` module is responsible for parsing blockchain transactions (TX) and extracting meaningful data for further processing. It analyzes raw transaction data and identifies which protocols, services, or contracts were involved.

## What does it do?

- Takes raw or partially decoded transaction data as input.
- Identifies instructions and maps them to known protocols/services using pre-defined contracts.
- Extracts and normalizes transaction actions for further processing or display.
- Exposes parsing logic as helper functions or classes.

## Typical Usage

- Used by the main backend/API to enrich wallet history and protocol activity.
- Can be extended to support new protocols by adding contract definitions and matching logic.

## Philosophy

- Parsing logic should be deterministic and idempotent.
- The module should be easily extendable for new protocols and instruction types.
- No UI or platform-specific code should be present.

## Contribution

- To support a new protocol, add its contract and update the matching logic.
- Ensure new parsing logic is well-tested with sample transactions.
