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
import { getClientSolana } from '../../../utils/clients';
import { getByrealClmmPositions } from '../../byreal/constants';

export const getSolanaTokens =
  (simple?: boolean) =>
  async (tokenAccounts: ParsedAccount<TokenAccount>[], cache: Cache) => {
    const fungibleAddresses = tokenAccounts.map((ta) => ta.mint.toString());

    const tokenPrices = await cache.getTokenPricesAsMap(
      fungibleAddresses,
      NetworkId.solana
    );

    /* const missingMints = tokenAccounts.flatMap((tokenAccount) => {
      const address = tokenAccount.mint.toString();
      const tokenPrice = tokenPrices.get(address);
      if (!tokenPrice) {
        return [new PublicKey(address)];
      }
      return [];
    });
    const missingPrices = await getJupiterPrices(missingMints); */

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
      // const missingPrice = missingPrices.get(address);

      if (tokenPrice) {
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
            link: tokenPrice.link,
            ref: tokenAccount.pubkey,
            sourceRefs: tokenPrice.sourceRefs,
          });

          liquidity.addAsset({
            address,
            amount,
            alreadyShifted: true,
          });

          elementsLiquidity.set(tag, elementLiquidity);
        }
      } /* else if (missingPrice) {
        if (missingPrice.usdPrice) {
          elementTokens.addPricedAsset({
            address,
            amount: tokenAccount.amount.shiftedBy(-missingPrice.decimals),
            price: missingPrice.usdPrice,
            ref: tokenAccount.pubkey,
          });
        }
      } */
    });

    return elementRegistry.getElements(cache);
  };

const tokensFetchers: TokenFetcher[] = [
  getRaydiumClmmPositions(),
  getByrealClmmPositions,
  getMeteoraCpammPositions,
  getOrcaPositions(orcaPlatformId),
  getOrcaPositions(cropperPlatformId, clmmPid),
  getHeliumPositions,
  getPicassoPositions,
  getSolanaTokens(false),
  getResizableNfts,
];

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenAccounts = await getTokenAccountsByOwner(getClientSolana(), owner);

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
