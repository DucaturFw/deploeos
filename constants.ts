import { INetworkModel } from "./types";
export const NETWORKS: INetworkModel[] = [
  {
    id: "0",
    name: "Mainnet EOSIO",
    host: "nodes.get-scatter.com",
    port: 443,
    protocol: "https",
    blockchain: "eos"
  },
  {
    id: "1",
    name: "Testnet EOSIO (Jungle)",
    host: "jungle.eos.smartz.io",
    port: 443,
    protocol: "https",
    blockchain: "eos"
  }
];
