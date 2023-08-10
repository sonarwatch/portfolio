import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  Metaplex,
  Token,
  isNftWithToken,
  isSftWithToken,
} from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletNftsPlatform, walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);
  const metaplex = new Metaplex(client);
  if (!owner) return [];
  const outputs = await metaplex.nfts().findAllByOwner({
    owner: ownerPubKey,
  });
  const assets: PortfolioAssetCollectible[] = outputs.map((output) => {
    const address =
      output.model === 'metadata'
        ? output.mintAddress.toString()
        : output.mint.address.toString();

    const token: Token | null =
      isNftWithToken(output) || isSftWithToken(output) ? output.token : null;

    const amount = token?.amount
      ? new BigNumber(token.amount.basisPoints.toString())
          .div(10 ** token.amount.currency.decimals)
          .toNumber()
      : 1;

    return {
      networkId: NetworkId.solana,
      type: PortfolioAssetType.collectible,
      value: null,
      data: {
        address,
        amount,
        dataUri: output.uri,
        price: null,
        value: null,
        floorPrice: null,
        name: output.name,
        collectionId: output.collection?.address.toString(),
      },
    };
  });
  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId: walletNftsPlatform.id,
    label: 'Wallet',
    value: null,
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana-nfts`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
