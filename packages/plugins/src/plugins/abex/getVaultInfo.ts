import { IReservingFeeModel, IVaultInfo } from './types';
import { SuiClient } from '../../utils/clients/types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { corePackage, vaultsParent } from './constants';
import { getObject } from '../../utils/sui/getObject';
import { parseValue } from './parseValue';
import { MemoryCache } from '../../utils/misc/MemoryCache';
import { getClientSui } from '../../utils/clients';

const memoCollection = new MemoryCache<IVaultInfo>(
  async (vaultToken: string) => {
    const client = getClientSui();
    const rawData = await getDynamicFieldObject(client, {
      parentId: vaultsParent,
      name: {
        type: `${corePackage}::market::VaultName<${vaultToken}>`,
        value: { dummy_field: false },
      },
    });
    return parseVaultInfo(client, rawData);
  }
);

export const getVaultInfo = async (vaultToken: string) =>
  memoCollection.getItem(vaultToken);

const parseVaultInfo = async (
  client: SuiClient,
  raw: any
): Promise<IVaultInfo> => {
  const vaultFields = raw.data.content.fields.value.fields;
  const reservingFeeModelAddr = vaultFields.reserving_fee_model;
  const reservingFeeModelRaw = await getObject(client, reservingFeeModelAddr, {
    showContent: true,
  });
  const reservingFeeModel = parseReservingFeeModel(reservingFeeModelRaw);

  return {
    liquidity: parseValue(vaultFields.liquidity),
    reservedAmount: parseValue(vaultFields.reserved_amount),
    unrealisedReservingFeeAmount: parseValue(
      vaultFields.unrealised_reserving_fee_amount
    ),
    accReservingRate: parseValue(vaultFields.acc_reserving_rate),
    enabled: vaultFields.enabled,
    weight: parseValue(vaultFields.weight),
    lastUpdate: parseValue(vaultFields.last_update),
    reservingFeeModel,
    priceConfig: {
      maxInterval: parseValue(vaultFields.price_config.fields.max_interval),
      maxConfidence: parseValue(vaultFields.price_config.fields.max_confidence),
      precision: parseValue(vaultFields.price_config.fields.precision),
      feeder: vaultFields.price_config.fields.feeder,
    },
  };
};

const parseReservingFeeModel = (raw: any): IReservingFeeModel => {
  const { fields } = raw.data.content;

  return {
    multiplier: parseValue(fields.multiplier),
  };
};
