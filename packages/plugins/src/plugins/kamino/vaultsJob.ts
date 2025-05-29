import {
  NetworkId,
  TokenPriceSource,
  TokenYield,
  yieldFromApr,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { platformId, vaultProgramId, reservesMemo } from './constants';
import { u8ArrayToString } from '../../utils/solana';

import { vaultStateStruct } from './structs/vaults';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const accounts = await ParsedGpa.build(
    client,
    vaultStateStruct,
    vaultProgramId
  )
    .addFilter('accountDiscriminator', [228, 196, 82, 165, 98, 210, 235, 152])
    .run();

  if (!accounts.length) throw new Error('No Vaults accounts found');

  const [reserves, tokenPrices] = await Promise.all([
    reservesMemo.getItem(cache),
    cache.getTokenPricesAsMap(
      accounts.map((account) => account.tokenMint.toString()),
      NetworkId.solana
    ),
  ]);

  const tokenPriceSources: TokenPriceSource[] = [];
  const tokenYields: TokenYield[] = [];

  accounts.forEach((account) => {
    const tokenMintPrice = tokenPrices.get(account.tokenMint.toString());
    if (!tokenMintPrice) return;

    let investedInReserve = new BigNumber(0);
    let totalAPR = new BigNumber(0);
    let totalWeights = new BigNumber(0);

    account.vaultAllocationStrategy.forEach((allocationStrategy) => {
      if (
        allocationStrategy.reserve.toString() ===
        '11111111111111111111111111111111'
      )
        return;
      const reserve = reserves[allocationStrategy.reserve.toString()];
      if (!reserve) return;

      const reserveAllocationLiquidityAmount =
        allocationStrategy.ctokenAllocation.div(reserve.exchangeRate);
      investedInReserve = investedInReserve.plus(
        reserveAllocationLiquidityAmount
      );

      const reserveAPR = reserve.supplyApr;
      const weight = allocationStrategy.targetAllocationWeight;
      const weightedAPR = new BigNumber(reserveAPR).multipliedBy(weight);
      totalAPR = totalAPR.plus(weightedAPR);
      totalWeights = totalWeights.plus(weight);
    });

    const shares = account.sharesIssued.shiftedBy(-account.sharesMintDecimals);
    const totalAvailable = account.tokenAvailable.shiftedBy(
      -account.tokenMintDecimals
    );
    const totalInvested = investedInReserve.shiftedBy(
      -account.tokenMintDecimals
    );
    const pendingFees = account.pendingFeesSf.shiftedBy(
      -account.tokenMintDecimals
    );

    const totalAUMIncludingFees = totalAvailable.plus(totalInvested);
    const netAUM = totalAUMIncludingFees.minus(pendingFees);
    const perShare = netAUM.div(shares);

    const tokenPriceSource: TokenPriceSource = {
      id: account.pubkey.toString(),
      weight: 1,
      address: account.sharesMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: account.sharesMintDecimals.toNumber(),
      price: perShare.multipliedBy(tokenMintPrice.price).toNumber(),
      timestamp: Date.now(),
      sourceRefs: [
        {
          name: 'Vault',
          address: account.pubkey.toString(),
        },
      ],
      elementName: u8ArrayToString(account.name),
    };

    const grossAPR = totalAPR.div(totalWeights);
    const netAPR = grossAPR
      .multipliedBy(
        new BigNumber(1).minus(
          new BigNumber(account.performanceFeeBps.toString()).div(10_000)
        )
      )
      .multipliedBy(
        new BigNumber(1).minus(
          new BigNumber(account.managementFeeBps.toString()).div(10_000)
        )
      );

    tokenPriceSources.push(tokenPriceSource);

    tokenYields.push({
      address: account.sharesMint.toString(),
      networkId: NetworkId.solana,
      yield: yieldFromApr(netAPR.toNumber()),
      timestamp: Date.now(),
    });
  });

  await cache.setTokenPriceSources(tokenPriceSources);
  await cache.setTokenYields(tokenYields);
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
