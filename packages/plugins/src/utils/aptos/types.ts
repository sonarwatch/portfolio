export type MoveType = {
  type: string;
  root: string;
  address: string;
  module?: string;
  struct?: string;
  keys?: MoveType[];
};
