import {
  PortfolioElementLabel,
  PortfolioElementTypeType,
} from '@sonarwatch/portfolio-core';

export type ElementParams = {
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
  platformId?: string;
};
