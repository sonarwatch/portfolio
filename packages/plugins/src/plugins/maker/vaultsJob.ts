import { NetworkId } from '@sonarwatch/portfolio-core';
import { ilkRegAddress, ilksPrefix, platformId, vatAddress } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { ilkRegAbi, vatAbi } from './abis';
import { IlkData } from './type';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);
  const ilkList = await client.readContract({
    abi: ilkRegAbi,
    address: ilkRegAddress,
    functionName: 'list',
  });

  const ilkDataResults = await client.multicall({
    contracts: ilkList.map((ilk) => ({
      abi: ilkRegAbi,
      address: ilkRegAddress,
      functionName: 'ilkData',
      args: [ilk],
    })),
  });

  const vatIlkDataResults = await client.multicall({
    contracts: ilkList.map((ilk) => ({
      abi: vatAbi,
      address: vatAddress,
      functionName: 'ilks',
      args: [ilk],
    })),
  });

  const ilks = ilkDataResults.reduce((acc: IlkData[], ilkDataResult, index) => {
    const vatIlkDataResult = vatIlkDataResults[index];
    if (
      ilkDataResult.status === 'failure' ||
      !vatIlkDataResult ||
      vatIlkDataResult.status === 'failure'
    )
      return acc;

    acc.push({
      id: ilkList[index],
      pos: Number(ilkDataResult.result[0]),
      join: ilkDataResult.result[1],
      gem: ilkDataResult.result[2],
      dec: Number(ilkDataResult.result[3]),
      class: Number(ilkDataResult.result[4]),
      pip: ilkDataResult.result[5],
      xlip: ilkDataResult.result[6],
      name: ilkDataResult.result[7],
      symbol: ilkDataResult.result[8],
      art: vatIlkDataResult.result[0].toString(),
      rate: vatIlkDataResult.result[1].toString(),
      spot: vatIlkDataResult.result[2].toString(),
      line: vatIlkDataResult.result[3].toString(),
      dust: vatIlkDataResult.result[4].toString(),
    });
    return acc;
  }, []);

  const gemTokenPrices = await cache.getTokenPrices(
    ilks.map((ilk) => ilk.gem),
    NetworkId.ethereum
  );
  gemTokenPrices.forEach((gemTokenPrice, i) => {
    ilks[i].gemTokenPrice = gemTokenPrice;
  });
  await cache.setItem(ilksPrefix, ilks, {
    prefix: ilksPrefix,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', 'evm', NetworkId.ethereum],
};
export default job;
