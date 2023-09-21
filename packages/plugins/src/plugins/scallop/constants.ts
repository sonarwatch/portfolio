import { Platform } from "@sonarwatch/portfolio-core";

const PROTOCOL_OBJECT_ID = '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf'
export const platformId = 'scallop';
export const addressPrefix = `${platformId}-address`;
export const marketPrefix = `${platformId}-market`;
export const poolsPrefix = `${platformId}-pools`;

export const addressEndpoint = 'https://sui.api.scallop.io/addresses/6462a088a7ace142bb6d7e9b';
export const addressKey = 'scallop-address-key';
export const marketKey = 'scallop-market-key';
export const poolsKey = 'scallop-pools-key';

export const spoolAccountPackageId = `0xe87f1b2d498106a2c61421cec75b7b5c5e348512b0dc263949a0e7a3c256571a::spool_account::SpoolAccount`;
export const marketCoinPackageId = `${PROTOCOL_OBJECT_ID}::reserve::MarketCoin`
export const obligationKeyPackageId = `${PROTOCOL_OBJECT_ID}::obligation::ObligationKey`;

export const scallopPlatform: Platform = {
    id: platformId,
    name: 'Scallop',
    image: `https://alpha.sonar.watch/img/platforms/${platformId}.png`
}
