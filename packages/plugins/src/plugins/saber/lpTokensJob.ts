import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { Cache } from "../../Cache";
import { Job, JobExecutor } from "../../Job";
import { getClientSolana } from "../../utils/clients";
import { platformId, SABER_SWAPS } from "./constants";
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { tokenAccountStruct } from "../../utils/solana";
import { mintAccountStruct } from "../../utils/solana";
import runInBatch from "../../utils/misc/runInBatch";
import { NetworkId, TokenPrice, TokenPriceUnderlying } from "@sonarwatch/portfolio-core";
import { BN } from "bn.js";
import BigNumber from "bignumber.js";
const executor: JobExecutor = async (cache: Cache) => {
    const client = getClientSolana();
    let swaps = (
        await axios.get(SABER_SWAPS).catch(() => { return {data: []} })
      ).data;
    let accounts = [];
    for(let i = 0; i < swaps.length; i++) {
        let reserveA = swaps[i].addresses.reserves[0];
        let reserveB = swaps[i].addresses.reserves[1];
        let lpMint = swaps[i].addresses.lpTokenMint;

        accounts.push(new PublicKey(reserveA));
        accounts.push(new PublicKey(reserveB));
        accounts.push(new PublicKey(lpMint));
    }

    let accountInfos = await getMultipleAccountsInfoSafe(client, accounts);

    let mints: PublicKey[] = [];
    
    for(let i=0; i<swaps.length; i++) {
        let reserveAInfo = accountInfos[i * 3];
        let reserveBInfo = accountInfos[i * 3 + 1];
        let lpMintInfo = accountInfos[i * 3 + 2];

        if(!reserveAInfo || !reserveBInfo || !lpMintInfo) continue;

        let reserveA = tokenAccountStruct.deserialize(reserveAInfo.data)[0];
        let reserveB = tokenAccountStruct.deserialize(reserveBInfo.data)[0];
        mints.push(reserveA.mint);
        mints.push(reserveB.mint);
    }

    const tokenPriceResults = await runInBatch(
        [...mints].map((mint) => () => cache.getTokenPrice(mint.toBase58(), NetworkId.solana))
      );
      
    const tokenPrices: Map<string, TokenPrice> = new Map();
    tokenPriceResults.forEach((r) => {
        if (r.status === 'rejected') return;
        if (!r.value) return;
        tokenPrices.set(r.value.address, r.value);
    });
    let counter = 0;
    for(let i=0; i<swaps.length; i++) {
        let reserveAInfo = accountInfos[i * 3];
        let reserveBInfo = accountInfos[i * 3 + 1];
        let lpMintInfo = accountInfos[i * 3 + 2];

        if(!reserveAInfo || !reserveBInfo || !lpMintInfo) continue;

        let reserveA = tokenAccountStruct.deserialize(reserveAInfo.data)[0];
        let reserveB = tokenAccountStruct.deserialize(reserveBInfo.data)[0];
        let lpMint = mintAccountStruct.deserialize(lpMintInfo.data)[0];

        let priceA = tokenPrices.get(reserveA.mint.toBase58());
        let priceB = tokenPrices.get(reserveB.mint.toBase58());

        if(!priceA || !priceB) continue;
        
        let coinHoldings = reserveA.amount.multipliedBy(priceA.price).div(10 ** priceA.decimals);
        let pcHoldings = reserveB.amount.multipliedBy(priceB.price).div(10 ** priceB.decimals);

        let lpTokenPrice = coinHoldings.plus(pcHoldings).div(lpMint.supply).div(10 ** lpMint.decimals);

        const underlyings: TokenPriceUnderlying[] = [];
        underlyings.push({
            networkId: NetworkId.solana,
            address: priceA.address,
            decimals: priceA.decimals,
            price: priceA.price,
            amountPerLp: (new BigNumber(reserveA.amount)).div(lpMint.supply).toNumber(),
          });
          underlyings.push({
            networkId: NetworkId.solana,
            address: priceB.address,
            decimals: priceB.decimals,
            price: priceB.price,
            amountPerLp: (new BigNumber(reserveB.amount)).div(lpMint.supply).toNumber(),
          });
          await cache.setTokenPriceSource({
            id: platformId,
            weight: 1,
            address: swaps[i].addresses.lpTokenMint,
            networkId: NetworkId.solana,
            platformId,
            decimals: lpMint.decimals,
            price: lpTokenPrice.toNumber(),
            underlyings,
            timestamp: Date.now(),
          });
    }
};

const job: Job = {
    id: `${platformId}-lp-tokens`,
    executor,
};
export default job;