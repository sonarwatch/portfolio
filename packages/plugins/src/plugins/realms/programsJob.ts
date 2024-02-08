import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  customVsrInfo,
  platformId,
  splGovernanceUrl,
  vsrProgram,
} from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { registrarStruct } from './structs/realms';
import { registratAccountFilter } from './filters';
import { RealmData, RegistrarInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const splGovPrograms: AxiosResponse<string[]> = await axios.get(
    splGovernanceUrl
  );
  const client = getClientSolana();

  const registrars: RegistrarInfo[] = [];
  const allRegistrars = await getParsedProgramAccounts(
    client,
    registrarStruct,
    vsrProgram,
    registratAccountFilter()
  );
  allRegistrars.forEach((account) =>
    registrars.push({
      vsr: vsrProgram.toString(),
      pubkey: account.pubkey.toString(),
      mint: account.realmGoverningTokenMint.toString(),
    })
  );
  for (const vsrInfo of customVsrInfo) {
    const customRegistrars = await getParsedProgramAccounts(
      client,
      registrarStruct,
      new PublicKey(vsrInfo.programId),
      registratAccountFilter()
    );
    customRegistrars.forEach((registrar) =>
      registrars.push({
        pubkey: registrar.pubkey.toString(),
        vsr: vsrInfo.programId.toString(),
        mint: vsrInfo.mint,
      })
    );
  }

  const realmsData: RealmData = {
    govPrograms: splGovPrograms.data,
    registrars,
  };

  await cache.setItem('data', realmsData, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-programs`,
  executor,
  label: 'normal',
};

export default job;
