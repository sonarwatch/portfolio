# Solana Plugin Runner

This script automatically detects and runs **all Solana-related plugins** in the codebase. It identifies plugins that use `NetworkId.solana`, executes their `*Job.ts` and `*Fetcher.ts` scripts, and uses a local cache for optimized performance.

---

## Features

- **Auto-detects Solana plugins** — No need to manually list them.
- **Runs all Solana Jobs** — Any `*Job.ts` file inside the plugin.
- **Runs all Solana Fetchers** — Any `*Fetcher.ts` file using a test wallet address.
- **Local cache** support to improve job performance.
- **Auto cleanup** — Stops cache after execution.

---

## Prerequisites

Make sure you have:

- `node` and `npm` installed
- All project dependencies installed (`npm install`)
- `npx nx` available (comes with the monorepo setup)

---

## Running the Script

```bash
bash run-solana.sh
```
