export type BanxResponse = {
  data: Data;
};

export type Data = {
  banxWalletBalance: string;
  banxTokenStake: BanxTokenStake;
  banxAdventures: BanxAdventure[];
};

export type BanxAdventure = {
  adventure: Adventure;
  adventureSubscription: AdventureSubscription;
};

export type Adventure = {
  publicKey: string;
  adventureState: string;
  amountOfTokensHarvested: string;
  isRemoved: boolean;
  periodEndingAt: string;
  periodStartedAt: string;
  placeholderOne: string;
  rewardsToBeDistributed: string;
  tokensPerPoints: string;
  totalBanxSubscribed: string;
  totalPartnerPoints: string;
  totalPlayerPoints: string;
  totalTokensStaked: string;
  week: string;
};

export type AdventureSubscription = {
  publicKey: string;
  adventure: string;
  adventureSubscriptionState: string;
  amountOfTokensHarvested: string;
  banxTokenStake: string;
  createdAt: Date;
  harvestedAt: string;
  stakeNftAmount: string;
  stakePartnerPointsAmount: string;
  stakePlayerPointsAmount: string;
  stakeTokensAmount: string;
  subscribedAt: string;
  unsubscribedAt: string;
  updatedAt: Date;
  user: string;
};

export type BanxTokenStake = {
  _id: string;
  publicKey: string;
  adventureSubscriptionsQuantity: string;
  banxNftsStakedQuantity: string;
  banxStakeState: string;
  createdAt: Date;
  farmedAmount: string;
  isRemoved: boolean;
  nftsStakedAt: string;
  nftsUnstakedAt: string;
  partnerPointsStaked: string;
  placeholderOne: string;
  playerPointsStaked: string;
  stakedAt: string;
  tokensStaked: string;
  unstakedAt: string;
  updatedAt: Date;
  user: string;
};
