import {
  NetworkId,
  PortfolioElement,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { Cache } from '../../../Cache';
import { getLpTag } from '../helpers';
import { getTokenAccountsByOwner } from '../../../utils/solana/getTokenAccountsByOwner';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { ElementLiquidityBuilder } from '../../../utils/elementbuilder/ElementLiquidityBuilder';
import { ParsedAccount, TokenAccount } from '../../../utils/solana';
import { TokenYieldMap } from '../../../TokenYieldMap';
import { TokenFetcher } from '../types';
import { getOrcaPositions } from '../../orca/getWhirlpoolPositions';
import { platformId as orcaPlatformId } from '../../orca/constants';
import {
  clmmPid,
  platformId as cropperPlatformId,
} from '../../cropper/constants';
import { getHeliumPositions } from '../../helium/getHeliumPositions';
import { getPicassoPositions } from '../../picasso/getPicassoPositions';
import { getMeteoraCpammPositions } from '../../meteora/cpamm/cpammPositionsFetcher';
import { getRaydiumClmmPositions } from '../../raydium/clmmFetcher';
import { getResizableNfts } from '../../metaplex/resizableNftFetcher';

export const getSolanaTokens =
  (simple?: boolean) =>
  async (tokenAccounts: ParsedAccount<TokenAccount>[], cache: Cache) => {
    const fungibleAddresses = tokenAccounts.map((ta) => ta.mint.toString());

    const tokenPrices = await cache.getTokenPricesAsMap(
      fungibleAddresses,
      NetworkId.solana
    );

    const tokenYields = !simple
      ? await cache.getTokenYieldsAsMap(
          [...tokenPrices.keys()],
          NetworkId.solana
        )
      : new TokenYieldMap(NetworkId.solana);

    const elementRegistry = new ElementRegistry(
      NetworkId.solana,
      walletTokensPlatformId
    );

    const elementTokens = elementRegistry.addElementMultiple({
      label: 'Wallet',
    });
    const elementsLiquidity = new Map<string, ElementLiquidityBuilder>();

    tokenAccounts.forEach((tokenAccount) => {
      const address = tokenAccount.mint.toString();
      const tokenPrice = tokenPrices.get(address);
      if (!tokenPrice) return;

      const tokenYield = tokenYields.get(address);

      const amount = tokenAccount.amount.shiftedBy(-tokenPrice.decimals);

      if (tokenPrice.platformId === walletTokensPlatformId) {
        // it's a regular token
        elementTokens.addAsset({
          address,
          amount,
          alreadyShifted: true,
          ref: tokenAccount.pubkey,
          link: tokenPrice.link,
          sourceRefs: tokenPrice.sourceRefs,
          tokenYield,
        });
      } else if (!simple) {
        // it's an LP Token
        const tag = getLpTag(
          tokenPrice.platformId,
          tokenPrice.elementName,
          tokenPrice.label
        );

        let elementLiquidity = elementsLiquidity.get(tag);
        if (!elementLiquidity) {
          elementLiquidity = elementRegistry.addElementLiquidity({
            name: tokenPrice.elementName,
            label: tokenPrice.label ?? 'LiquidityPool',
            platformId: tokenPrice.platformId,
          });
        }

        const liquidity = elementLiquidity.addLiquidity({
          name: tokenPrice.liquidityName,
        });

        liquidity.addAsset({
          address,
          amount,
          alreadyShifted: true,
          ref: tokenAccount.pubkey,
          link: tokenPrice.link,
          sourceRefs: tokenPrice.sourceRefs,
          tokenYield,
        });

        elementsLiquidity.set(tag, elementLiquidity);
      }
    });

    return elementRegistry.getElements(cache);
  };

const tokensFetchers: TokenFetcher[] = [
  getRaydiumClmmPositions,
  getMeteoraCpammPositions,
  getOrcaPositions(orcaPlatformId),
  getOrcaPositions(cropperPlatformId, clmmPid),
  getHeliumPositions,
  getPicassoPositions,
  getSolanaTokens(false),
  getResizableNfts,
];

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenAccounts = await getTokenAccountsByOwner(owner);

  const results: Promise<PortfolioElement[]>[] = [];
  for (const tokensFetcher of tokensFetchers) {
    results.push(tokensFetcher(tokenAccounts, cache));
  }
  const result = await Promise.allSettled(results);

  return result.flatMap((res) => (res.status === 'rejected' ? [] : res.value));
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
