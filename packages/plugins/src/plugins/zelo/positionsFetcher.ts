import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { userRecordStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const userAccount = await getParsedAccountInfo(
    connection,
    userRecordStruct,
    PublicKey.findProgramAddressSync(
      [Buffer.from('user-v2'), new PublicKey(owner).toBuffer()],
      programId
    )[0]
  );

  if (!userAccount) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    ref: userAccount.pubkey,
    link: 'https://www.zelofi.io/dapp',
  });

  element.addAsset({
    address: solanaNativeAddress,
    amount: userAccount.solDeposit,
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
