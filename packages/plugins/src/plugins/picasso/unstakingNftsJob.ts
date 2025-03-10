import {
  NetworkId,
  PortfolioAssetCollectible,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  unstakingNftsCachePrefix,
  platformId,
  unstakingOwner,
  unstakingNftsCacheKey,
  restakingIdlItem,
} from './constants';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { DisplayOptions } from '../../utils/solana/das/types';
import { getAssetsByOwnerDas } from '../../utils/solana/das/getAssetsByOwnerDas';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { Vault } from './types';
import { getPositionPublicKey, isPicassoPosition } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const dasEndpoint = getSolanaDasEndpoint();
  const displayOptions: DisplayOptions = {
    showCollectionMetadata: true,
    showUnverifiedCollections: true,
    showInscription: false,
    showNativeBalance: false,
    showGrandTotal: false,
    showFungible: true,
  };
  const assets = await getAssetsByOwnerDas(
    dasEndpoint,
    unstakingOwner,
    displayOptions
  );

  const nfts: PortfolioAssetCollectible[] = [];
  for (let n = 0; n < assets.length; n += 1) {
    const nft = heliusAssetToAssetCollectible(assets[n]);
    if (!nft) continue;
    if (nft.attributes.tags?.includes('compressed')) continue;
    if (!isPicassoPosition(nft)) continue;
    nfts.push(nft);
  }

  const connection = getClientSolana();

  const vaults = await getAutoParsedMultipleAccountsInfo<Vault>(
    connection,
    restakingIdlItem,
    nfts.map((asset) => getPositionPublicKey(new PublicKey(asset.data.address)))
  ).then((vs) => vs.filter((v) => v !== null));

  await cache.setItem(unstakingNftsCacheKey, vaults, {
    prefix: unstakingNftsCachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-unstaking-nfts`,
  executor,
  labels: ['normal'],
};
export default job;
