# 01 Protocol

This package implements support for the [01 Protocol](https://www.01.xyz/) margin lending platform on Solana within the Lambda portfolio engine.
It fetches and parses user margin accounts, exposes lending (supplied collateral) positions, and integrates token prices for full portfolio valuation.

---

## What is 01 Protocol?

01 is a decentralized margin trading and lending protocol on Solana, supporting a variety of collateral assets.
Each user’s margin positions are stored in a single Solana account (PDA) associated with their wallet.

## How It Works

This plugin integrates 01 into the Lambda portfolio engine as a Fetcher:

- It derives the PDA for a user's margin account.
- Fetches and parses the on-chain margin account data.
- Maps raw collateral balances to tokens using a hardcoded list of mints (must be kept in sync with the protocol).
- Converts balances to readable format, fetches current prices from cache, and returns the positions as portfolio elements.

### Architecture
```pqsql
┌────────────┐      Derive PDA      ┌────────────┐      Read On-Chain       ┌─────────────┐
│ User Wallet│ ───────────────────▶ │01 Program  │ ───────────────────────▶ │Margin Acct  │
└────────────┘                      └────────────┘                          └─────────────┘
      │                                    │                                      │
      ▼                                    ▼                                      ▼
Portfolio Engine ─────▶ Fetcher (this repo) ─────▶ Parse Structs ─────▶ Map Balances to Tokens
```

### Key Concepts
- **Margin Account (PDA)**: Stores up to 25 collateral balances, mapped 1:1 to a static list of token mints.
- **Fetcher**: The main logic that loads and parses the user’s margin data, then presents it in the Lambda portfolio format.
- **Token Price Integration**: Uses cached token prices for portfolio valuation.

---

**Implemented Features**

- Detection of supplied collateral in a user's 01 margin account
- Conversion to Lambda PortfolioElement (borrowlend type)
- Automatic mint/token mapping
- Dynamic token price valuation using cache
- Optimized single-account fetch (PDA)

**Not yet implemented**

- Borrowed positions (all borrowedAssets will be empty)
- Rewards, liquidations, or advanced margin features
- Dynamic mint list (uses a static hardcoded array)

---

## Technical Details
### Account Layout

See `struct.ts`:
- Parses the on-chain margin account using a [BeetStruct](https://github.com/metaplex-foundation/beet) definition.
- Each account contains an array of 25 collateral slots, each mapped to a known SPL mint.

```ts
export type Margin = {
  buffer: Buffer;
  nonce: number;
  authority: PublicKey;
  collateral: WrappedI80F48[]; // 25 slots
  control: PublicKey;
  padding: Buffer;
};
```

### Fetching Logic

Main logic: `depostisFetcher.ts`

- Derives the PDA using:
```ts
PDA = findProgramAddressSync([owner, state, 'marginv1'], programId)
```

- Loads and parses the margin account using the Beet struct.
- Loops through collateral slots; for each slot with a positive balance, matches with the corresponding mint.
- For specific tokens (e.g., SOL, mSOL), applies a division factor for decimals.
- Queries the token price from cache and returns an appropriately typed portfolio element.

### Token Mapping

The mints array defines the correspondence between each collateral slot and its SPL mint:
```ts
export const mints = [
  USDC_MINT,
  wSOL_MINT,
  BTC_MINT,
  USDT_MINT,
  ETH_MINT,
  ...
  mSOL_MINT,
  ...
  // Placeholder mints are '111...1'
];
```

**Important:** The index in collateral must always match the mint in mints.

###  Edge Cases & Error Handling

- If a margin account does not exist or has all zero balances, the fetcher returns an empty array.
- If a mint is a placeholder ('111...1'), the slot is skipped.
- Small balances below 0.0001 are ignored.
- The fetcher is defensive: no assets = no elements returned.

### Exports

- **fetchers**: Array of fetchers (only deposits supported)
- **jobs**: (empty for now)

---

## Extending

To add support for borrowed assets, rewards, or dynamic mint mapping:

- Expand the logic in depostisFetcher.ts to parse and map borrowed positions.
- Use dynamic on-chain sources for mints (if/when supported by protocol).
- Add additional portfolio element types as needed.

## Known Limitations

- **Static mint mapping:** If 01 adds/removes assets, this must be updated manually.
- **Only supply (deposit) side supported:** No borrow, reward, or liquidation parsing yet.
- **25 slot limit:** Hardcoded by current protocol layout.
-  No batch fetching for multiple wallets.
