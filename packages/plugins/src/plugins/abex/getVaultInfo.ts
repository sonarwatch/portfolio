import { Memoized } from '../../utils/misc/Memoized';
import { IReservingFeeModel, IVaultInfo } from './types';
import { SuiClient } from '../../utils/clients/types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { corePackage, vaultsParent } from './constants';
import { getObject } from '../../utils/sui/getObject';
import { parseValue } from './parseValue';

const vaultsMemo: { [key: string]: Memoized<IVaultInfo> } = {};

export const getVaultInfo = async (client: SuiClient, vaultToken: string) => {
  if (!vaultsMemo[vaultToken]) {
    vaultsMemo[vaultToken] = new Memoized<IVaultInfo>(async () => {
      const rawData = await getDynamicFieldObject(client, {
        parentId: vaultsParent,
        name: {
          type: `${corePackage}::market::VaultName<${vaultToken}>`,
          value: { dummy_field: false },
        },
      });
      return parseVaultInfo(client, rawData);
    });
  }
  return vaultsMemo[vaultToken].getItem();
};

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
