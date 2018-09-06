export type Nullable<T> = { [P in keyof T]: T[P] | null };

export interface IStorageState {
  abi: any;
  wast: Buffer;
  network: INetworkModel;
  networkEndpoint: string;
  identity: IScatterIdentity;
}

export interface IAbiStructField {
  name: string;
  type: string;
}
export interface IAbiStruct {
  name: string;
  base: string;
  fields: IAbiStructField[];
}

export interface IAbiAction {
  name: string;
  type: string;
  ricardian_contract: string;
}

export interface IAbiResponse {
  version: string; //"eosio::abi/1.0",
  types: any[];
  structs: IAbiStruct[];
  actions: IAbiAction[];
  tables: any[];
  ricardian_clauses: any[];
  error_messages: any[];
  abi_extensions: any[];
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
