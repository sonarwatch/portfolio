export type Games = {
  game: string;
  claimable: number;
  locked: number;
  token: string;
  mint: string;
  end: number;
  sponsors: {
    name: string;
    claimable: number;
    token: string;
  }[];
}[];
