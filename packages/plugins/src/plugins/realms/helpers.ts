import {
  FindNftsByOwnerOutput,
  Metadata,
  Metaplex,
  Nft,
  Sft,
  isMetadata,
} from '@metaplex-foundation/js';
import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { getClientSolana } from '../../utils/clients';
import { Attributes, NftVoterMetadata } from './types';
import { LockupKind } from './structs/realms';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { platformId } from './constants';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';

export const votingEscrowIdentifier = 'Voting Escrow Token Position';

export function isAVotingEscrowPosition(nft: Metadata | Nft | Sft): boolean {
  return nft && nft.name === votingEscrowIdentifier;
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

export async function getPositionFromVotingEscrowNFT(
  cache: Cache,
  nfts: FindNftsByOwnerOutput
): Promise<PortfolioElement[]> {
  const client = getClientSolana();
  const metaplex = new Metaplex(client);
  const assets: PortfolioAsset[] = [];
  const amountByMint: Map<string, BigNumber> = new Map();
  for (const nft of nfts) {
    if (isMetadata(nft)) {
      const metadata = await metaplex.nfts().load({ metadata: nft });
      if (!metadata.json) continue;

      const { attributes } = metadata.json;
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
  }

  const mints = Array.from(amountByMint.keys());
  const tokenPriceById = await getTokenPricesMap(
    mints,
    NetworkId.solana,
    cache
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
      platformId,
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
  items: Attributes | undefined
): undefined | NftVoterMetadata {
  if (!items || items.length < 10) return undefined;

  const registrar = items[0].value;
  const amountDepositedNative = items[1].value;
  const amountDeposited = items[2].value;
  const votingMintConfigIdx = items[3].value;
  const votingMint = items[4].value;
  const startTs = items[5].value;
  const endTs = items[6].value;
  const kind = items[7].value;
  const genesisEnd = items[8].value;
  const numActiveVotes = items[9].value;

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
      votingMintConfigIdx: Number(votingMintConfigIdx),
      votingMint,
      startTs: new BigNumber(startTs),
      endTs: new BigNumber(endTs),
      kind,
      genesisEnd,
      numActiveVotes: Number(numActiveVotes),
    };
  }
  return undefined;
}
