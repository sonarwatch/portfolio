import BigNumber from "bignumber.js";
import { CoinTypeMetadata } from "./coin";

export type UserLending = {
    coinType: string;
    amount: BigNumber;
};

export type UserObligations = {
    [T in string]: {
        collaterals: {[K in string]: BigNumber},
        debts: {[K in string]: BigNumber}
    }
}

export type UserStakeAccounts = {
    [T in string]: { points: string, index: string, stakes: string }[];
}

export type Pools = {
    [T in string]: CoinTypeMetadata
}
