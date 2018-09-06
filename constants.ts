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
    host: "jungle.eosio.cr",
    port: 443,
    protocol: "https",
    // host: "jungle.crytolions.io",
    // port: 18888,
    // protocol: "http",
    blockchain: "eos",
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
  },
  {
    id: "2",
    name: "Localnet",
    host: "0.0.0.0",
    port: 8888,
    protocol: "http",
    blockchain: "eos",
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
  }
];

// http://jungle.cryptolions.io:18888
// http://dev.cryptolions.io:38888
// http://193.93.219.219:8888
// http://dev03.cryptolions.io:8890
// https://jungle.eosio.cr:443
// http://jungle.eosbcn.com:8080
// http://jungle.eosblocksmith.io:8888
// http://jungle.cryptolions.io:18888
// http://35.231.85.248:8888
// http://dev.cryptolions.io:18888
// https://test.api.franceos.fr:443
// http://bp4-d3.eos42.io:8888
// http://157.238.216.100:8888
// http://52.199.125.75:8888
// http://testnet.blockgenesys.com:28888
// http://jungle.eosmeso.io:8888
// http://167.99.91.77:8888
// http://156.38.165.130:8888
// http://149.202.165.174:18888
// http://zztl1.f3322.net:6868
// https://api.jungle.alohaeos.com:443
// http://47.94.203.45:8888
// http://193.93.219.219:8888
// http://5.189.151.46:40000
// http://88.99.193.44:8888
// http://41.161.77.154:8888
// http://203.104.181.223:8888
// http://13.124.155.119:8888
// http://35.196.71.81:8888
// http://18.136.124.100:8888
// http://18.191.240.42:8888
// http://18.136.124.100:8888
// http://18.136.124.100:8888
// http://52.88.191.27:8888
// http://185.110.173.240:8888
// http://185.110.173.240:8888
// http://jm1234.ddns.net:8888
// http://51.15.102.211:8888
// http://178.62.123.10:8888
// http://182.161.39.5:8888
// http://178.62.123.10:8888
// http://176.9.154.84:8888
