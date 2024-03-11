import { Metaplex, Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { tensorPid } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { singleListingStruct } from './struct';
import { singleListingFilter } from './filters';

export default async function getTensorSingleListings(
  owner: string
): Promise<(Metadata | Nft | Sft)[]> {
  const connection = getClientSolana();
  const metaplex = new Metaplex(connection);
  const singleListings = await getParsedProgramAccounts(
    connection,
    singleListingStruct,
    tensorPid,
    singleListingFilter(owner)
  );
  if (singleListings.length === 0) return [];

  const mints = singleListings.map((listing) => listing.nftMint);

  const nftsMetadata = await metaplex.nfts().findAllByMintList({
    mints,
  });
  if (!nftsMetadata) return [];
  return nftsMetadata.map((nft) => nft || []).flat();
}
