import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { solanaNativeWrappedAddress } from '@sonarwatch/portfolio-core';
import { programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import getAssociatedTokenAddress from '../../utils/solana/getAssociatedTokenAddressSync';

export function creatorVaultPda(creator: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('creator-vault'), creator.toBuffer()],
    programId
  )[0];
}

export function coinCreatorVaultAta(
  coinCreatorVaultAuthority: PublicKey,
  quoteMint: string
) {
  return getAssociatedTokenAddress(
    new PublicKey(quoteMint),
    coinCreatorVaultAuthority
  );
}

export async function getClaimableAmount(
  creator: PublicKey
): Promise<BigNumber> {
  const creatorVault = creatorVaultPda(creator);
  const coinCreatorVault = coinCreatorVaultAta(
    creator,
    solanaNativeWrappedAddress
  );
  const client = getClientSolana();
  const [creatorVaultAccount, coinCreatorVaultAccount] = await Promise.all([
    client.getAccountInfo(creatorVault),
    coinCreatorVault
      ? client.getTokenAccountBalance(coinCreatorVault)
      : undefined,
  ]);

  let creatorVaultAmount = new BigNumber(0);
  let coinVaultAmount = new BigNumber(0);
  if (creatorVaultAccount !== null) {
    const rentExemptionLamports =
      await client.getMinimumBalanceForRentExemption(
        creatorVaultAccount.data.length
      );
    creatorVaultAmount = new BigNumber(creatorVaultAccount.lamports).minus(
      rentExemptionLamports
    );
  }

  if (coinCreatorVaultAccount) {
    coinVaultAmount = new BigNumber(coinCreatorVaultAccount.value.amount);
  }

  return creatorVaultAmount.plus(coinVaultAmount);
}
