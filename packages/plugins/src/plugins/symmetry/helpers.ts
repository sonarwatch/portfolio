import { Fund } from './structs';

export function getSymbol(fund: Fund) {
  const symbol = String.fromCharCode.apply(
    null,
    fund.symbol.slice(0, fund.symbolLength)
  );
  return symbol.length !== 0 ? symbol : undefined;
}
