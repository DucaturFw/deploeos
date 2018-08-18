export type Nullable<T> = { [P in keyof T]: T[P] | null };

export interface IStorageState {
  abi: any;
  wast: Buffer;
  network: INetworkModel;
  networkEndpoint: string;
  identity: IScatterIdentity;
}

export interface INetworkModel {
  id: string;
  name: string;
  host: string;
  port: number;
  blockchain: string;
  protocol: string;
  chainId: string;
}
export interface IScatterAccount {
  authority: string;
  blockchain: string;
  name: string;
}
export interface IScatterIdentity {
  accounts: IScatterAccount[];
  hash: string;
  kyc?: boolean;
  name: string;
  publicKey: string;
}
