import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  Metadata,
  Metaplex,
  Token,
  isNftWithToken,
  isSftWithToken,
} from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletNftsPlatform, walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import { Cache } from '../../../Cache';
import runInBatch from '../../../utils/misc/runInBatch';

const prefix = 'nft-images';
const noImageValue = 'noimage';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);
  const metaplex = new Metaplex(client);

  const outputs = await metaplex.nfts().findAllByOwner({
    owner: ownerPubKey,
  });
  const cachedImages = await cache.getItems<string>(
    outputs.map((o) =>
      o.model === 'metadata'
        ? o.mintAddress.toString()
        : o.mint.address.toString()
    ),
    {
      prefix,
      networkId: NetworkId.solana,
    }
  );
  const images: Map<string, string> = new Map();
  const missings: Metadata[] = [];
  outputs.forEach((o, i) => {
    const cachedImage = cachedImages[i];
    if (cachedImage) {
      const address =
        o.model === 'metadata'
          ? o.mintAddress.toString()
          : o.mint.address.toString();
      images.set(address, cachedImage);
    } else if (o.model === 'metadata') {
      missings.push(o);
    }
  });

  const res = await runInBatch(
    missings.map((o) => () => metaplex.nfts().load({ metadata: o })),
    5
  );

  const promises = res.map((r, i) => {
    const image = r.status !== 'rejected' ? r.value.json?.image : undefined;
    if (r.status === 'rejected' || !image) {
      const address = missings[i].mintAddress.toString();
      return cache.setItem(address, noImageValue, {
        prefix,
        networkId: NetworkId.solana,
      });
    }
    const address = r.value.mint.address.toString();
    images.set(address, image);
    return cache.setItem(address, image, {
      prefix,
      networkId: NetworkId.solana,
    });
  });
  await Promise.allSettled(promises);

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

    let image = images.get(address);
    if (image === noImageValue) image = undefined;

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
        image,
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
