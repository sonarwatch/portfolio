import {
  CollectibleAttribute,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { HeliumNftVoterMetadata } from './types';
import { LockupKind } from './structs/realms';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { heliumPlatformId } from './constants';

export const nftIdentifier = 'Voting Escrow Token Position';

export function isAnHeliumNFTVote(nft: PortfolioAssetCollectible): boolean {
  return nft.name === nftIdentifier;
}

export function getVoterPda(
  owner: string,
  registrar: string,
  vsr: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      new PublicKey(registrar).toBuffer(),
      Buffer.from('voter', 'utf-8'),
      new PublicKey(owner).toBuffer(),
    ],
    new PublicKey(vsr)
  )[0];
}

export async function getHeliumElementsFromNFTs(
  cache: Cache,
  nfts: PortfolioAssetCollectible[]
): Promise<PortfolioElement[]> {
  const assets: PortfolioAsset[] = [];
  const amountByMint: Map<string, BigNumber> = new Map();
  for (const nft of nfts) {
    const { attributes } = nft.data;
    if (!attributes) continue;

    const votersValues = getNftValues(attributes);
    if (votersValues && !votersValues.amountDepositedNative.isZero()) {
      const existingAmount = amountByMint.get(votersValues.votingMint);
      if (existingAmount) {
        amountByMint.set(
          votersValues.votingMint,
          existingAmount.plus(votersValues.amountDepositedNative)
        );
      } else {
        amountByMint.set(
          votersValues.votingMint,
          votersValues.amountDepositedNative
        );
      }
    }
  }

  const mints = Array.from(amountByMint.keys());
  const tokenPriceById = await cache.getTokenPricesAsMap(
    mints,
    NetworkId.solana
  );

  for (const mint of mints) {
    const amount = amountByMint.get(mint);
    if (amount) {
      const tokenPrice = tokenPriceById.get(mint);
      if (tokenPrice)
        assets.push(
          tokenPriceToAssetToken(
            mint,
            amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
            NetworkId.solana,
            tokenPrice
          )
        );
    }
  }
  if (assets.length === 0) return [];
  return [
    {
      networkId: NetworkId.solana,
      platformId: heliumPlatformId,
      type: 'multiple',
      label: 'Deposit',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
}

export function getLockedUntil(
  startTs: BigNumber,
  endTs: BigNumber,
  lockupKind: LockupKind
): number | undefined {
  let lockedUntil;
  if (lockupKind === LockupKind.Constant) {
    lockedUntil = endTs.minus(startTs).times(1000).plus(Date.now()).toNumber();
  } else if (
    lockupKind === LockupKind.Cliff ||
    lockupKind === LockupKind.Monthly ||
    lockupKind === LockupKind.Daily
  ) {
    lockedUntil = endTs.times(1000).toNumber();
  }
  return lockedUntil;
}

function getNftValues(
  items: CollectibleAttribute[] | undefined
): undefined | HeliumNftVoterMetadata {
  if (!items || items.length < 10) return undefined;

  const registrar = items[0].value as string;
  const amountDepositedNative = items[1].value as string;
  const amountDeposited = items[2].value as string;
  const votingMintConfigIdx = items[3].value as number;
  const votingMint = items[4].value as string;
  const startTs = items[5].value as string;
  const endTs = items[6].value as string;
  const kind = items[7].value as string;
  const genesisEnd = items[8].value as string;
  const numActiveVotes = items[9].value as number;

  if (
    registrar !== undefined &&
    amountDepositedNative !== undefined &&
    amountDeposited !== undefined &&
    votingMintConfigIdx !== undefined &&
    votingMint !== undefined &&
    startTs !== undefined &&
    endTs !== undefined &&
    kind !== undefined &&
    genesisEnd !== undefined &&
    numActiveVotes !== undefined
  ) {
    return {
      registrar,
      amountDeposited: new BigNumber(amountDeposited),
      amountDepositedNative: new BigNumber(amountDepositedNative),
      votingMintConfigIdx,
      votingMint,
      startTs: new BigNumber(startTs),
      endTs: new BigNumber(endTs),
      kind,
      genesisEnd,
      numActiveVotes: Number(numActiveVotes),
    } as HeliumNftVoterMetadata;
  }
  return undefined;
}
