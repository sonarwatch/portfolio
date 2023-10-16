import BigNumber from "bignumber.js";
import { CoinTypeMetadata } from "./coin";

export type UserLending = {
    coinType: string;
    amount: BigNumber;
};

export type UserObligations = {
    [T in string]: {
        collaterals: {[K in string]: number},
        debts: {[K in string]: number}
    }
}

export type Pools = {
    [T in string]: CoinTypeMetadata
}