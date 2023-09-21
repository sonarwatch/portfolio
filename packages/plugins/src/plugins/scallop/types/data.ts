import BigNumber from "bignumber.js";
import { CoinTypeMetadata } from "./coin";

export type UserLending = {
    coinType: string;
    amount: BigNumber;
};

export type Pools = {
    [T in string]: CoinTypeMetadata
}