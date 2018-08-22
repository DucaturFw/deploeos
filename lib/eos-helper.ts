import { IStorageState } from "~/types";

export type Scatter = any;

declare global {
  interface Window {
    scatter: Scatter;
  }
}
export type IEosHelperContext = any;
export type IScatterIdentity = any;
export type Name = string;

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
