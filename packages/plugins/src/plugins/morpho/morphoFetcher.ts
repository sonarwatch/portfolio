import { NetworkId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { deepLog } from '../../utils/misc/logging';

type Comptroller = {
  chain: string;
  address: string;
  assets: string[];
};

const poolIdsList: `0x${string}`[] = [
  '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
  '0x06f2842602373d247c4934f7656e513955ccc4c377f0febc0d9ca2c3bcc191b1',
  '0xf9acc677910cc17f650416a22e2a14d5da7ccb9626db18f1bf94efe64f92b372',
  '0x7dde86a1e94561d9690ec678db673c1a6396365f7d1d65e129c5fff0990ff758',
  '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc',
  '0x495130878b7d2f1391e21589a8bcaef22cbc7e1fbbd6866127193b3cc239d8b1',
  '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
  '0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89',
  '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
  '0x608929d6de2a10bacf1046ff157ae38df5b9f466fb89413211efb8f63c63833a',
  '0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5',
  '0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99',
  '0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2',
  '0x124ddf1fa02a94085d1fcc35c46c7e180ddb8a0d3ec1181cf67a75341501c9e6',
  '0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3',
  '0xae1839e7d779b32e91e2128405525b7f38478f38fed74b9a4795e8ed952592b7',
  '0xf213843ac8ce2c8408182fc80c9e8f9911b420cce24adec8ea105ae44de087ad',
  '0x3c83f77bde9541f8d3d82533b19bbc1f97eb2f1098bb991728acbfbede09cc5d',
  '0x9337a95dcb09d10abb33fdb955dd27b46e345f5510d54d9403f570f8f37b5983',
];

const router = {
  chain: 'ethereum',
  address: '0xa7995f71aa11525db02fc2473c37dee5dbf55107',
  comptroller: null as null | Comptroller,
};

const rawComptroller: Comptroller = {
  chain: 'ethereum',
  address: '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb',
  assets: [],
};

const bbUSDC = {
  chain: 'ethereum',
  address: '0x186514400e52270cef3d80e1c6f8d10a75d47344',
};

const steakUSDC = {
  chain: 'ethereum',
  address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
};

const bbETH = {
  chain: 'ethereum',
  address: '0x38989bba00bdf8181f4082995b3deae96163ac5d',
};

const bbUSDT = {
  chain: 'ethereum',
  address: '0x2c25f6c25770ffec5959d34b94bf898865e5d6b1',
};

const re7WETH = {
  chain: 'ethereum',
  address: '0x78fc2c2ed1a4cdb5402365934ae5648adad094d0',
};

const steakPYUSD = {
  chain: 'ethereum',
  address: '0xbeef02e5e13584ab96848af90261f0c8ee04722a',
};

const steakUSDT = {
  address: '0xbeef047a543e45807105e51a8bbefcc5950fcfba',
};

// DIV

const morphosList = [
  bbUSDC,
  steakUSDC,
  bbETH,
  bbUSDT,
  re7WETH,
  steakPYUSD,
  steakUSDT,
];

const contractAbi = {
  asset: {
    inputs: [],
    name: 'asset',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
} as const;

export async function getMorphoContracts(morphos: { address: string }[]) {
  const client = getEvmClient(NetworkId.ethereum);

  const assets = await client.multicall({
    contracts: morphos.map(
      (morpho) =>
        ({
          address: getAddress(morpho.address),
          abi: [contractAbi.asset],
          functionName: 'asset',
        } as const)
    ),
  });

  return assets.map((res, index) => ({
    ...morphos[index],
    underlyings: [res.result],
  }));
}

// DIV

const assetAbi = {
  idToMarketParams: {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'idToMarketParams',
    outputs: [
      { internalType: 'address', name: 'loanToken', type: 'address' },
      { internalType: 'address', name: 'collateralToken', type: 'address' },
      { internalType: 'address', name: 'oracle', type: 'address' },
      { internalType: 'address', name: 'irm', type: 'address' },
      { internalType: 'uint256', name: 'lltv', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;

async function fetchAssetsParams(
  comptroller: Comptroller,
  poolIds: `0x${string}`[]
) {
  const client = getEvmClient(NetworkId.ethereum);

  return client.multicall({
    contracts: poolIds.map(
      (id) =>
        ({
          address: getAddress(comptroller.address),
          args: [id],
          abi: [assetAbi.idToMarketParams],
          functionName: 'idToMarketParams',
        } as const)
    ),
  });
}

function extractTokensAndLtv(res: any) {
  const [loanToken, collateralToken, , , lltv] = res.result;
  return { loanToken, collateralToken, lltv };
}

interface AssetInfo {
  id: `0x${string}`;
  collateralToken: `0x${string}`;
  debtToken: `0x${string}`;
  ltv: bigint;
}

function addToComptroller(
  comptroller: Comptroller,
  asset: AssetInfo,
  collateralToken: string,
  debtToken: string
) {
  console.log(comptroller, asset, collateralToken, debtToken);
  comptroller.assets.push(
    {
      collateralToken,
      ltv: asset.ltv,
      id: asset.id,
      category: 'lend',
    },
    {
      debtToken,
      id: asset.id,
      category: 'borrow',
    }
  );
}

export async function getMorphoAssets(
  comptroller: Comptroller,
  poolIds: `0x${string}`[]
) {
  const assetsParamsRes = await fetchAssetsParams(comptroller, poolIds);

  const assetsInfo = assetsParamsRes.map((res, index) => {
    const { loanToken, collateralToken, lltv } = extractTokensAndLtv(res);
    return {
      id: poolIds[index],
      collateralToken,
      debtToken: loanToken,
      ltv: lltv,
    };
  });

  const [collateralTokensDetails, debtTokensDetails] = [
    assetsInfo.map((a) => a.collateralToken),
    assetsInfo.map((a) => a.debtToken),
  ];

  assetsInfo.forEach((asset, index) => {
    console.log({ asset });
    addToComptroller(
      comptroller,
      asset,
      collateral[index],
      debtTokensDetails[index]
    );
  });

  return comptroller;
}

export const getContracts = async () => {
  const [pools, comptroller] = await Promise.all([
    getMorphoContracts(morphosList),
    getMorphoAssets(rawComptroller, poolIdsList),
  ]);

  router.comptroller = comptroller;

  // console.log('+_+_+__+_+_+_+_');
  // console.log(deepLog(pools));
  // console.log(deepLog(router));

  return {
    contracts: { pools, router },
  };
};

const executor: FetcherExecutor = async (owner: string) => {
  console.log(owner);
  await getContracts();
  return [];
};

export const fetcher: Fetcher = {
  id: `${platformId}-test`,
  networkId: NetworkId.ethereum,
  executor,
};
