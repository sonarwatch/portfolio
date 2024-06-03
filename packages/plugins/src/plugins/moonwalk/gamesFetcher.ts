import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { programId, platformId, gamesCacheId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { CachedGame, gamePlayerStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { bonkMint } from '../bonkrewards/constants';
import { getMintFromCurrency } from './helpers';

const cachedGames: Map<string, CachedGame> = new Map();
let lastCachedGames = 0;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const now = Date.now();
  if (lastCachedGames + 600000 < now) {
    const cCachedGames = await cache.getItem<CachedGame[]>(gamesCacheId, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
    lastCachedGames = now;
    cCachedGames?.forEach((c) => {
      cachedGames.set(c.gameId, c);
    });
  }

  const accounts = await getParsedProgramAccounts(
    connection,
    gamePlayerStruct,
    programId,
    [
      {
        dataSize: gamePlayerStruct.byteSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
        },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    [solanaNativeAddress, usdcSolanaMint, bonkMint],
    NetworkId.solana
  );
  const assets: PortfolioAssetToken[] = [];
  accounts.forEach((acc) => {
    if (acc.claimed) return;
    const game = cachedGames.get(acc.gameId.toString());
    if (!game) return;

    const { mint } = getMintFromCurrency(game.currency);
    const tokenPrice = tokenPrices.get(mint);

    const amount = new BigNumber(game.playerDeposit).toNumber();
    const lockedUntil = Number(game.blocktimeEnd);
    const asset = tokenPriceToAssetToken(
      mint,
      amount,
      NetworkId.solana,
      tokenPrice,
      tokenPrice?.price,
      {
        lockedUntil,
      }
    );
    assets.push(asset);
  });
  if (assets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    label: 'Deposit',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-games`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
