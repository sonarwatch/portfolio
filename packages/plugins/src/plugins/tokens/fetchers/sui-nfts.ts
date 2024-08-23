import {
  CollectibleAttribute,
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { walletNftsPlatform } from '../constants';
import { obKioskStructType } from '../../../utils/sui/constants';
import { getOwnedObjects } from '../../../utils/sui/getOwnedObjects';
import { ParsedData } from '../../../utils/sui/types';
import { NftDisplayData, NftStruct } from '../../../utils/sui/structs/nft';
import { KioskStruct } from '../../../utils/sui/structs/kiosk';
import { getDynamicFields } from '../../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../../utils/sui/multiGetObjects';

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const ownedObjects = await getOwnedObjects(client, owner, {
    options: {
      showDisplay: true,
    },
  });
  if (ownedObjects.length === 0) return [];
  const nftObjects = [...ownedObjects.filter((o) => o.data?.display?.data)];

  const obKioskObject = ownedObjects.find(
    (o) => o.data?.type === obKioskStructType
  );
  if (obKioskObject) {
    const kioskDynamicObjects = await getDynamicFields(
      client,
      (obKioskObject?.data?.content as ParsedData<KioskStruct>).fields.kiosk,
      true
    );
    const ownerKioskObjects = await multiGetObjects(
      client,
      kioskDynamicObjects.map((o) => o.objectId)
    );
    nftObjects.push(...ownerKioskObjects);
  }

  // TODO add Kiosk objects
  const assets: PortfolioAssetCollectible[] = [];
  nftObjects.forEach((object) => {
    if (!object.data) return;
    if (object.data.type === obKioskObject) return;

    const display: NftDisplayData | null | undefined =
      object.data.display?.data;
    const content = object.data.content as ParsedData<NftStruct>;

    let attributes: CollectibleAttribute[] | undefined;
    if (content.fields.attributes?.fields.map.fields.contents) {
      attributes = content.fields.attributes?.fields.map.fields.contents.map(
        (c) => ({
          trait_type: c.fields.key,
          value: c.fields.value,
        })
      );
    }

    assets.push({
      networkId: NetworkId.sui,
      type: PortfolioAssetType.collectible,
      value: null,
      attributes: {},
      name: display?.name || content.fields.name || content.fields.tick,
      data: {
        address: object.data.type,
        amount: Number(content.fields.amount || 1),
        price: null,
        description: display?.description || content.fields.description,
        imageUri: display?.image_url || content.fields.url,
        name: display?.name || content.fields.name || content.fields.tick,
        attributes,
      },
    });
  });

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.sui,
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
  id: `${walletNftsPlatform.id}-${NetworkId.sui}`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
