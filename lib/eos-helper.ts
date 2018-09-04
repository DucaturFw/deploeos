import * as Eos from "eosjs";
import { IStorageState, INetworkModel } from "~/types";

export type Scatter = any;

declare global {
  interface Window {
    scatter: Scatter;
  }
}
export type IEosHelperContext = any;
export type IScatterIdentity = any;
export type Name = string;
export interface IEosOutput {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
}
export async function getScatter(): Promise<Scatter> {
  if (window.scatter) {
    return window.scatter;
  }

  return new Promise<Scatter>(resolve => {
    function loop(immediately?: boolean) {
      if (!immediately) {
        return setTimeout(() => loop(true), 300);
      }

      if (window.scatter) {
        return resolve(window.scatter);
      } else {
        loop();
      }
    }

    loop(true);
  });
}

export async function getEos(network: INetworkModel, output?: IEosOutput) {
  const scatter = await getScatter();
  const eosOptions = {
    expireInSeconds: 60
  };
  if (output) {
    eosOptions["logger"] = output;
  }
  const eos = scatter.eos(network, Eos, eosOptions);
  return { eos: eos as Eos.EosInstance };
}

export async function getAbi(
  account: Name,
  network: INetworkModel,
  output?: IEosOutput
) {
  const { eos } = await getEos(network, output);
  return eos.getAbi({
    account_name: account
  });
}

export async function forgetIdentity() {
  const scatter = await getScatter();

  if (scatter.identity) {
    return scatter.forgetIdentity();
  }
}

export async function chooseIdentity(state: IStorageState) {
  const scatter = await getScatter();
  scatter.requireVersion(5.0);

  await forgetIdentity();
  await scatter.suggestNetwork(state.network);
  return scatter.getIdentity({ accounts: [state.network] });
}

// export async function setChainId() {
//     if (!this.configEosDapp.chainId) {
//       console.log("Begin ask chain id");
//       axios
//         .get(this.url + "/v1/chain/get_info")
//         .then(result => {
//           if (result.status === 200) {
//             this.network.chainId = result.data.chain_id;
//             this.configEosDapp.chainId = result.data.chain_id;

//             console.log("return chain id " + result.data.chain_id);
//             resolve();
//           }
//         })
//         .catch(error => reject(error));
//     } else {
//       return resolve();
//     }
//   });
// }

export function getAccountName(identity: IScatterIdentity): Name {
  if (
    identity.accounts &&
    Array.isArray(identity.accounts) &&
    identity.accounts.length > 0
  ) {
    return identity.accounts[0].name;
  } else {
    throw Error("Account not found!");
  }
}

// export async function forgetIdentity() {
//   const scatter = await this.getScatter();
//   return scatter.forgetIdentity();
// }

// export async function chooseIdentity() {
//   const scatter = await this.getScatter();
//   scatter.requireVersion(5.0);

// }
