# 🔗 Solana Integration – SonarWatch Portfolio

This guide covers the Solana-specific portion of the SonarWatch portfolio backend.

This integration is responsible for indexing Solana DeFi protocols, tracking wallet activity, computing token prices, and converting all of that into structured portfolio data.

---

## 🔍 Responsibilities of the Solana Code

| Area | Description |
|------|-------------|
| 🪙 **Token Price Indexing** | Fetches token prices (e.g., from liquidity pools or on-chain oracles) and stores them in cache |
| 👛 **User Wallet Scanning** | Finds what tokens, LPs, NFTs, or positions a wallet holds |
| 📦 **Protocol Position Tracking** | Detects deposits, staked tokens, loans, rewards, locked tokens, etc., in Solana DeFi protocols |
| 💾 **Caching & Aggregation** | Combines on-chain data with off-chain metadata, stores in Redis or overlay caches |
| 🌉 **Plugin System** | Each Solana protocol (e.g., Kamino, Jito, Zeta) is modularized into fetchers (per-wallet) and jobs (indexers) |

---

## 🧩 How It Works

The Solana integration follows a **plugin-based architecture**.

Each plugin contains:

### 1. 🛠 `*Job.ts` – Protocol Indexers

Jobs are periodic scripts that:

- Pull on-chain program account data (via Solana RPC)
- Parse custom Solana structs (via borsh or manual deserialization)
- Calculate token prices, metadata, or protocol state
- Write to the cache for fast lookup by fetchers
- Retrieves and caches pools/vaults/etc for protocols 

📍 **Examples**:
- `kamino/reservesJob.ts`: Gets lending reserves and APRs
- `jito/vaultsJob.ts`: Calculates restaking vault token prices

---

### 2. 👤 `*Fetcher.ts` – Per-User Position Fetchers

Fetchers are executed per wallet address and:

- Query on-chain data tied to the wallet (e.g. token accounts, staking positions)
- Decode balances, claimable rewards, or LP shares.
- Return structured `PortfolioElement` objects for frontend display

📍 **Examples**:
- `zeta/stakingFetcher.ts`: Gets ZEX tokens staked by the user
- `adrena/positionsFetcher.ts`: Finds leverage positions
- `guano/stakingFetcher.ts`: Detects locked/unstaked tokens

---

## ⚙️ Environment Setup

```env
PORTFOLIO_SOLANA_RPC=https://mainnet.helius-rpc.com/?api-key=your-key
PORTFOLIO_SOLANA_DAS_ENDPOINT=https://mainnet.helius-rpc.com/das/v0/?api-key=your-key

CACHE_CONFIG_TYPE=redis
CACHE_CONFIG_REDIS_URL=redis://localhost:6379
CACHE_CONFIG_REDIS_DB=0
CACHE_CONFIG_REDIS_TTL=14400
```

---

## Setup infrastructure
Run redis in docker
```
  cd ${PORTFOLIO_API_HOME}/development
  docker compose up -d
```

## 🚀 Running Locally

Install and build:

```bash
npm install
```

List available jobs:
```bash
npx nx run plugins:list-jobs solana
```

Run a job:
```bash
npx nx run plugins:run-job kamino-reserves
```

Run all jobs:
```bash
npx nx run plugins:run-jobs-by-network-id solana
```

List available fetchers:
```bash
npx nx run plugins:list-fetchers solana
```

Run a fetcher for a wallet:
```bash
npx nx run plugins:run-fetcher kamino-farms BBkoocctRizBPsu2WRHx5xvpd21UHx6ARVEDGVw7sAFa
```

Run all fetchers for provided address on solana network:
```bash
npx nx run plugins:run-fetchers-by-network-id solana BBkoocctRizBPsu2WRHx5xvpd21UHx6ARVEDGVw7sAFa
```

Get list of transactions by solana address:
```bash
npx nx run tx-parser:run BBkoocctRizBPsu2WRHx5xvpd21UHx6ARVEDGVw7sAFa
```

### Example
1. We need to get data for `streamflow` protocol
2. List all the fetcher and search for `streamflow`
```
  npx nx run plugins:list-fetchers solana | grep streamflow
```
3. Try to run the necessary fetcher
```
 npx nx run plugins:run-fetcher streamflow-merkles Hp8SsZZZot8UB28HTfEuxxCXECoSiwHfpzqwenjrMPKF
```
4. You will see an error like this
```
  if (merkles.length === 0) throw new Error('No active merkles found in cache');
```
5. It means that you need to run some job (often it has similar name). Run
```
  npx nx run plugins:run-job streamflow-merkles
```
6. Try to rerun fetcher from step 3. It will finish successfully, but could return no data.
   It happens because there is no prices in the cache. To populate prices it is required to run
   The second one is long running
```
 npx nx run plugins:run-job token-lists-solana
 npx nx run plugins:run-job wallet-tokens-solana
```
7. If you need to debug something, the next code to the script section of 
   `package.json` in the root folder, and run it debug mode from IDE 
```
"merkles": "npx nx run plugins:run-fetcher streamflow-merkles Hp8SsZZZot8UB28HTfEuxxCXECoSiwHfpzqwenjrMPKF",
```

---

## ➕ Adding a New Protocol

```bash
npx nx generate @sonarwatch/portfolio-plugins:plugin my-protocol
```

Then generate a job or fetcher:

```bash
npx nx generate @sonarwatch/portfolio-plugins:job --jobName=myJob --pluginId=my-protocol
npx nx generate @sonarwatch/portfolio-plugins:fetcher --fetcherName=myFetcher --pluginId=my-protocol
```
