import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { PortfolioAsset, getUsdValueSum } from '@sonarwatch/portfolio-core';
import { PriceResponse } from './types';
import { lockerPubkey, voteProgramId } from './launchpad/constants';

export function deriveClaimStatus(
  claimant: string,
  merkleTree: string,
  merkleDistributor: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(claimant).toBytes(),
      new PublicKey(merkleTree).toBytes(),
    ],
    new PublicKey(merkleDistributor)
  )[0];
}

export function getVotePda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('Escrow'),
      lockerPubkey.toBytes(),
      new PublicKey(owner).toBytes(),
    ],
    voteProgramId
  )[0];
}

export async function getJupiterPrices(mints: PublicKey[], vsMint: PublicKey) {
  const res = await axios.get<unknown, AxiosResponse<PriceResponse>>(
    'https://price.jup.ag/v4/price',
    {
      params: {
        ids: mints.map((m) => m.toString()).join(','),
        vsToken: vsMint.toString(),
      },
    }
  );
  const prices: Map<string, number> = new Map();
  for (const [, value] of Object.entries(res.data.data)) {
    prices.set(value.id, value.price);
  }
  return prices;
}

export function getMergedAssets(assets: PortfolioAsset[]) {
  const assetByMint: Map<string, PortfolioAsset> = new Map();
  for (const asset of assets) {
    if (asset.type !== 'token') continue;

    const { address } = asset.data;
    const amountToAdd = asset.data.amount;
    const valueToAdd = asset.value;
    const existingAsset = assetByMint.get(address);
    if (!existingAsset) {
      assetByMint.set(address, asset);
    } else {
      existingAsset.data.amount += amountToAdd;
      existingAsset.value = getUsdValueSum([valueToAdd, existingAsset.value]);
      assetByMint.set(address, existingAsset);
    }
  }

  return Array.from(assetByMint.values());
}
