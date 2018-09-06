import Eos, { EosInstance, IPermission } from "eosjs";
import { IStorageState, INetworkModel, IAbiResponse } from "~/types";

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

export async function getEos(
  network: INetworkModel,
  output?: IEosOutput
): Promise<{ eos: EosInstance }> {
  const scatter = await getScatter();
  const eosOptions = {
    expireInSeconds: 60
  };
  if (output) {
    eosOptions["logger"] = output;
  }
  const eos = scatter.eos(network, Eos, eosOptions);
  return { eos: eos as EosInstance };
}

export async function getAbi(
  account: Name,
  network: INetworkModel,
  output?: IEosOutput
): Promise<{ abi: IAbiResponse }> {
  const { eos } = await getEos(network, output);
  return eos.getAbi({
    account_name: account
  }) as Promise<{ abi: IAbiResponse }>;
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

export function getAccountName(
  identity: IScatterIdentity,
  permission: boolean = false
): Name {
  if (
    identity.accounts &&
    Array.isArray(identity.accounts) &&
    identity.accounts.length > 0
  ) {
    return (
      identity.accounts[0].name +
      (permission ? `@${identity.accounts[0].authority}` : "")
    );
  } else {
    throw Error("Account not found!");
  }
}

export async function sendTransaction(
  address: Name,
  action: string,
  formData: any,
  identity: IScatterIdentity,
  network: INetworkModel
) {
  let accountName = getAccountName(identity);
  let { eos } = await getEos(network);
  const result = await (<any>eos).transaction(address, contract => {
    contract[action](formData, { authorization: accountName });
  });

  return {
    result,
    formData,
    action
  };
}

export async function deployContract(
  network: INetworkModel,
  identity: IScatterIdentity,
  bin: Buffer,
  abi: any
) {
  const { eos } = await getEos(network);

  const setcode = await eos.setcode({
    account: getAccountName(identity),
    vmtype: 0,
    vmversion: 0,
    code: bin
  });

  const setabi = await eos.setabi({
    account: getAccountName(identity),
    abi
  });

  return [setcode, setabi];
}
// export async function forgetIdentity() {
//   const scatter = await this.getScatter();
//   return scatter.forgetIdentity();
// }

// export async function chooseIdentity() {
//   const scatter = await this.getScatter();
//   scatter.requireVersion(5.0);

// }

export async function buyRam(
  network: INetworkModel,
  identity: IScatterIdentity,
  bytes: number
) {
  const { eos } = await getEos(network);
  return eos.buyrambytes({
    payer: getAccountName(identity),
    receiver: getAccountName(identity),
    bytes: bytes
  });
}

export async function stakeCpu(
  network: INetworkModel,
  identity: IScatterIdentity,
  value: number
) {
  const { eos } = await getEos(network);
  return eos.delegatebw({
    from: getAccountName(identity),
    receiver: getAccountName(identity),
    stake_net_quantity: "0 EOS",
    stake_cpu_quantity: value.toFixed(4) + " EOS",
    transfer: Math.floor(Math.random() * 100000)
  });
}

export async function stakeNet(
  network: INetworkModel,
  identity: IScatterIdentity,
  value: number
) {
  const { eos } = await getEos(network);
  return eos.delegatebw({
    from: getAccountName(identity),
    receiver: getAccountName(identity),
    stake_net_quantity: value.toFixed(4) + " EOS",
    stake_cpu_quantity: "0 EOS",
    transfer: Math.floor(Math.random() * 100000)
  });
}

export async function updatePermissions(
  network: INetworkModel,
  identity: IScatterIdentity,
  auth: IPermission
) {
  console.log(auth);
  const { eos } = await getEos(network);
  const [actor, permission] = getAccountName(identity, true).split("@");
  return eos.transaction({
    actions: [
      {
        account: "eosio",
        name: "updateauth",
        data: {
          account: actor,
          permission: auth.perm_name,
          parent: auth.parent,
          auth: auth.required_auth
        }, //auth,
        authorization: [
          {
            actor,
            permission
          }
        ]
      }
    ]
  });
}
