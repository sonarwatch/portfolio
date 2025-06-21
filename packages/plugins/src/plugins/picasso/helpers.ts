import { PublicKey } from '@solana/web3.js';
import { PortfolioAssetCollectible } from '@sonarwatch/portfolio-core';
import { nftIdentifier, restakingProgramId } from './constants';

export const getPositionPublicKey = (ei: PublicKey) => {
  const [vaultParamsPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault_params', 'utf-8'), ei.toBuffer()],
    restakingProgramId
  );
  return vaultParamsPDA;
};

export const isPicassoPosition = (asset: PortfolioAssetCollectible): boolean =>
  asset.name === nftIdentifier;
