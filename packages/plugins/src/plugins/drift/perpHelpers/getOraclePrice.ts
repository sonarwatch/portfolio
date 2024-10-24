import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { SolanaClient } from '../../../utils/clients/types';
import { OracleSource } from '../struct';
import { OraclePriceData } from './types';
import { getPythOraclePriceDataFromBuffer } from './pyth';
import { getSwitchboardOraclePriceDataFromBuffer } from './switchboard';
import { getPreLaunchOraclePriceDataFromBuffer } from './prelaunchOracle';
import { getPythPullOraclePriceDataFromBuffer } from './pythPull';

const oraclePrices: Map<string, OraclePriceData> = new Map();
const lastUpdates: Map<string, number> = new Map();
const oraclePriceTtl = 90000;

export async function getOraclePrice(
  oracle: string,
  oracleSource: OracleSource,
  connection: SolanaClient
): Promise<OraclePriceData> {
  const lastUpdate = lastUpdates.get(oracle);
  const oPriceData = oraclePrices.get(oracle);
  if (!oPriceData || !lastUpdate || lastUpdate < Date.now() - oraclePriceTtl) {
    const acc = await connection.getAccountInfo(new PublicKey(oracle));
    if (!acc) throw new Error('Unable to fetch oracle data');
    let coPriceData: OraclePriceData;
    switch (oracleSource) {
      case OracleSource.Pyth:
        coPriceData = getPythOraclePriceDataFromBuffer(
          acc.data,
          new BN(1),
          false
        );
        break;
      case OracleSource.Pyth1K:
        coPriceData = getPythOraclePriceDataFromBuffer(
          acc.data,
          new BN(1000),
          false
        );
        break;
      case OracleSource.Pyth1M:
        coPriceData = getPythOraclePriceDataFromBuffer(
          acc.data,
          new BN(1000000),
          false
        );
        break;
      case OracleSource.PythStableCoin:
        coPriceData = getPythOraclePriceDataFromBuffer(
          acc.data,
          new BN(1),
          true
        );
        break;
      case OracleSource.Switchboard:
        coPriceData = getSwitchboardOraclePriceDataFromBuffer(acc.data);
        break;
      case OracleSource.Prelaunch:
        coPriceData = getPreLaunchOraclePriceDataFromBuffer(acc.data);
        break;
      case OracleSource.PythPull:
        coPriceData = getPythPullOraclePriceDataFromBuffer(
          acc.data,
          new BN(1),
          false
        );
        break;
      case OracleSource.Pyth1KPull:
        coPriceData = getPythPullOraclePriceDataFromBuffer(
          acc.data,
          new BN(1000),
          false
        );
        break;
      case OracleSource.Pyth1MPull:
        coPriceData = getPythPullOraclePriceDataFromBuffer(
          acc.data,
          new BN(1000000),
          false
        );
        break;
      case OracleSource.PythStableCoinPull:
        coPriceData = getPythPullOraclePriceDataFromBuffer(
          acc.data,
          new BN(1),
          true
        );
        break;
      default:
        throw new Error(`Unsupported OracleSource: ${oracleSource}`);
    }

    oraclePrices.set(oracle, coPriceData);
    lastUpdates.set(oracle, Date.now());
    return coPriceData;
  }
  return oPriceData;
}
