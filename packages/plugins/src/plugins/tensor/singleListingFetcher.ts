import { Metaplex, Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { tensorProgram } from './constants';
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
    tensorProgram,
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

// const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
//   const connection = getClientSolana();
//   const metaplex = new Metaplex(connection);
//   const singleListings = await getParsedProgramAccounts(
//     connection,
//     singleListingStruct,
//     tensorProgram,
//     singleListingFilter(owner)
//   );
//   if (singleListings.length === 0) return [];

//   const mints = singleListings.map((listing) => listing.nftMint);

//   const nftsMetadata = await metaplex.nfts().findAllByMintList({
//     mints,
//   });
//   if (!nftsMetadata) return [];

//   const promises = nftsMetadata.map((nftMetadata) => {
//     if (!nftMetadata?.uri) return undefined;
//     return getImagefromUri(nftMetadata?.uri, NetworkId.solana, cache);
//   });

//   const imageResults = await Promise.allSettled(promises);
//   const assets: PortfolioAsset[] = [];

//   nftsMetadata.forEach((nftMetadata, i) => {
//     if (!nftMetadata) return;
//     const imageResult = imageResults[i];
//     const image =
//       imageResult.status === 'fulfilled' ? imageResult.value : undefined;

//     const address =
//       nftMetadata.model === 'metadata'
//         ? nftMetadata.mintAddress.toString()
//         : nftMetadata.mint.address.toString();

//     const token: Token | null =
//       isNftWithToken(nftMetadata) || isSftWithToken(nftMetadata)
//         ? nftMetadata.token
//         : null;
//     const amount = token?.amount
//       ? new BigNumber(token.amount.basisPoints.toString())
//           .div(10 ** token.amount.currency.decimals)
//           .toNumber()
//       : 1;
//     const collection = nftMetadata.collection
//       ? {
//           floorPrice: null,
//           id: nftMetadata.collection.address.toString(),
//         }
//       : undefined;
//     const asset: PortfolioAsset = {
//       type: PortfolioAssetType.collectible,
//       networkId: NetworkId.solana,
//       value: null,
//       data: {
//         address,
//         amount,
//         price: null,
//         name: nftMetadata.name,
//         dataUri: nftMetadata.uri,
//         imageUri: image,
//         collection,
//       },
//     };
//     assets.push(asset);
//   });

//   if (assets.length === 0) return [];

//   const element: PortfolioElementMultiple = {
//     type: PortfolioElementType.multiple,
//     networkId: NetworkId.solana,
//     platformId,
//     label: 'Wallet',
//     value: null,
//     data: {
//       assets,
//     },
//   };
//   return [element];
// };

// const fetcher: Fetcher = {
//   id: `${platformId}-linsting`,
//   networkId: NetworkId.solana,
//   executor,
// };
