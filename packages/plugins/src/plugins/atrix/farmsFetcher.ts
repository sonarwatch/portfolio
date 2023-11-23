import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { atrixV1Staking, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { farmStruct, otherStruct, stakerStruct } from './structs';
import { farmAccountFilter, stakerAccountFilter } from './filters';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // do some stuff
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    farmStruct,
    atrixV1Staking,
    farmAccountFilter()
  );

  console.log(
    'constexecutor:FetcherExecutor= ~ farmStruct:',
    farmStruct.byteSize
  );
  accounts.forEach((account) => {
    console.log('Pubkey:', account.pubkey.toString());
    console.log('Account:', account.account.toString());
    console.log('Address:', account.address.toString());
    console.log('coinMint:', account.coinMint.toString());
    console.log('padding', account.padding1.toString());
    console.log('Amount:', account.amount.toString());
    console.log('Amount1:', account.amount1.toString());
    console.log('coinAccount:', account.coinAccount.toString());
    console.log('amount:', account.padding2.toString());
    console.log('amount2:', account.padding3.toString());
    console.log('timestamp:', account.timestamp.toString());
    console.log('=============================');
  });

  // const firstAccount = await getParsedAccountInfo(
  //   client,
  //   otherStruct,
  //   new PublicKey('BciTkE3cxzhp9SQkiEuGUHhtzBEsfihGWiX7iZkxDpMC')
  // );
  // const secondAccount = await getParsedAccountInfo(
  //   client,
  //   farmStruct,
  //   new PublicKey('G8Gggw8WvBLVDavEmP5rUJov2Ar8zCNdzZNkKscpJRjr')
  // );

  // console.log('constexecutor:FetcherExecutor= ~ accounts:', accounts);
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
