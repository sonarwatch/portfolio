import { PortfolioElementType, PortfolioElement } from '../Portfolio';
import { getAssetsFromElement } from './getAssetsFromElement';
import { getAddressesFromAssets } from './getAddressesFromAssets';

export function getAddressesFromElement(
  element: PortfolioElement,
  tokenOnly = true
): string[] {
  if (element.type === PortfolioElementType.leverage) {
    return [
      ...((element.data.isolated?.positions
        .map((p) => p.address)
        .filter((v) => v !== undefined) || []) as string[]),
      ...((element.data.cross?.positions
        .map((p) => p.address)
        .filter((v) => v !== undefined) || []) as string[]),
    ];
  }
  const assets = getAssetsFromElement(element);
  return getAddressesFromAssets(assets, tokenOnly);
}
