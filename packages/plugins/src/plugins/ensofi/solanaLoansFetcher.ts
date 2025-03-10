import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ensofiIdlItem, platformId } from './constants';
import { LendOfferAccount, LoanOfferAccount } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [loansAsLender, loansAsBorrower, offersAsLender] = await Promise.all([
    getAutoParsedProgramAccounts<LoanOfferAccount>(connection, ensofiIdlItem, [
      {
        dataSize: 439,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 127,
        },
      },
    ]),
    getAutoParsedProgramAccounts<LoanOfferAccount>(connection, ensofiIdlItem, [
      {
        dataSize: 439,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 194,
        },
      },
    ]),
    getAutoParsedProgramAccounts<LendOfferAccount>(connection, ensofiIdlItem, [
      {
        dataSize: 152,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 68,
        },
      },
    ]),
  ]);

  if (
    !loansAsBorrower.length &&
    !loansAsLender.length &&
    !offersAsLender.length
  )
    return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const openOffersElement = elementRegistry.addElementBorrowlend({
    label: 'Lending',
    name: 'Open Offers',
    link: 'https://app.ensofi.xyz/contract/lend',
  });
  offersAsLender.forEach((offer) => {
    if (!offer.status.created) return;

    openOffersElement.addSuppliedAsset({
      address: offer.lendMintToken,
      amount: offer.amount,
      ref: offer.pubkey,
    });
  });

  const lenderActiveElement = elementRegistry.addElementBorrowlend({
    label: 'Lending',
    name: 'Active Contracts',
    link: 'https://app.ensofi.xyz/contract/lend',
  });
  loansAsLender.forEach((loan) => {
    if (!loan.status.fundTransferred && !loan.status.liquidating) return;
    lenderActiveElement.addSuppliedAsset({
      address: loan.lendMintToken,
      amount: loan.borrowAmount,
      attributes: {
        lockedUntil: new BigNumber(loan.startedAt)
          .plus(loan.duration)
          .toNumber(),
      },
      ref: loan.pubkey,
    });
  });

  loansAsBorrower.forEach((loan) => {
    if (!loan.status.fundTransferred && !loan.status.liquidating) return;

    const borrowerActiveElement = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Active Contract',
      ref: loan.pubkey,
      link: 'https://app.ensofi.xyz/contract/loan',
    });
    borrowerActiveElement.addSuppliedAsset({
      address: loan.collateralMintToken,
      amount: loan.collateralAmount,
    });
    borrowerActiveElement.addBorrowedAsset({
      address: loan.lendMintToken,
      amount: loan.borrowAmount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-solana-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
