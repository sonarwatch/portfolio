# Adrastea (JLP Leverage & USDC Passive)

This package provides integration for [Adrastea.fi](https://adrastea.fi/) on Solana, enabling users to see their JLP leveraged positions and USDC passive lending directly in their Lambda portfolio.

---

## What is Adrastea?

Adrastea is a DeFi platform on Solana offering:

- **JLP Leverage**: Leveraged trading pools using JLP tokens.
- **USDC Passive**: Passive USDC lending for stable, low-risk yield.

Users deposit into these pools and receive yield based on their positions.
This integration detects both leveraged and lending positions by reading Adrastea's on-chain ledgers.

## How It Works

The integration uses background jobs and a fetcher to aggregate positions:

- Jobs read on-chain ledgers for both JLP and USDC pools, extract all holder positions, and cache them for efficient access.
- Fetcher checks if a user has a position in these pools and constructs PortfolioElements for the Lambda UI.

### Architecture
```pqsql
          ┌──────────────────────────────┐
          │      Adrastea Ledgers        │
          └────────────┬─────────────────┘
                       │
        ┌──────────────▼───────────────┐
        │    Lambda Portfolio Engine   │
        └──────────────┬───────────────┘
                       │
       ┌───────────────▼───────────────┐
       │  Positions Jobs (indexer)     │
       └───────────────┬───────────────┘
                       │
              ┌────────▼────────┐
              │   Cache Layer   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Fetcher (UI)   │
              └─────────────────┘
```

---

**Implemented Features**

1. JLP Leverage Positions:
- Finds and displays user's leveraged JLP holdings.
- Links to Adrastea leverage UI.

2. USDC Passive Lending:
- Detects user's USDC passive lending positions.
- Links to Adrastea passive UI.

3. Efficient Caching:
- Uses background jobs to batch and cache all positions, reducing on-chain requests for every user lookup.

4. Auto Valuation:
- Amounts can be valued in USD through SonarWatch's pricing infra.

---

## Technical Details
### On-Chain Account Layouts

See `structs.ts`:

1. JlpLedger and UsdcLedger:
- Each holds an array (holders) of up to 5,000 holder entries (JlpHolder or UsdcHolder).
- Each holder entry contains:
```ts
`address`: User's public key
`base_amount`: Amount deposited (BigNumber)
`balance`: Current balance (BigNumber)
Additional fields for tracking deposit times, leverage, borrows, etc.
```

**Example:** JlpHolder struct

```ts
export type JlpHolder = {
  address: PublicKey;
  base_amount: BigNumber;
  // ...other fields omitted for brevity
};
```

### Fetching and Caching Logic

1. Background Jobs
-  `positionsJob`:
-- Fetches all holders from both ledgers (jlpLedgerPk, usdcLedgerPk).
-- Maps non-zero base_amount entries to { owner, amount } objects.
-- Caches these arrays under the keys jlp_positions and usdc_positions in SonarWatch's cache layer.
- `lrtsSolJob`:
-- Updates the price source for Adrastea's synthetic sSOL product in the SonarWatch token price map.

### Token Mapping

- Fetches ACS token price via cache.getTokenPrice(acsMint, NetworkId.solana)
- Each staked asset’s USD value is calculated for accurate portfolio reporting.

### Exports

- **fetchers**: Array of fetchers (only ACS staking supported)
- **jobs**: (empty for now)

---

## Extending

To add support for other Access Protocol contract features or future staking types:

- Extend the filters or struct parsing logic in positionFetcher.ts.
- Add more detailed attributes or links if available on-chain.

## Known Limitations

- **Only ACS staking is supported**: No support for bonds, rewards, or other contract types.
- **Static ACS mint**: If protocol moves to new mints, acsMint and acsDecimals must be updated.
- Only Solana mainnet.
- No batch processing for multiple wallets.
