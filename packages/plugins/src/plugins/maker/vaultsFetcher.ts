import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementBorrowLend,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
  zeroAddressEvm,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cdpManagerAddress,
  daiAddress,
  daiDecimals,
  ilksPrefix,
  platformId,
  proxyRegAddress,
  vatAddress,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { cdpManagerAbi, proxyRegAbi, vatAbi } from './abis';
import { IlkData } from './type';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { zeroBigInt } from '../../utils/misc/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // Get the user's proxy address
  const client = getEvmClient(NetworkId.ethereum);

  // WARNING: intadapp removed because it use an old version of web3 that cause process.exit
  // const instadappDSA = getDSA(NetworkId.ethereum);
  // const instadappAccounts = await instadappDSA.getAccounts(owner);

  const ownerProxyRes = await client.readContract({
    abi: proxyRegAbi,
    address: proxyRegAddress,
    functionName: 'proxies',
    args: [owner as `0x${string}`],
  });

  // const proxyAddresses = [owner, ...instadappAccounts.map((a) => a.address)];
  const proxyAddresses = [owner];
  if (ownerProxyRes !== zeroAddressEvm) proxyAddresses.push(ownerProxyRes);
  if (proxyAddresses.length === 0) return [];

  const cdps: bigint[] = [];
  const firstResults = await client.multicall({
    contracts: proxyAddresses.map((address) => ({
      abi: cdpManagerAbi,
      address: cdpManagerAddress,
      functionName: 'first',
      args: [address as `0x${string}`],
    })),
  });
  let nexts: bigint[] = [];
  let step = 0;
  firstResults.forEach((firstResult) => {
    if (!firstResult.result || firstResult.result === zeroBigInt) return;
    nexts.push(firstResult.result);
    cdps.push(firstResult.result);
  });
  while (nexts.length !== 0 || step < 50) {
    step += 1;
    const listResults = await client.multicall({
      contracts: nexts.map((cdp) => ({
        abi: cdpManagerAbi,
        address: cdpManagerAddress,
        functionName: 'list',
        args: [cdp],
      })),
    });
    nexts = [];
    for (let i = 0; i < listResults.length; i++) {
      const listResult = listResults[i];
      if (!listResult.result || listResult.result[1] === zeroBigInt) continue;
      nexts.push(listResult.result[1]);
      cdps.push(listResult.result[1]);
    }
  }
  if (cdps.length === 0) return [];

  const urnsResults = await client.multicall({
    contracts: cdps.map((cdp) => ({
      abi: cdpManagerAbi,
      address: cdpManagerAddress,
      functionName: 'urns',
      args: [cdp],
    })),
  });

  const urnsAddresses = urnsResults.reduce(
    (acc: `0x${string}`[], urnsResult) => {
      if (!urnsResult.result) return acc;
      acc.push(urnsResult.result);
      return acc;
    },
    []
  );

  const ilks = await cache.getItem<IlkData[]>(ilksPrefix, {
    networkId: NetworkId.ethereum,
    prefix: ilksPrefix,
  });
  if (!ilks) return [];
  const argssByMcd = urnsAddresses.map((urnsAddress) =>
    ilks.map((ilk) => [ilk.id, urnsAddress] as const)
  );

  const elements: PortfolioElementBorrowLend[] = [];
  const daiTokenPrice = await cache.getTokenPrice(
    daiAddress,
    NetworkId.ethereum
  );
  for (let i = 0; i < argssByMcd.length; i++) {
    const argss = argssByMcd[i];
    const inkAndArtResults = await client.multicall({
      contracts: argss.map((args) => ({
        abi: vatAbi,
        address: vatAddress,
        functionName: 'urns',
        args,
      })),
    });

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    for (let j = 0; j < inkAndArtResults.length; j++) {
      const inkAndArtResult = inkAndArtResults[j];
      if (inkAndArtResult.status === 'failure') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ink = (inkAndArtResult.result as any)[0] as bigint;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const art = (inkAndArtResult.result as any)[1] as bigint;
      const ilk = ilks.at(j);
      if (!ilk) continue;

      // Supplied
      if (ink !== zeroBigInt) {
        const amount = new BigNumber(ink.toString()).div(10 ** 18).toNumber();
        const asset = tokenPriceToAssetToken(
          ilk.gem,
          amount,
          NetworkId.ethereum,
          ilk.gemTokenPrice
        );
        suppliedAssets.push(asset);
        suppliedYields.push([]);
      }

      // Borrowed
      if (art !== zeroBigInt) {
        const amount = new BigNumber(art.toString())
          .times(new BigNumber(ilk.rate))
          .div(10 ** 27)
          .div(10 ** daiDecimals)
          .toNumber();
        const asset = tokenPriceToAssetToken(
          daiAddress,
          amount,
          NetworkId.ethereum,
          daiTokenPrice
        );
        borrowedAssets.push(asset);
        borrowedYields.push([]);
      }
    }

    if (
      borrowedAssets.length === 0 &&
      suppliedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      continue;
    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
