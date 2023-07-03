export type RpcEndpoint = {
  url: string;
  basicAuth?: {
    username: string;
    password: string;
  };
};
