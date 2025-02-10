export type AirdropResponse = {
  id: string;
  claimed: number;
  vested: number;
  total: number;
  category: Category;
  timestamps: Timestamp[];
  createdAt: Date;
  order: null;
  description: string;
  isOffChainClaim: boolean;
};

export type Category = {
  id: string;
  name: string;
};

export type Timestamp = {
  timestamp: number;
  amount: number;
};
