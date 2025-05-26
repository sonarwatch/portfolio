# Streamflow

This package implements support for [Streamflow](https://streamflow.finance/), a token streaming and vesting protocol on Solana, within the Lambda portfolio engine.
It fetches, parses, and exposes all of a user’s streaming token positions (both incoming and outgoing) as portfolio elements, along with associated token balances and claimable amounts.
---

## What is Streamflow?

Streamflow is a decentralized protocol for programmable token vesting, salary payments, and continuous value transfer (“streams”) on Solana.
It supports custom vesting schedules, direct streaming payments, and escrowed token release, widely used for payroll, team vesting, and DAOs.

Each Streamflow stream is a unique on-chain account linking a sender, recipient, schedule, and token mint.

## How It Works

This plugin integrates Streamflow positions into the Lambda portfolio engine via Fetchers:

- Queries on-chain accounts for all streams where the user is either a sender or recipient.
- Parses all relevant stream data (start, end, deposited, withdrawn, mint, recipients, etc).
- Calculates live claimable balances for in-progress streams, including unclaimed tokens.
- Converts each active stream into Lambda PortfolioElements, with details for the UI and valuations using up-to-date token prices from cache.

### Architecture
```flow
flowchart TD
    subgraph Onchain
        SFProgram["Streamflow Program"]
        SFStreamAccount["Stream Account(s)"]
        SFProgram --> SFStreamAccount
    end

    UserWallet["User Wallet"] -- "Derive/Filter" --> SFProgram
    SFStreamAccount --> |"Parse Data"| PortfolioEngine["Lambda Portfolio Engine"]
    PortfolioEngine --> |"Token Price Lookup + Claimable Logic"| PortfolioElements["Portfolio Elements"]
```

**Key Concepts**

- **Stream Account**: On-chain account containing all data about a stream (mint, sender, recipient, deposited/withdrawn, schedule).
- **Fetcher**: Logic module which loads/parses all streams for the user, and outputs them as standard portfolio elements.
- **Token Price Integration**: Fetched tokens are valued in USD via cache, for accurate total portfolio representation.
- **Claimable Logic**: Computes the currently claimable amount for each stream (unclaimed, streaming, or vesting).

---

**Implemented Features**

1. **Automatic discovery of all user-related Streamflow streams**: Both incoming (receiving) and outgoing (sending) streams.
2. **Live claimable balance computation**: For all streams, shows currently claimable but not yet withdrawn amounts.
3. **Full mapping to Lambda PortfolioElement type**: Includes all stream metadata, links, asset information, claimable and remaining balances.
4. **Token price integration**: Uses cache for current USD value.
5. **Optimized fetching**: Single-pass account scan per user.
6. **Edge case handling**: Skips closed or exhausted streams, handles decimals and rounding.


**Not yet implemented**

1. Stream creation/withdrawal transactions (view only, not tx sending).
2. Advanced vesting curve types (linear, cliffs, etc. are read-only, not simulated).
3. Batch fetching for multiple wallets.
4. Legacy/archived stream formats.

---

## Technical Details
### Account Layout

See `structs.ts`:

- Stream account layout is parsed using [Metaplex BeetStructs](https://github.com/metaplex-foundation/beet).
- Contains sender, recipient, mint, amounts, timestamps, and optional vesting schedules.

```ts
export type StreamAccount = {
  sender: PublicKey;
  recipient: PublicKey;
  mint: PublicKey;
  deposited: BigNumber;
  withdrawn: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  ... // other vesting params
};
```

### Fetching Logic

Main logic: `positionFetcher.ts`

1. Loads all program accounts for Streamflow where user is sender or recipient (filtered on-chain).
2. For each stream, parses data and calculates:
- Claimable balance = deposited - withdrawn, proportional to elapsed time/schedule.
- Token mint/decimals mapping.
- USD value using cache.
- Includes links to stream details on Streamflow web app.

3. Returns each as a Lambda PortfolioElement (type = streaming or vesting).

_Example PortfolioElement_
```ts
{
  type: "vesting",
  networkId: "solana",
  platformId: "streamflow",
  label: "Streamed",
  value: 123.45, // USD
  data: {
    asset: { address: "...", amount: 1000, ... },
    claimable: 123,
    unvested: 877,
    streamDetails: { ... }
  }
}
```

### Exports

- **fetchers**: Array of fetchers (exposes both incoming and outgoing streams)
- **jobs**: (if present, jobs for cache preloading or updating token price data)

---

## Extending

To add support for more advanced features:

- Implement support for more vesting curve types or stream schedules.
- Batch fetch multiple wallets at once.
- Add support for viewing pending/cancelled/closed streams.
- Expand claim/withdrawal transaction support in the UI.

## Known Limitations

- **No tx sending:** Read-only, portfolio display only.
- Token price accuracy depends on cache freshness.
- Edge-case vesting or stream curves may need additional logic.
- Streamflow protocol upgrades may require Beet struct updates.
- Streams created in non-standard formats may be skipped.
