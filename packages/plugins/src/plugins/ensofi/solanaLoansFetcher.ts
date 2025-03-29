import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ensofiLendingProgramId, platformId } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  lendOfferAccountStruct,
  LendOfferStatus,
  loanOfferAccountStruct,
  LoanOfferStatus,
} from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [loansAsLender, loansAsBorrower, offersAsLender] = await Promise.all([
    ParsedGpa.build(connection, loanOfferAccountStruct, ensofiLendingProgramId)
      .addFilter('accountDiscriminator', [254, 193, 253, 69, 80, 17, 193, 46])
      .addFilter('lender', new PublicKey(owner))
      .addDataSizeFilter(439)
      .run(),
    ParsedGpa.build(connection, loanOfferAccountStruct, ensofiLendingProgramId)
      .addFilter('accountDiscriminator', [254, 193, 253, 69, 80, 17, 193, 46])
      .addFilter('borrower', new PublicKey(owner))
      .addDataSizeFilter(439)
      .run(),
    ParsedGpa.build(connection, lendOfferAccountStruct, ensofiLendingProgramId)
      .addFilter('accountDiscriminator', [130, 140, 110, 73, 124, 199, 122, 81])
      .addFilter('lender', new PublicKey(owner))
      .addDataSizeFilter(154)
      .run(),
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
    if (offer.status !== LendOfferStatus.Created) return;

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
    if (
      loan.status !== LoanOfferStatus.FundTransferred &&
      loan.status !== LoanOfferStatus.Liquidating
    )
      return;
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
    if (
      loan.status !== LoanOfferStatus.FundTransferred &&
      loan.status !== LoanOfferStatus.Liquidating
    )
      return;

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
