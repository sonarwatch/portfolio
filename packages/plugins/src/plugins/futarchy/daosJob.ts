import { PublicKey } from '@solana/web3.js';
import {
  NetworkId,
  TokenPriceSource,
  UniTokenInfo,
  tokenPriceFromSources,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { platformId, daoPid, daoNameById } from './constants';
import {
  Amm,
  ConditionnalVault,
  Dao,
  ProposalState,
  ammStruct,
  conditionnalVaultStruct,
  daoStruct,
  proposalStruct,
} from './structs';
import { shortenAddress } from '../scallop/helpers';
import { getLpTokenSource } from '../../utils/misc/getLpTokenSource';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const daos = await getParsedProgramAccounts(
    client,
    daoStruct,
    daoPid,
    dataSizeFilter(168)
  );

  const daoById: Map<string, ParsedAccount<Dao>> = new Map();
  daos.forEach((dao) => daoById.set(dao.pubkey.toString(), dao));

  const proposals = await getParsedProgramAccounts(
    client,
    proposalStruct,
    daoPid,
    dataSizeFilter(2000)
  );

  const amms: PublicKey[] = [];
  const vaults: PublicKey[] = [];
  proposals.forEach((prop) => {
    amms.push(prop.failAmm, prop.passAmm);
    vaults.push(prop.baseVault, prop.quoteVault);
  });

  const [ammsAccounts, vaultsAccounts] = await Promise.all([
    getParsedMultipleAccountsInfo(client, ammStruct, amms),
    getParsedMultipleAccountsInfo(client, conditionnalVaultStruct, vaults),
  ]);
  const ammById: Map<string, ParsedAccount<Amm>> = new Map();
  const vaultById: Map<string, ConditionnalVault> = new Map();
  const tokensPubkeys: PublicKey[] = [];
  const mintsPubkeys: PublicKey[] = [];
  const underlyingMints: Set<string> = new Set();
  ammsAccounts.forEach((acc) => {
    if (acc) {
      ammById.set(acc.pubkey.toString(), acc);
      mintsPubkeys.push(acc.lpMint);
    }
  });
  vaultsAccounts.forEach((acc) => {
    if (acc) {
      vaultById.set(acc.pubkey.toString(), acc);
      tokensPubkeys.push(acc.underlyingTokenAccount);
      mintsPubkeys.push(
        acc.conditionalOnFinalizeTokenMint,
        acc.conditionalOnRevertTokenMint
      );
      underlyingMints.add(acc.underlyingTokenMint.toString());
    }
  });

  const [tokensAccounts, mintsAccounts, underlyingTokenPriceById] =
    await Promise.all([
      getParsedMultipleAccountsInfo(client, tokenAccountStruct, tokensPubkeys),
      getParsedMultipleAccountsInfo(client, mintAccountStruct, mintsPubkeys),
      await cache.getTokenPricesAsMap(
        Array.from(underlyingMints),
        NetworkId.solana
      ),
    ]);

  const tokenAccountById: Map<string, TokenAccount> = new Map();
  const mintAccountById: Map<string, MintAccount> = new Map();
  const tokensDetailsById: Map<string, UniTokenInfo> = new Map();
  tokensAccounts.forEach((acc) => {
    if (acc) tokenAccountById.set(acc.pubkey.toString(), acc);
  });
  mintsAccounts.forEach((acc) => {
    if (acc) mintAccountById.set(acc.pubkey.toString(), acc);
  });

  const tokenPriceSources: TokenPriceSource[] = [];
  const usdSourceById: Map<string, TokenPriceSource> = new Map();
  for (const proposal of proposals) {
    const [passAmm, failAmm] = [
      ammById.get(proposal.passAmm.toString()),
      ammById.get(proposal.failAmm.toString()),
    ];

    const [quoteVault, baseVault] = [
      vaultById.get(proposal.quoteVault.toString()),
      vaultById.get(proposal.baseVault.toString()),
    ];

    const dao = daoById.get(proposal.dao.toString());

    if (!passAmm || !failAmm || !quoteVault || !baseVault || !dao) continue;

    const daoInfo = daoNameById.get(dao.pubkey.toString());
    if (!daoInfo) continue;

    const { name: daoName, tokenName: daoTokenName } = daoInfo;
    const elementName = `${daoName} Proposal : ${shortenAddress(
      proposal.pubkey.toString()
    )} (${ProposalState[proposal.state]})`;

    const usdReserveAccount = tokenAccountById.get(
      quoteVault.underlyingTokenAccount.toString()
    );
    const [
      usdTokenPrice,
      baseUnderlyingTokenPrice,
      usdUnderlyingTokenDetail,
      baseUnderlyingTokenDetail,
    ] = [
      underlyingTokenPriceById.get(quoteVault.underlyingTokenMint.toString()),
      underlyingTokenPriceById.get(baseVault.underlyingTokenMint.toString()),
      tokensDetailsById.get(quoteVault.underlyingTokenMint.toString()),
      tokensDetailsById.get(baseVault.underlyingTokenMint.toString()),
    ];

    // Price the pUSD and fUSD of this proposal
    if (
      usdReserveAccount &&
      !usdReserveAccount.amount.isZero() &&
      usdTokenPrice
    ) {
      const pUSDMint = quoteVault.conditionalOnFinalizeTokenMint.toString();
      const fUSDMint = quoteVault.conditionalOnRevertTokenMint.toString();

      const underlyingValue = usdReserveAccount.amount
        .times(usdTokenPrice.price)
        .dividedBy(10 ** quoteVault.decimals);

      const [pUSDMintAccount, fUSDMintAccount] = [
        mintAccountById.get(pUSDMint),
        mintAccountById.get(fUSDMint),
      ];
      if (!pUSDMintAccount || !fUSDMintAccount) continue;

      const pUSDPrice = underlyingValue
        .dividedBy(
          pUSDMintAccount.supply.dividedBy(10 ** pUSDMintAccount.decimals)
        )
        .dividedBy(2);
      const fUSDPrice = underlyingValue
        .dividedBy(
          fUSDMintAccount.supply.dividedBy(10 ** fUSDMintAccount.decimals)
        )
        .dividedBy(2);

      const symbol = usdUnderlyingTokenDetail?.symbol;

      const fUSDSource: TokenPriceSource = {
        address: fUSDMint,
        decimals: fUSDMintAccount.decimals,
        id: proposal.quoteVault.toString(),
        networkId: NetworkId.solana,
        platformId,
        price: fUSDPrice.toNumber(),
        timestamp: Date.now(),
        weight: 1,
        underlyings: [
          {
            amountPerLp: 1,
            price: fUSDPrice.toNumber(),
            address: usdTokenPrice.address,
            decimals: usdTokenPrice.decimals,
            networkId: NetworkId.solana,
          },
        ],
        liquidityName: symbol ? `f${symbol}` : 'fUSD',
        elementName,
        sourceRefs: [
          { name: 'Pool', address: proposal.pubkey.toString() },
          { name: 'Vault', address: proposal.quoteVault.toString() },
        ],
      };

      const pUSDSource: TokenPriceSource = {
        address: pUSDMint,
        decimals: pUSDMintAccount.decimals,
        id: proposal.quoteVault.toString(),
        networkId: NetworkId.solana,
        platformId,
        price: pUSDPrice.toNumber(),
        timestamp: Date.now(),
        weight: 1,
        underlyings: [
          {
            amountPerLp: 1,
            price: pUSDPrice.toNumber(),
            address: usdTokenPrice.address,
            decimals: usdTokenPrice.decimals,
            networkId: NetworkId.solana,
          },
        ],
        liquidityName: symbol ? `p${symbol}` : 'pUSD',
        elementName,
        sourceRefs: [
          { name: 'Pool', address: proposal.pubkey.toString() },
          { name: 'Vault', address: proposal.quoteVault.toString() },
        ],
      };
      // If the Proposal has passed, fUSD will not be redeemable (price = 0)
      if (proposal.state === ProposalState.Passed) {
        fUSDSource.price = 0;
        if (fUSDSource.underlyings?.at(0)) fUSDSource.underlyings[0].price = 0;
      }
      // If the Proposal has failed, pUSD will not be redeemable (price = 0)
      if (proposal.state === ProposalState.Failed) {
        pUSDSource.price = 0;
        if (pUSDSource.underlyings?.at(0)) pUSDSource.underlyings[0].price = 0;
      }

      tokenPriceSources.push(pUSDSource, fUSDSource);
      usdSourceById.set(pUSDSource.address, pUSDSource);
      usdSourceById.set(fUSDSource.address, fUSDSource);
    }

    // Price the pToken and fToken of this proposal from the pools composition
    for (const amm of [passAmm, failAmm]) {
      if (amm.baseAmount.isZero()) continue;

      const [lpMint, baseMint, quoteMint] = [
        amm.lpMint.toString(),
        amm.baseMint.toString(),
        amm.quoteMint.toString(),
      ];

      const [quoteSource, lpMintAccount] = [
        usdSourceById.get(quoteMint),
        mintAccountById.get(lpMint),
      ];

      if (
        !quoteSource ||
        !lpMintAccount ||
        !baseUnderlyingTokenPrice ||
        !baseUnderlyingTokenDetail
      )
        continue;

      const isPassAmm = amm.pubkey.toString() === proposal.passAmm.toString();
      const liquidityName = isPassAmm ? 'Pass LP' : 'Fail LP';
      const baseLiquidityName = isPassAmm
        ? `p${daoTokenName}`
        : `f${daoTokenName}`;

      const basePrice = amm.quoteAmount
        .dividedBy(10 ** amm.quoteMintDecimals)
        .dividedBy(amm.baseAmount.dividedBy(10 ** amm.baseMintDecimals))
        .toNumber();

      const baseTokenPriceSource: TokenPriceSource = {
        address: baseMint,
        decimals: amm.baseMintDecimals,
        weight: 1,
        price: basePrice,
        id: platformId,
        networkId: NetworkId.solana,
        platformId,
        timestamp: Date.now(),
        underlyings: [{ ...baseUnderlyingTokenPrice, amountPerLp: 1 }],
        liquidityName: baseLiquidityName,
        elementName,
        sourceRefs: [{ name: 'Pool', address: amm.pubkey.toString() }],
      };

      // If it's the amm handling the Pass LP and the Proposal has failed, pToken will not be redeemable (price = 0)
      // If it's the amm handling the Fail LP and the Proposal has passed, fToken will not be redeemable (price = 0)
      if (
        (proposal.state === ProposalState.Failed && isPassAmm) ||
        (proposal.state === ProposalState.Passed && !isPassAmm)
      ) {
        baseTokenPriceSource.price = 0;
        if (baseTokenPriceSource.underlyings?.at(0))
          baseTokenPriceSource.underlyings[0].price = 0;
      }

      const baseTokenPrice = tokenPriceFromSources([baseTokenPriceSource]);
      const quotePrice = tokenPriceFromSources([quoteSource]);
      if (!baseTokenPrice) continue;

      const lpSource = getLpTokenSource({
        lpDetails: {
          address: lpMint,
          decimals: lpMintAccount.decimals,
          supply: lpMintAccount.supply
            .dividedBy(10 ** lpMintAccount.decimals)
            .toNumber(),
        },
        networkId: NetworkId.solana,
        platformId,
        poolUnderlyings: [
          {
            address: baseUnderlyingTokenPrice.address,
            decimals: amm.baseMintDecimals,
            reserveAmount: amm.baseAmount
              .dividedBy(10 ** amm.baseMintDecimals)
              .toNumber(),
            weight: 0.5,
            tokenPrice: baseTokenPrice,
          },
          {
            address: usdTokenPrice ? usdTokenPrice.address : quoteMint,
            decimals: amm.quoteMintDecimals,
            reserveAmount: amm.quoteAmount
              .dividedBy(10 ** amm.quoteMintDecimals)
              .toNumber(),
            weight: 0.5,
            tokenPrice: quotePrice,
          },
        ],
        sourceId: platformId,
        liquidityName,
        elementName,
      });

      if (lpSource.at(0)) {
        // If it's the amm handling the Pass LP and the Proposal has failed, Pass LP will not be redeemable (price = 0)
        // If it's the amm handling the Fail LP and the Proposal has passed, Fail LP will not be redeemable (price = 0)
        if (
          (proposal.state === ProposalState.Failed && isPassAmm) ||
          (proposal.state === ProposalState.Passed && !isPassAmm)
        )
          lpSource[0].price = 0;
      }
      tokenPriceSources.push(...lpSource, baseTokenPriceSource);
    }
  }
  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-daos`,
  executor,
  labels: ['normal'],
};
export default job;
