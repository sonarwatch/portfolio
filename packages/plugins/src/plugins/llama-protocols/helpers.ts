import {
  LlamaProtocol,
  LlamaProtocolFull,
  NetworkIdType,
  getNetworkByLlamaId,
} from '@sonarwatch/portfolio-core';

export function shrinkLlamaProtocol(
  protocol: LlamaProtocolFull
): LlamaProtocol {
  return {
    id: protocol.id,
    logo: protocol.logo,
    name: protocol.name,
    slug: protocol.slug,
    tvl: protocol.tvl,
    url: protocol.url,
    deadUrl: protocol.deadUrl,
    openSource: protocol.openSource,
    rugged: protocol.rugged,
    twitter: protocol.twitter
      ? `https://twitter.com/${protocol.twitter}`
      : undefined,
    networkIds: llamaChainsToNetworkIds(protocol.chains),
    categories: [protocol.category],
  };
}

export function llamaChainsToNetworkIds(
  llamaChains: string[]
): NetworkIdType[] {
  const networkIds = llamaChains.reduce((acc: NetworkIdType[], chain) => {
    const network = getNetworkByLlamaId(chain);
    if (!network) return acc;
    acc.push(network.id);
    return acc;
  }, []);
  return [...new Set(networkIds)];
}
