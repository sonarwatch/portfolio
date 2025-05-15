# SonarWatch Portfolio

[![Core NPM Version](https://img.shields.io/npm/v/@sonarwatch/portfolio-core?color=33cd56&label=npm%20core)](https://www.npmjs.com/package/@sonarwatch/portfolio-core)
[![Plugins NPM Version](https://img.shields.io/npm/v/@sonarwatch/portfolio-plugins?color=33cd56&label=npm%20plugins)](https://www.npmjs.com/package/@sonarwatch/portfolio-plugins)

Useful links:

- [Github repository](https://github.com/sonarwatch/portfolio)
- [API Rest](https://portfolio-api.sonar.watch/api)
- [Documentation](https://sonarwatch.github.io/portfolio/)
- [Integration Documentation](https://docs.sonar.watch/open-source/list-your-project)

This repository powers SonarWatch website by fetching all DeFi assets for a wallet on multiple chains, it covers:

- Tokens value
- NFTs (listed included)
- LP Tokens value
- Lending and borrowing amount
- Spot accounts
- Native stake accounts
- many other to come!

# How does it works?

Anyone can contribute to this repository to help us cover more protocols and create a better coverage for the user.

This repository is divided in <b>plugins</b>, each plugin can have :

- <b>Job(s)</b> : they retrieve common data for all users and store it in the <b>Cache</b>
- <b>Fetcher(s)</b> : they retrieve information for a single user and send back a list of assets

## What is a Job ?

A <b>Job</b> will store data into our <b>Cache</b>, those data are usually common data for all users (information about the amounts of a tokens on a lending protocol, liquidity pools prices, etc..)

To add data to the Cache, you will mainly use the following methods on the `cache` object :

- Add a price for a specific Token address (token, lp, etc...) : `cache.setTokenPriceSource()`
- Add any item : `cache.setItem()`

<u><b>Warning</b></u> If your Job is adding prices for tokens, make sure to verify those prices by :

1. Running your local cache.
2. Running your Job, this will add prices into your local cache.
3. Running the Fetcher `wallet-tokens-<networkId>`, this will fetch all tokens within the wallet and get the prices from the Cache (local + distant). (see below for commands)

You can create as many <b>Jobs</b> as needed by plugins.

## What is a Fetcher ?

A <b>Fetcher</b> is were the logic stand, it usually (not necessarily) recover some data from the <b>Cache</b>, then use it to compute the value of the assets deposited by a user on a protocol.

Some examples of <b>Fetchers</b> :

- Get all Concentrated Liquidity Positions of a user from an AMM
- Get all deposits and loans of a user on a Lending protocol
- Get all listed NFTs for a user on a marketplace
- etc...

You can create as many <b>Fetchers</b> as needed by plugins, each <b>Fetcher</b> being entitled to a Networkd (Solana, Sui, Aptos etc..).

You always need to provide a <b>user address</b> to run a fetcher.

# How to start ?

## Setup your environment

1. <b>Clone</b> this repository.
2. Run

```bash
npm install
```

3. Setup your own `.env` file by running :

```bash
cp .env.example .env
```

4. If you need a new plugin, run :

```bash
npx nx generate @sonarwatch/portfolio-plugins:plugin my-super-protocol
```

5. Depending on what you're trying to achieve, either create a `Job` or a `Fetcher` (see commands below)

## Import your fetchers and jobs

Once you're down writing the logic on your `Job` or `Fetcher` :

1. Add your `Job`(s) and `Fetcher`(s) to your `index.ts` file in your `plugin` folder
2. Add your `Fetchers` and `Jobs` to the `packages\plugins\src\index.ts` file

## Test your job/fetcher

Before anything, you need to run the <b>Cache</b> on your local network, simply run :

```bash
npx nx run plugins:serve-cache
```

If you are adding a liquidity protocol
You're now ready to try your `Fetcher` or `Job` by running the following commands :

- Job :

```bash
npx nx run plugins:run-job jobId
```

Example :

```bash
# Run the job mango-banks
npx nx run plugins:run-job mango-banks
```

- Fetcher (remember to provide an address):

```bash
npx nx run plugins:run-fetcher fetcherId userAddress
```

Example :

```bash
# Run the fetcher mango-collateral on the address Demo...tKG
npx nx run plugins:run-fetcher mango-collateral DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG
```

# Useful commands

Here is a list of useful command that can help you during your integration.

```bash
# Getting started
npm install
cp .env.example .env
# Set your RPCs

# Generate a plugin
npx nx generate @sonarwatch/portfolio-plugins:plugin my-super-protocol

# Generator a job
npx nx generate @sonarwatch/portfolio-plugins:job --jobName=myJob --pluginId=my-super-protocol

# Generator a fetcher
npx nx generate @sonarwatch/portfolio-plugins:fetcher --fetcherName=myFetcher --pluginId=my-super-protocol

# Serve cache in background
npx nx run plugins:serve-cache

# Run a job
npx nx run plugins:run-job mango-banks
npx nx run plugins:run-job wallet-tokens-aptos

# Run a fetcher
npx nx run plugins:run-fetcher mango-collateral DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG
npx nx run plugins:run-fetcher marinade-tickets DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG
npx nx run plugins:run-fetcher wallet-tokens-aptos \"0xaa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6\"
npx nx run plugins:run-fetcher wallet-tokens-aptos aa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6
npx nx run plugins:run-fetcher wallet-tokens-ethereum-top \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\"
npx nx run plugins:run-fetcher wallet-tokens-ethereum-top d8dA6BF26964aF9D7eEd9e03E53415D37aA96045
npx nx run plugins:run-fetcher wallet-tokens-solana d8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# Run a airdrop fetcher
npx nx run plugins:run-airdrop-fetcher drift-airdrop-1 DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG

# Run transactions
npx nx run tx-parser:run DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG
npx nx run tx-parser:run-tx DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG 4AN8Fc4u2Grr9Fe9oBQxe8JrWz2FGBf93hvnYufjnXSbSqw7Ascvm6oE4VsojB6kfYv9n1xaygwsExxXp7CzDRsB
```

## Build

```bash
npx nx run core:build
npx nx run plugins:build
npx nx run tx-parser:build
npx nx run webapp:build
```

## Deploy

```bash
npx nx run core:version --releaseAs=patch
npx nx run plugins:version --releaseAs=patch
npx nx run tx-parser:version --releaseAs=patch

npx nx run core:version --releaseAs=minor
npx nx run plugins:version --releaseAs=minor
npx nx run tx-parser:version --releaseAs=minor

npm run nx:version
```
