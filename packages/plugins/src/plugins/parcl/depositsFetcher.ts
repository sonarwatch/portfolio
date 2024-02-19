import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  usdcSolanaMint,
} from '../../utils/solana';
import {
  lpAccountStruct,
  lpPositionStruct,
  settlementRequestStruct,
} from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getLpPositionsPdas, getOldLpAccountPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { settlementRequestFilter } from './filters';

const thirtyDays = 30 * 1000 * 60 * 60 * 24;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const oldLpAccount = await getParsedAccountInfo(
    client,
    lpAccountStruct,
    getOldLpAccountPda(owner)
  );

  let id = 0;
  const lpPositions = [];
  let parsedAccount;
  do {
    const accountPubKeys = getLpPositionsPdas(owner, id, id + 10);
    parsedAccount = await getParsedMultipleAccountsInfo(
      client,
      lpPositionStruct,
      accountPubKeys
    );
    lpPositions.push(...parsedAccount);
    id += 10;
  } while (parsedAccount[parsedAccount.length]);

  // id = 0;
  // const settlementRequests = [];
  // let requestsParsedAccounts;
  // do {
  //   const accountPubKeys = getSettlementRequestsPdas(owner, id, id + 10);
  //   requestsParsedAccounts = await getParsedMultipleAccountsInfo(
  //     client,
  //     settlementRequestStruct,
  //     accountPubKeys
  //   );
  //   settlementRequests.push(...requestsParsedAccounts);
  //   id += 10;
  // } while (requestsParsedAccounts[requestsParsedAccounts.length]);
  // console.log(
  //   'constexecutor:FetcherExecutor= ~ settlementRequests:',
  //   settlementRequests
  // );
  const settlementRequests = await getParsedProgramAccounts(
    client,
    settlementRequestStruct,
    programId,
    settlementRequestFilter(owner)
  );

  const usdcTokenPrice = await cache.getTokenPrice(
    usdcSolanaMint,
    NetworkId.solana
  );
  const elements: PortfolioElement[] = [];
  const assets: PortfolioAsset[] = [];

  if (oldLpAccount && !oldLpAccount.liquidity.isZero()) {
    const unlockStartedAt = new Date(
      oldLpAccount.lastAddLiquidityTimestamp.times(1000).toNumber()
    );
    const unlockingAt = new Date(unlockStartedAt.getTime() + thirtyDays);
    const asset: PortfolioAsset = {
      ...tokenPriceToAssetToken(
        usdcSolanaMint,
        oldLpAccount.liquidity.dividedBy(10 ** 6).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      attributes: {
        lockedUntil: unlockingAt.getTime(),
        tags: ['depreciated'],
      },
    };
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: [asset] },
      value: asset.value,
    });
  }

  for (const lpPosition of lpPositions) {
    if (!lpPosition || lpPosition.liquidity.isZero()) continue;

    const unlockingAt = new Date(lpPosition.maturity.times(1000).toNumber());
    const asset: PortfolioAsset = {
      ...tokenPriceToAssetToken(
        usdcSolanaMint,
        lpPosition.liquidity.dividedBy(10 ** 6).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      attributes: {
        lockedUntil: unlockingAt.getTime(),
      },
    };
    assets.push(asset);
  }

  for (const settlementRequest of settlementRequests) {
    if (!settlementRequest || settlementRequest.amount.isZero()) continue;

    const unlockingAt = new Date(
      settlementRequest.maturity.times(1000).toNumber()
    );
    if (unlockingAt.getTime() < Date.now()) continue;

    const asset: PortfolioAsset = {
      ...tokenPriceToAssetToken(
        usdcSolanaMint,
        settlementRequest.amount.dividedBy(10 ** 6).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      ),
      attributes: {
        lockedUntil: unlockingAt.getTime(),
        tags: ['Pending Withdraw'],
      },
    };

    assets.push(asset);
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
