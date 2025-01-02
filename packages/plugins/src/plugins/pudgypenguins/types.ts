export type AirdropResponse = {
  total: number;
  totalUnclaimed: number;
  categories: Category[];
  addresses: string[];
};

export type Category = {
  category: string;
  items: Item[];
  total: number;
};

export type Item = {
  address: string;
  amount: number;
};
