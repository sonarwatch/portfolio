import {
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { luloProgramId, platformId } from './constants';
import { getDerivedAccount, isLiftEmpty } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { promotionAuthorityStruct, userAccountStruct } from './struct';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { usdcSolanaMint } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const flexUserPda = getDerivedAccount(owner);
  const flexUser = await getParsedAccountInfo(
    client,
    userAccountStruct,
    new PublicKey(flexUserPda)
  );
  if (!flexUser) return [];

  const validAuthoritySeed = flexUser.promotionSeeds.find(
    (s) => !isLiftEmpty(s.authoritySeed)
  );
  if (!validAuthoritySeed) return [];

  const seedValue = Buffer.from(validAuthoritySeed.authoritySeed).toString(
    'utf8'
  );

  const authorityAddress = PublicKey.findProgramAddressSync(
    [Buffer.from('promotion_authority'), Buffer.from(seedValue.toString())],
    luloProgramId
  )[0];
  const promotionAuthority = await getParsedAccountInfo(
    client,
    promotionAuthorityStruct,
    authorityAddress
  );
  if (!promotionAuthority) return [];
  if (promotionAuthority.totalDeposits.isZero()) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    [usdcSolanaMint],
    NetworkId.solana
  );

  const tokenPrice = tokenPrices.get(promotionAuthority.mintAddress.toString());
  if (!tokenPrice) return [];
  const amount = promotionAuthority.totalDeposits
    .div(10 ** tokenPrice.decimals)
    .toNumber();
  const asset = tokenPriceToAssetToken(
    tokenPrice.address,
    amount,
    NetworkId.solana,
    tokenPrice
  );

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    type: PortfolioElementType.multiple,
    label: 'Deposit',
    platformId,
    value: asset.value,
    data: {
      assets: [asset],
    },
    name: 'Points Lift',
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-lift`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
