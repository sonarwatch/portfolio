export type TableItemRequest = {
  key_type: string;
  value_type: string;
  key: string;
};

export type ViewRequest = {
  function: string;
  type_arguments: string[];
  arguments: string[];
};

export type MoveType = {
  type: string;
  root: string;
  address: string;
  module?: string;
  struct?: string;
  keys?: MoveType[];
};
