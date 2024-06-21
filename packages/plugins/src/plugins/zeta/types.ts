export type GQLResponse = {
  getAirdropFinalFrontend: GetAirdropFinalFrontend;
};

export type GetAirdropFinalFrontend = {
  authority: string;
  community_allocation: number;
  eligibility: string;
  main_allocation: number;
  og_allocation: number;
  s1_allocation: number;
  s2_allocation: number;
  total_allocation: number;
  __typename: string;
};
