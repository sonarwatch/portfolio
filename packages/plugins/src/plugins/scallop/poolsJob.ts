// import { NetworkId } from '@sonarwatch/portfolio-core';
// import { parseStructTag } from '@mysten/sui/utils';
// import { CoinMetadata } from '@mysten/sui/client';
// import { Cache } from '../../Cache';
// import { Job, JobExecutor } from '../../Job';
// import {
//   addressKey,
//   addressPrefix,
//   poolsKey,
//   poolsPrefix as prefix,
// } from './constants';
// import {
//   AddressInfo,
//   Coin,
//   MetadataFields,
//   PoolCoinNames,
//   Pools,
//   suiBridgeCoinTypeToSymbolMap,
//   wormholeCoinTypeToSymbolMap,
// } from './types';
// import { getClientSui } from '../../utils/clients';
// import { queryMultipleObjects } from './util';
// import { ObjectData, ObjectResponse, ParsedData } from '../../utils/sui/types';

// const executor: JobExecutor = async (cache: Cache) => {
//   const addressCache = await cache.getItem<AddressInfo>(addressKey, {
//     prefix: addressPrefix,
//     networkId: NetworkId.sui,
//   });

//   if (!addressCache) return;

//   const coinTypes: Partial<Pools> = {};
//   const coins = new Map<string, Coin>(
//     Object.entries(addressCache.mainnet.core.coins)
//   );

//   const coinNames: PoolCoinNames[] = Array.from(
//     coins.keys()
//   ) as PoolCoinNames[];

//   const client = getClientSui();
//   const metadataObjects = (
//     await queryMultipleObjects(
//       client,
//       Array.from(coins.values()).map((coin) => coin.metaData)
//     )
//   )
//     .filter(
//       (
//         t
//       ): t is ObjectResponse<MetadataFields> & {
//         data: ObjectData<MetadataFields> & {
//           content: ParsedData<MetadataFields>;
//         };
//       } =>
//         !!t.data &&
//         !!t.data.content &&
//         t.data.content.dataType === 'moveObject' &&
//         !!t.data.content.fields
//     )
//     .map((objData) => ({
//       metadata: {
//         ...objData.data.content.fields,
//         iconUrl: objData.data.content.fields.icon_url,
//       },
//       type: (() => {
//         const { address, module, name } = parseStructTag(objData.data.type)
//           .typeParams[0] as { address: string; name: string; module: string };
//         return `${address}::${module}::${name}`;
//       })(),
//     })) as {
//     metadata: CoinMetadata;
//     type: string;
//   }[];

//   for (let i = 0; i < coinNames.length; i++) {
//     const coinName = coinNames[i];
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     const {
//       metadata: { decimals, description, iconUrl, name, symbol },
//       type: coinType,
//     } = metadataObjects[i];
//     const detail = coins.get(coinName);
//     if (!detail) continue;

//     coinTypes[coinName] = {
//       coinType,
//       metadata: {
//         decimals,
//         description,
//         iconUrl,
//         name,
//         symbol:
//           wormholeCoinTypeToSymbolMap[coinType] ??
//           suiBridgeCoinTypeToSymbolMap[coinType] ??
//           symbol,
//       },
//     };
//   }

//   await cache.setItem(poolsKey, coinTypes, {
//     prefix,
//     networkId: NetworkId.sui,
//   });
// };

// const job: Job = {
//   id: prefix,
//   executor,
//   label: 'normal',
// };
// export default job;
