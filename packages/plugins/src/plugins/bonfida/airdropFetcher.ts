import {
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  airdropApi,
  airdropPid,
  fidaDecimals,
  fidaMint,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { AirdropResponse } from './types';
import { getParsedProgramAccounts } from '../../utils/solana';
import { claimStatusStruct } from '../jito/structs';
import { getClientSolana } from '../../utils/clients';
import { claimFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const apiRes: AxiosResponse<AirdropResponse> | null = await axios
    .get(airdropApi + owner, { timeout: 5000 })
    .catch(() => null);
  if (!apiRes || apiRes.data.error) return [];

  const client = getClientSolana();
  const claimStatus = await getParsedProgramAccounts(
    client,
    claimStatusStruct,
    airdropPid,
    claimFilters(owner)
  );
  const claim = claimStatus.at(0);
  if (claim) return [];

  const fidaTokenPrice = await cache.getTokenPrice(fidaMint, NetworkId.solana);

  const amount = new BigNumber(apiRes.data.amount_unlocked).dividedBy(
    10 ** fidaDecimals
  );

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    label: 'Airdrop',
    platformId,
    type: PortfolioElementType.multiple,
    value: fidaTokenPrice
      ? amount.times(fidaTokenPrice.price).toNumber()
      : null,
    data: {
      assets: [
        tokenPriceToAssetToken(
          fidaMint,
          amount.toNumber(),
          NetworkId.solana,
          fidaTokenPrice
        ),
      ],
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
