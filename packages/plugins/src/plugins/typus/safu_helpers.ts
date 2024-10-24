import { Share, TypusBidReceipt, Vault } from './safu_types';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '../../utils/clients/types';
import {
  frameworkPackage,
  vaultsIndexes,
  safuPackage,
  safuRegistryId,
} from './constants';
import { bcs } from '@mysten/sui/bcs';
import { BcsReader } from '@mysten/bcs';

const SENDER =
  '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export async function getVaultData(
  provider: SuiClient
): Promise<{ [key: string]: [Vault, TypusBidReceipt | null] }> {
  let transaction = new Transaction();
  transaction.moveCall({
    target: `${safuPackage}::view_function::get_vault_data_bcs`,
    typeArguments: [`${frameworkPackage}::vault::TypusBidReceipt`],
    arguments: [
      transaction.object(safuRegistryId),
      transaction.pure(bcs.vector(bcs.U64).serialize(vaultsIndexes)),
    ],
  });
  let results = (
    await provider.devInspectTransactionBlock({
      sender: SENDER,
      transactionBlock: transaction,
    })
  ).results;
  // console.log(JSON.stringify(results));
  // @ts-ignore
  let bytes = results[results.length - 1].returnValues[0][0];
  // console.log(JSON.stringify(bytes));
  let reader = new BcsReader(new Uint8Array(bytes));
  let result: {
    [key: string]: [Vault, TypusBidReceipt | null];
  } = {};
  reader.readVec((reader) => {
    reader.readULEB();
    let id = AddressFromBytes(reader.readBytes(32));
    let depositToken = String.fromCharCode.apply(
      null,
      Array.from(reader.readBytes(reader.read8()))
    );
    let rewardToken = reader.readVec((reader) => {
      return String.fromCharCode.apply(
        null,
        Array.from(reader.readBytes(reader.read8()))
      );
    });
    let infoArray = reader.readVec((reader) => {
      return reader.read64();
    });
    let configArray = reader.readVec((reader) => {
      return reader.read64();
    });
    let info = {
      index: infoArray[0],
      round: infoArray[1],
      portfolio_vault_index: infoArray[2],
      refresh_ts_ms: infoArray[3],
      status: infoArray[4],
      lending_enabled: infoArray[5],
      price_mbp: infoArray[6],
      mbp_incentivised: infoArray[7],
      fixed_incentivised: infoArray[8],
      token_decimal: infoArray[9],
      lending_apr_mbp: infoArray[10],
      creation_ts_ms: infoArray[11],
    };
    let config = {
      capacity: configArray[0],
      lot_size: configArray[1],
      min_size: configArray[2],
      fee_bp: configArray[3],
      utilization_rate_bp: configArray[4],
      point_per_hour_bp: configArray[5],
      incentive_mbp: configArray[6],
      incentive_fixed: configArray[7],
    };
    // skip BigVector
    reader.readBytes(32); // id
    reader.readBytes(reader.read8()); // element_type
    reader.read64(); // slice_idx
    reader.read32(); // slice_size
    reader.read64(); // length

    let shareSupplyArray = reader.readVec((reader) => {
      return reader.read64();
    });
    let shareSupply = {
      active_share: shareSupplyArray[0],
      deactivating_share: shareSupplyArray[1],
      inactive_share: shareSupplyArray[2],
      warmup_share: shareSupplyArray[3],
      snapshot_share: shareSupplyArray[4],
      reward_share: shareSupplyArray.slice(5),
    };
    let u64Padding = reader.readVec((reader) => {
      return reader.read64();
    });
    let bcsPadding = reader.readVec((reader) => {
      return reader.read8();
    });

    let has_bid_receipt = reader.read8() > 0;
    if (has_bid_receipt) {
      result[info.index] = [
        {
          id,
          depositToken,
          rewardToken,
          info,
          config,
          shareSupply,
          u64Padding,
          bcsPadding,
        },
        {
          id: AddressFromBytes(reader.readBytes(32)),
          vid: AddressFromBytes(reader.readBytes(32)),
          index: reader.read64(),
          metadata: String.fromCharCode.apply(
            null,
            Array.from(reader.readBytes(reader.read8()))
          ),
          u64_padding: reader.readVec((reader) => {
            return reader.read64();
          }),
        },
      ];
    } else {
      result[info.index] = [
        {
          id,
          depositToken,
          rewardToken,
          info,
          config,
          shareSupply,
          u64Padding,
          bcsPadding,
        },
        null,
      ];
    }
  });

  return result;
}

function AddressFromBytes(x: string | any[] | Uint8Array) {
  let address = '0x';
  for (let i = 0; i < x.length; i++) {
    address = address.concat(x[i].toString(16).padStart(2, '0'));
  }
  return address;
}

export async function getShareData(
  provider: SuiClient,
  owner: string
): Promise<{ [key: string]: Share[] }> {
  let transactionBlock = new Transaction();
  const indexes = vaultsIndexes.slice();
  transactionBlock.moveCall({
    target: `${safuPackage}::view_function::get_share_data_bcs`,
    typeArguments: [],
    arguments: [
      transactionBlock.object(safuRegistryId),
      transactionBlock.pure.address(owner),
      transactionBlock.pure(bcs.vector(bcs.U64).serialize(indexes)),
    ],
  });
  let results = (
    await provider.devInspectTransactionBlock({
      sender: SENDER,
      transactionBlock,
    })
  ).results;
  // console.log(JSON.stringify(results));
  // @ts-ignore
  let bytes = results[results.length - 1].returnValues[0][0];
  // console.log(JSON.stringify(bytes));
  let reader = new BcsReader(new Uint8Array(bytes));
  let result: {
    [key: string]: Share[];
  } = {};
  reader.readVec((reader, i) => {
    reader.read8();
    let share = reader.readVec((reader) => {
      let user = AddressFromBytes(reader.readBytes(32));
      let shareSupplyArray = reader.readVec((reader) => {
        return reader.read64();
      });
      let shareSupply = {
        active_share: shareSupplyArray[0],
        deactivating_share: shareSupplyArray[1],
        inactive_share: shareSupplyArray[2],
        warmup_share: shareSupplyArray[3],
        snapshot_share: shareSupplyArray[4],
        reward_share: shareSupplyArray.slice(5),
      };
      return {
        user,
        share: shareSupply,
        u64Padding: reader.readVec((reader) => {
          return reader.read64();
        }),
        bcsPadding: reader.readVec((reader) => {
          return reader.read8();
        }),
      };
    });
    let index = indexes.pop()!;
    result[index] = share;
  });

  return result;
}
