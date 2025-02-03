import { PortfolioElementMultiple } from '../Portfolio';
import { getUsdValueSum } from './getUsdValueSum';
import { sortElementMultiple } from './sortPortfolioElement';

export function mergePortfolioElementMultiples(
  elements: PortfolioElementMultiple[]
): PortfolioElementMultiple[] {
  const elementsByTag: Record<string, PortfolioElementMultiple[]> = {};
  elements.forEach((element) => {
    const tag = `${element.networkId}_${element.platformId}_${element.type}_${element.label}_${element.data.ref}_${element.data.link}`;
    if (!elementsByTag[tag]) elementsByTag[tag] = [];
    elementsByTag[tag].push(element);
  });
  return Object.values(elementsByTag).map((elmts) =>
    unsafeMergePortfolioElementMultiples(elmts)
  );
}

function unsafeMergePortfolioElementMultiples(
  elements: PortfolioElementMultiple[]
): PortfolioElementMultiple {
  const element = {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    networkId: elements.at(0)!.networkId,
    platformId: elements.at(0)!.platformId,
    type: elements.at(0)!.type,
    label: elements.at(0)!.label,
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    value: getUsdValueSum(elements.map((e) => e.value)),
    data: {
      assets: elements.map((e) => e.data.assets).flat(1),
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      ref: elements.at(0)!.data.ref,
      sourceRefs: elements.at(0)!.data.sourceRefs,
      link: elements.at(0)!.data.link,
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    },
  };
  return sortElementMultiple(element);
}
