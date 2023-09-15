import { SuiObjectData, getObjectFields, getObjectType, normalizeStructTag, parseStructTag } from "@mysten/sui.js";
import BigNumber from "bignumber.js";
import { CoinTypeMetadata, UserLending } from "./types";

export function getLending(ownedMarketCoins: SuiObjectData[], lendingRate: { [T in string]: number }, coinTypeMetadata: { [T in string]: CoinTypeMetadata }) {
    const userMarketCoins: { [key: string]: {coinType: string, amount: BigNumber} } = {};
    const userStakedAccount: { [T in string]: { coinType: string, staked: BigNumber }[] } = {};
    const getValue = Object.values(coinTypeMetadata);
    for (const ownedMarketCoin of ownedMarketCoins) {
        const objType = getObjectType(ownedMarketCoin);
        if (!objType) continue;
        const parsed = parseStructTag(objType);
        const coinType = objType.substring(objType.indexOf('MarketCoin<') + 11, objType.indexOf('>'));
        const fields = getObjectFields(ownedMarketCoin);
        const coinName = getValue.find((value) => value.coinType === normalizeStructTag(coinType))?.metadata?.symbol.toLowerCase();
        if(!coinName || !fields) continue;

        if (parsed.name === 'Coin') {
            const balance = new BigNumber(fields?.['balance'] ?? 0);
            if(!userMarketCoins[coinName]) {
                userMarketCoins[coinName] = {coinType: normalizeStructTag(coinType), amount: new BigNumber(0)};
            }
            userMarketCoins[coinName] = {...userMarketCoins[coinName], amount: userMarketCoins[coinName].amount.plus(balance)}
        }
        if (parsed.name === 'SpoolAccount') {
            if (!userStakedAccount[coinName]) {
                userStakedAccount[coinName] = [];
            }

            userStakedAccount[coinName].push({
                coinType,
                staked: new BigNumber(fields['stakes'])
            })
        }
    }
    const userLending: { [T in string]: UserLending } = {};
    for (const coinName of Object.keys(userMarketCoins)) {
        const lendingAmount = userMarketCoins[coinName].amount.multipliedBy(lendingRate[coinName]);
        userLending[coinName] = {
            coinType: userMarketCoins[coinName].coinType,
            amount: lendingAmount.dividedBy(10 ** (coinTypeMetadata[coinName]?.metadata?.decimals ?? 0)).toNumber()
        }
    }
    for (const coinName of Object.keys(userStakedAccount)) {
        const stakeAccountList = userStakedAccount[coinName] ?? [];
        const totalStaked = (stakeAccountList.reduce((prev, curr) => prev.plus(curr.staked), new BigNumber(0))).multipliedBy(lendingRate[coinName]);
        userLending[coinName] = {...userLending[coinName], amount: userLending[coinName].amount + (totalStaked.dividedBy(10 ** (coinTypeMetadata[coinName]?.metadata?.decimals ?? 0)).toNumber())}
    }
    return userLending;
}