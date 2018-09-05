import { INetworkModel } from "./types";
export const NETWORKS: INetworkModel[] = [
  {
    id: "0",
    name: "Mainnet EOSIO",
    host: "nodes.get-scatter.com",
    port: 443,
    protocol: "https",
    blockchain: "eos",
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
  },
  {
    id: "1",
    name: "Testnet EOSIO (Jungle)",
    host: "jungle.eos.smartz.io",
    port: 443,
    protocol: "https",
    // host: "jungle.crytolions.io",
    // port: 18888,
    // protocol: "http",
    blockchain: "eos",
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
  }
];
