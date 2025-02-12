import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, vaults } from './constants';
import { normalizedTokenPoolStruct } from './structs';
import { mintAccountStruct, tokenAccountStruct } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const sources: TokenPriceSource[] = [];

  for (const vault of vaults) {
    let tokenMintPrice;
    if (vault.normalizedTokenPoolAccount) {
      const normalizedPool = await getParsedAccountInfo(
        connection,
        normalizedTokenPoolStruct,
        new PublicKey(vault.normalizedTokenPoolAccount)
      );
      if (!normalizedPool) continue;

      const [mintAccount, tokenPrices] = await Promise.all([
        getParsedAccountInfo(
          connection,
          mintAccountStruct,
          normalizedPool.normalized_token_mint
        ),
        cache.getTokenPricesAsMap(
          normalizedPool.supported_tokens.map((token) => token.mint.toString()),
          NetworkId.solana
        ),
      ]);

      if (!mintAccount) continue;

      const supply = mintAccount.supply.dividedBy(10 ** mintAccount.decimals);

      let tvl = new BigNumber(0);
      let missingToken = false;

      for (const token of normalizedPool.supported_tokens) {
        if (token.locked_amount.isZero()) continue;
        const tokenPrice = tokenPrices.get(token.mint.toString());

        if (!tokenPrice) {
          missingToken = true;
          continue;
        }

        tvl = tvl.plus(
          token.locked_amount
            .dividedBy(10 ** tokenPrice.decimals)
            .times(tokenPrice.price)
        );
      }

      if (missingToken) continue;

      tokenMintPrice = {
        decimals: mintAccount.decimals,
        price: tvl.dividedBy(supply).toNumber(),
      };
    } else if (vault.tokenMint) {
      tokenMintPrice = await cache.getTokenPrice(
        vault.tokenMint,
        NetworkId.solana
      );
    }

    if (!tokenMintPrice) continue;

    const [reserveAccount, receiptTokenMintAccount] = await Promise.all([
      getParsedAccountInfo(
        connection,
        tokenAccountStruct,
        new PublicKey(vault.reserveAccount)
      ),
      getParsedAccountInfo(
        connection,
        mintAccountStruct,
        new PublicKey(vault.receiptToken)
      ),
    ]);

    if (!reserveAccount || !receiptTokenMintAccount) continue;

    const receiptTokensInTokenMint = receiptTokenMintAccount.supply
      .dividedBy(10 ** receiptTokenMintAccount.decimals)
      .dividedBy(
        reserveAccount.amount.dividedBy(10 ** tokenMintPrice.decimals)
      );

    sources.push({
      address: vault.receiptToken,
      decimals: receiptTokenMintAccount.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatformId,
      price: new BigNumber(tokenMintPrice.price)
        .multipliedBy(receiptTokensInTokenMint)
        .toNumber(),
      timestamp: Date.now(),
      weight: 1,
    });
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'normal',
};
export default job;
