import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, programIdLookupTable } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { BN, Idl } from "@coral-xyz/anchor";
import idl from "./idl.json";
import * as anchor from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

const q64 = 2 ** 64;

interface MarginPosition {
  balance: number;
}

interface AmmPosition {
  liquidity: number;
  tickLowerIndex: number;
  tickUpperIndex: number;
  ammpool: PublicKey;
}

interface Pool {
  sqrtPrice: number;
}

function tickToSqrtP(t: number): number {
  return (1.0001 ** (t / 2)) * q64;
}

function getTokenAmountsFromLiquidity(
  liquidity: number, 
  currentSqrtPrice: number, 
  lowerSqrtPrice: number, 
  upperSqrtPrice: number, 
  roundUp: boolean
): [number, number] {
  let tokenA: number = 0;
  let tokenB: number = 0;

  if (currentSqrtPrice < lowerSqrtPrice) {
    tokenA = (liquidity * q64 * (upperSqrtPrice - lowerSqrtPrice)) / (lowerSqrtPrice * upperSqrtPrice);
    tokenB = 0;
  } else if (currentSqrtPrice < upperSqrtPrice) {
    tokenA = (liquidity * q64 * (upperSqrtPrice - currentSqrtPrice)) / (currentSqrtPrice * upperSqrtPrice);
    tokenB = (liquidity * (currentSqrtPrice - lowerSqrtPrice)) / q64;
  } else {
    tokenA = 0;
    tokenB = (liquidity * (upperSqrtPrice - lowerSqrtPrice)) / q64;
  }

  return roundUp ? [Math.ceil(tokenA), Math.ceil(tokenB)] : [Math.floor(tokenA), Math.floor(tokenB)];
}

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  let provider = new anchor.AnchorProvider(
    connection,
    new NodeWallet(anchor.web3.Keypair.generate()),
    { commitment: 'confirmed' }
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  
  const lookupTableAccount = (
    await connection.getAddressLookupTable(programIdLookupTable)
  ).value;

  for (let i = 0; i < lookupTableAccount!.state.addresses.length; i++) {
    const programId = lookupTableAccount!.state.addresses[i];
    const program = new anchor.Program(idl as Idl, programId, provider);

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ratex_state")],
      program.programId
    );
    const state = await program.account["state"].fetch(statePda);
    const marketIndexStart = state['marketIndexStart'] as number;

    const [marginMarketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("margin_market"), new BN(marketIndexStart).toArrayLike(Buffer, "le", 4)],
      program.programId
    );
    const marginMarket = await program.account["marginMarket"].fetch(marginMarketPda);
    const mint = marginMarket['mint'] as PublicKey;

    const [userStatsPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_stats"), new PublicKey(owner).toBuffer()],
      programId
    );

    let userStats;
    try {
      userStats = await program.account["userStats"].fetch(userStatsPda);
    } catch (error) {
      continue;
    }

    const numberOfSubAccountsCreated = userStats['numberOfSubAccountsCreated'] as number;

    if (numberOfSubAccountsCreated === 0) {
      continue;
    }

    const userPdas: PublicKey[] = [];
    const lpPdas: PublicKey[] = [];

    for (let subaccountId = 0; subaccountId < numberOfSubAccountsCreated; subaccountId++) {
      const [userPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), new PublicKey(owner).toBuffer(), new BN(subaccountId).toArrayLike(Buffer, "le", 2)],
        programId
      );
      userPdas.push(userPda);

      const [lpPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("lp"), new PublicKey(owner).toBuffer(), new BN(subaccountId).toArrayLike(Buffer, "le", 2)],
        programId
      );
      lpPdas.push(lpPda);
    }

    for (const userPda of userPdas) {
      try {
        const user = await program.account["user"].fetch(userPda);
        const marginPositions: MarginPosition[] = user['marginPositions'] as MarginPosition[];
        const balance = marginPositions[0].balance;
        const element = elementRegistry.addElementMultiple({ label: 'Margin' });
        element.addAsset({ address: mint, amount: balance });
      } catch (error) {
        continue;
      }
    }

    for (const lpPda of lpPdas) {
      try {
        let lpData = await program.account["lp"].fetch(lpPda);
        const ammPosition = lpData['ammPosition'] as AmmPosition;
        const liquidity = ammPosition.liquidity;
        const lowerSqrtPrice = tickToSqrtP(ammPosition.tickLowerIndex);
        const upperSqrtPrice = tickToSqrtP(ammPosition.tickUpperIndex);
        const ammpool = await program.account["yieldMarket"].fetch(ammPosition.ammpool);
        const pool = ammpool['pool'] as Pool;
        const currentSqrtPrice = pool.sqrtPrice;
        const lpMarginDecimals = ammpool['lpMarginDecimals'] as number;
        const lpMarginIndex = ammpool['lpMarginIndex'] as number;
        const oracle = await program.account["oracle"].fetch(ammpool['oracle'] as PublicKey);
        const rate = oracle['rate'] as number;

        const [lpMarginMarketPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("margin_market"), new BN(lpMarginIndex).toArrayLike(Buffer, "le", 4)],
          program.programId
        );
        const lpMarginMarket = await program.account["marginMarket"].fetch(lpMarginMarketPda);
        const lpMarginMarketMint = lpMarginMarket['mint'] as PublicKey;

        const [tokenA, tokenB] = getTokenAmountsFromLiquidity(
          liquidity, 
          currentSqrtPrice, 
          lowerSqrtPrice, 
          upperSqrtPrice, 
          true
        );

        const amount = new BN(lpData['reserveQuoteAmount'] as number).add(new BN(tokenB)).mul(new BN(10 ** lpMarginDecimals)).div(new BN(rate));

        const element = elementRegistry.addElementMultiple({ label: 'LiquidityPool' });
        element.addAsset({ address: lpMarginMarketMint, amount: amount.toNumber() });
      } catch (error) {
        continue;
      }
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;