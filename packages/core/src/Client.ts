export type RpcEndpoint = {
  url: string;
  basicAuth?: {
    username: string;
    password: string;
  };
};

export enum ClientType {
  NORMAL = 'NORMAL',
  FAST_LIMITED = 'FAST_LIMITED'
}
