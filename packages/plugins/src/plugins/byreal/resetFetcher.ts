import {
  NetworkId,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { byrealResetPid, byrealPlatformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { AuctionStatus, auctionStruct, commitStatusStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
} from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    commitStatusStruct,
    byrealResetPid
  )
    .addFilter('discriminator', [25, 194, 13, 113, 31, 254, 29, 14])
    .addFilter('user', new PublicKey(owner))
    .run();
  if (accounts.length === 0) return [];

  const auctions = await getParsedMultipleAccountsInfo(
    client,
    auctionStruct,
    accounts.map((acc) => acc.auction)
  );
  const registry = new ElementRegistry(NetworkId.solana, byrealPlatformId);

  const tokenPriceById = await cache.getTokenPricesAsMap(
    auctions.flatMap((a) =>
      a ? [a.quoteMint.toString(), a?.listMint.toString()] : []
    ),
    NetworkId.solana
  );
  const listTokenAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    auctions.flatMap((a) => (a ? a.listMint : []))
  );

  accounts.forEach((account, index) => {
    const auction = auctions[index];
    if (!auction) return;
    if (auction.status === AuctionStatus.Closed) return;

    const element = registry.addElementMultiple({
      label: 'Deposit',
      link: `https://www.byreal.io/en/reset?id=${account.auction.toString()}`,
      name: 'Reset',
      ref: account.pubkey.toString(),
      sourceRefs: [
        {
          address: auction.pubkey.toString(),
          name: 'Market',
        },
      ],
    });

    const quoteDecimals = tokenPriceById.get(
      auction.quoteMint.toString()
    )?.decimals;
    const listDecimals =
      tokenPriceById.get(auction.listMint.toString())?.decimals ??
      listTokenAccounts.find(
        (a) => a?.pubkey.toString() === auction.listMint.toString()
      )?.decimals;
    if (!listDecimals || !quoteDecimals) return;

    const isCommitEnded = auction.commitEndTime.isLessThanOrEqualTo(
      Date.now() * 1000
    );
    account.bins.forEach((bin, id) => {
      if (isCommitEnded) {
        if (
          !bin.claimedQuoteTokenAmount.isZero() ||
          bin.commitQuoteTokenAmount.isZero()
        )
          return;

        const binAuction = auction.bins[id];
        if (!binAuction.unitPrice) return;

        const { unitPrice, totalCommitted, totalSupply } = binAuction;

        const filledRatio = totalCommitted
          .dividedBy(10 ** quoteDecimals)
          .dividedBy(
            totalSupply
              .dividedBy(10 ** listDecimals)
              .times(unitPrice.dividedBy(10 ** quoteDecimals))
          );

        let refundAmount = new BigNumber(0);
        let mintAmountToClaim = new BigNumber(0);
        if (filledRatio.isLessThan(1)) {
          mintAmountToClaim = bin.commitQuoteTokenAmount
            .times(unitPrice)
            .dividedBy(10 ** listDecimals);
        } else {
          refundAmount = bin.commitQuoteTokenAmount.times(
            1 - 1 / filledRatio.toNumber()
          );
          mintAmountToClaim = bin.commitQuoteTokenAmount
            .minus(refundAmount)
            .shiftedBy(-quoteDecimals)
            .dividedBy(unitPrice.shiftedBy(-listDecimals));
        }

        const attributes: PortfolioAssetAttributes | undefined =
          auction.claimStartTime.isLessThanOrEqualTo(Date.now() * 1000)
            ? { isClaimable: true }
            : undefined;
        element.addAsset({
          address: auction.quoteMint,
          amount: refundAmount,
          attributes,
        });
        element.addAsset({
          address: auction.listMint,
          amount: mintAmountToClaim,
          alreadyShifted: true,
          attributes,
        });
      } else {
        element.addAsset({
          address: auction.quoteMint,
          amount: bin.commitQuoteTokenAmount,
        });
      }
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${byrealPlatformId}-reset`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
