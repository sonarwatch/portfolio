import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import pricingJob from './pricingJob';
import ondemandPricingJob from './onDemandPricingJob';

export const jobs: Job[] = [pricingJob, ondemandPricingJob];
export const fetchers: Fetcher[] = [];
