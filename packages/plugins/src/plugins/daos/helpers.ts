import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { LockupKind } from './structs/realms';
import { heliumPlatformId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { positionDataStruct } from '../helium/structs';
import { stakeRegistryId } from '../helium/constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

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
  const accounts = (
    await Promise.all(
      nfts.map((nft) =>
        ParsedGpa.build(getClientSolana(), positionDataStruct, stakeRegistryId)
          .addFilter(
            'accountDiscriminator',
            [152, 131, 154, 46, 158, 42, 31, 233]
          )
          .addFilter('mint', new PublicKey(nft.data.address))
          .run()
      )
    )
  ).flat();

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    heliumPlatformId
  );

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: account.pubkey,
      link: `https://heliumvote.com/hnt/positions/${account.pubkey}`,
      sourceRefs: [{ name: 'Vault', address: account.registrar.toString() }],
    });

    const lockedUntil = getLockedUntil(
      account.lockup.startTs,
      account.lockup.endTs,
      account.lockup.kind
    );

    element.addAsset({
      address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
      amount: account.amountDepositedNative,
      attributes: {
        lockedUntil,
      },
    });
  });

  return elementRegistry.getElements(cache);
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
