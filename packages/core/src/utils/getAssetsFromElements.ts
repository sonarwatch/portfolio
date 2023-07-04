import { PortfolioAsset, PortfolioElement } from '../Portfolio';
import { getAssetsFromElement } from './getAssetsFromElement';

export function getAssetsFromElements(
  elements: PortfolioElement[]
): PortfolioAsset[] {
  return elements.map((element) => getAssetsFromElement(element)).flat(1);
}
