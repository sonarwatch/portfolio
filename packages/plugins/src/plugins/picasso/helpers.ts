import { PublicKey } from '@solana/web3.js';
import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, restakingProgramId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { vaultStruct } from './structs';

export const getPositionPublicKey = (ei: PublicKey) => {
  const [vaultParamsPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault_params', 'utf-8'), ei.toBuffer()],
    restakingProgramId
  );
  return vaultParamsPDA;
};

export const isPicassoPosition = (asset: PortfolioAssetCollectible): boolean =>
  asset.name === 'Composable Restaking Position';

export async function getPicassoElementsFromNFTs(
  cache: Cache,
  nfts: PortfolioAssetCollectible[]
): Promise<PortfolioElement[]> {
  const connection = getClientSolana();

  const vaults = await getParsedMultipleAccountsInfo(
    connection,
    vaultStruct,
    nfts.map((asset) => getPositionPublicKey(new PublicKey(asset.data.address)))
  );

  const heliusAssetsPositions = nfts.filter((item, i) => vaults[i]);

  if (heliusAssetsPositions.length === 0) return [];

  const tokenMints = [
    ...new Set(
      heliusAssetsPositions
        .map((item, i) => vaults[i]?.stakeMint.toString())
        .flat()
    ),
  ].filter((s) => s !== null) as string[];

  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenMints,
    NetworkId.solana
  );

  const assets: PortfolioAssetToken[] = [];

  heliusAssetsPositions.forEach((item, i) => {
    const vault = vaults[i];
    if (vault) {
      const tokenPrice = tokenPrices.get(vault.stakeMint.toString());
      if (!tokenPrice) return;
      assets.push(
        tokenPriceToAssetToken(
          vault.stakeMint.toString(),
          new BigNumber(vault.stakeAmount)
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    }
  });

  if (assets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
}
