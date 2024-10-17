export type ApiResponse = {
  distributions: Distribution[];
  notifications: Notification[];
};

export type Distribution = {
  id: number;
  title: string;
  subtitle: string;
  allocationTimestamp: number;
  availableForSigningDate: number;
  distributionStartTimestamp: number;
  distributionEndTimestamp: number;
  points: number;
  tokens: string;
  merkleTreeRoute: string[];
};

export type Notification = {
  id: string;
  message: string;
  timestamp: number;
  type: string;
  distributionId: number;
};
