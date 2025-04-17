import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { fragmetricPid, platformId, vaults } from './constants';
import { FundAccountStruct, normalizedTokenPoolStruct } from './structs';
import {
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
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
      link: 'https://app.fragmetric.xyz/restake/',
      sourceRefs: [{ address: vault.reserveAccount, name: 'Vault' }],
    });
  }

  const fundsAccounts = await getParsedProgramAccounts(
    connection,
    FundAccountStruct,
    fragmetricPid,
    [{ memcmp: { offset: 0, bytes: '9GKzjVzZPww' } }]
  );

  for (const fundAccount of fundsAccounts) {
    const receiptTokenPriceSource = sources.find(
      (source) => source.address === fundAccount.receipt_token_mint.toString()
    );
    if (!receiptTokenPriceSource) continue;

    // Retrieve balances of the receipt token inside the wrap reserve account
    const wrapTokensBalances = await connection.getTokenAccountsByOwner(
      fundAccount.wrap_account,
      {
        mint: fundAccount.receipt_token_mint,
      }
    );

    const wrapReceiptReserve = wrapTokensBalances.value
      .map(
        (balance) =>
          tokenAccountStruct.deserialize(balance.account.data)[0].amount
      )
      .reduce((a, b) => a.plus(b), new BigNumber(0))
      .dividedBy(10 ** fundAccount.receipt_token_decimals);

    const wrapSupply = fundAccount.wrapped_token.supply.dividedBy(
      10 ** fundAccount.wrapped_token.decimals
    );

    // Price source for the Wrapped Token (i.e wfragSOL)
    sources.push({
      address: fundAccount.wrapped_token.mint.toString(),
      decimals: fundAccount.wrapped_token.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatformId,
      price: wrapSupply
        .dividedBy(wrapReceiptReserve)
        .times(receiptTokenPriceSource.price)
        .toNumber(),
      timestamp: Date.now(),
      weight: 1,
      link: 'https://app.fragmetric.xyz/wrap/',
      sourceRefs: [
        { address: fundAccount.wrap_account.toString(), name: 'Vault' },
      ],
    });
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pricing`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
