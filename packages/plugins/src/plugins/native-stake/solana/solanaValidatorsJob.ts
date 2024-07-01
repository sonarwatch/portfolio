import { getProgramIdl } from '@solanafm/explorer-kit-idls';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { VoteAccountInfo } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { platformId, validatorsKey } from '../constants';
import { getAutoParsedProgramAccounts } from '../../../utils/solana';
import { configProgramId } from './constants';
import { ConfigAccount, Validator, ValidatorConfig } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const SFMIdlItem = await getProgramIdl(configProgramId.toString());

  if (!SFMIdlItem) return;

  const [{ current, delinquent }, configs] = await Promise.all([
    client.getVoteAccounts(),
    getAutoParsedProgramAccounts<ConfigAccount>(client, SFMIdlItem),
  ]);

  const voters: VoteAccountInfo[] = [...current, ...delinquent];

  const configsByVoter = new Map<string, ValidatorConfig>();
  configs.forEach((c) => {
    if (!c.info) return;

    try {
      const info = JSON.parse(c.info);
      const voter = c.configKeys.keysTuple[1][0];
      configsByVoter.set(voter, {
        voter,
        name: info.name,
        iconUrl: info.iconUrl,
      });
    } catch (err) {
      /* empty */
    }
  });

  const validators: Validator[] = [];
  voters.forEach((voteAcc) => {
    const config = configsByVoter.get(voteAcc.nodePubkey.toString());

    validators.push({
      voter: voteAcc.votePubkey.toString(),
      commission: voteAcc.commission,
      name: config?.name,
      iconUrl: config?.iconUrl,
    });
  });

  await cache.setItem(validatorsKey, validators, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-solana-validators`,
  executor,
  label: 'normal',
};
export default job;
