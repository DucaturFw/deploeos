import * as Eos from "eosjs";
import axios from "axios";
import _ from "lodash";

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    scatter: any;
  }
}

export interface IEosOptions {
  port: number;
  host: string;
  blockchain: string;
  protocol: string;
}

export const getFuncType = (func: any): any => {
  if (func.constant && func.inputs.minItems === 0) {
    return "view";
  }

  if (func.constant && func.inputs.minItems !== 0) {
    return "ask";
  }

  if (!func.constant) {
    return "write";
  }

  return null;
};

export default class EosClass {
  private network: any;
  private configEosDapp: any;
  private eos: any;
  private identity: any;
  private accountName: any;
  private url: string;

  public scatter: any = window.scatter;
  public currentIdentity: any;

  constructor(options: IEosOptions) {
    document.addEventListener("scatterLoaded", scatterExtension => {
      this.scatter = window.scatter;
    });
    this.scatter = window.scatter;
    this.identity = null;
    this.eos = null;
    this.currentIdentity = null;
    this.identity = null;
    this.accountName = null;
    this.network = {
      port: options.port,
      host: options.host,
      blockchain: options.blockchain,
      protocol: options.protocol
    };
    this.url = `${this.network.protocol}://${this.network.host}:${
      this.network.port
    }`;

    this.configEosDapp = {};

    this.sendTransaction = this.sendTransaction.bind(this);
    this.getAccountName = this.getAccountName.bind(this);
    this.setChainId = this.setChainId.bind(this);
    this.executeFunc = this.executeFunc.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
  }

  public setChainId() {
    return new Promise((resolve, reject) => {
      if (!this.configEosDapp.chainId) {
        console.log("Begin ask chain id");
        axios
          .get(this.url + "/v1/chain/get_info")
          .then(result => {
            if (result.status === 200) {
              this.network.chainId = result.data.chain_id;
              this.configEosDapp.chainId = result.data.chain_id;

              console.log("return chain id " + result.data.chain_id);
              resolve();
            }
          })
          .catch(error => reject(error));
      } else {
        return resolve();
      }
    });
  }

  public getAccountName(identity) {
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

  public forgetIdentity() {
    return new Promise(resolve => {
      if (this.scatter.identity)
        this.scatter.forgetIdentity().then(() => resolve());
      else resolve();
    });
  }

  public chooseIdentity() {
    this.scatter.requireVersion(5.0);

    return (
      this.setChainId()
        // accept current network
        .then(() => this.forgetIdentity())
        .then(() => this.scatter.suggestNetwork(this.network))
        .then(() => this.scatter.getIdentity({ accounts: [this.network] }))
    );
  }

  public initiatePower = (bytes: number, cpu: number, net: number) => {
    return this.setChainId()
      .then(() => this.forgetIdentity())
      .then(() => this.scatter.suggestNetwork(this.network))
      .then(() => this.scatter.getIdentity({ accounts: [this.network] }))
      .then(identity => {
        return this.scatter
          .eos(this.network, Eos, this.configEosDapp, this.network.protocol)
          .transaction(tr => {
            tr.buyrambytes({
              payer: this.getAccountName(identity),
              receiver: this.getAccountName(identity),
              bytes: bytes
            });

            tr.delegatebw({
              from: this.getAccountName(identity),
              receiver: this.getAccountName(identity),
              stake_net_quantity: `${cpu.toFixed(4)} EOS`,
              stake_cpu_quantity: `${cpu.toFixed(4)} EOS`,
              transfer: 0
            });
          });
      });
  };

  public deployContract = (bin: string, abi: any) => {
    this.scatter.requireVersion(5.0);

    return (
      this.setChainId()
        // accept current network
        .then(() => this.forgetIdentity())
        .then(() => {
          console.log(this.network);
          return this.scatter.suggestNetwork(this.network);
        })
        .then(() => this.scatter.getIdentity({ accounts: [this.network] }))
        .then(identity => {
          this.currentIdentity = identity;
          this.accountName = this.getAccountName(identity);

          // send smart-contract code
          return this.scatter
            .eos(this.network, Eos, this.configEosDapp, this.network.protocol)
            .setcode(this.accountName, 0, 0, bin);
        })
        .catch(e => console.log(e))
        .then(() => {
          // send smart-contract abi
          return this.scatter
            .eos(this.network, Eos, this.configEosDapp, this.network.protocol)
            .setabi(this.accountName, abi);
        })
    );
  };

  public setPermissions = (permissions: any) => {
    this.scatter.requireVersion(5.0);

    return (
      this.setChainId()
        // accept current network
        .then(() => this.forgetIdentity())
        .then(() => this.scatter.suggestNetwork(this.network))
        .then(() => this.scatter.getIdentity({ accounts: [this.network] }))
        .then(identity => {
          this.currentIdentity = identity;
          this.accountName = this.getAccountName(identity);

          // obtain current permissions
          return this.scatter
            .eos(this.network, Eos, this.configEosDapp, this.network.protocol)
            .getAccount({ account_name: this.accountName });
        })
        .then(account => {
          let perms = permissions.map((p: any) => {
            return {
              permission: {
                actor: !p.actor ? this.accountName : p.actor,
                permission: p.name
              },
              weight: 1
            };
          });

          let payload = {
            parent: "owner",
            permission: "active",
            account: this.accountName,
            auth: account.permissions[0].required_auth
          };

          let hasPermission = (perm: any) => {
            for (let i = 0; i < payload.auth.accounts.length; ++i) {
              if (
                payload.auth.accounts[i].permission.actor ===
                  perm.permission.actor &&
                payload.auth.accounts[i].permission.permission ===
                  perm.permission.permission
              )
                return true;
            }
            return false;
          };

          let needUpdate = false;
          perms.forEach((perm: any) => {
            if (!hasPermission(perm)) {
              payload.auth.accounts.push(perm);
              needUpdate = true;
            }
          });

          if (!needUpdate) return Promise.resolve();

          return this.scatter
            .eos(this.network, Eos, this.configEosDapp, this.network.protocol)
            .transaction("eosio", system => {
              system.updateauth(payload, { authorization: this.accountName });
            });
        })
    );
  };

  public getIdentity() {
    return this.scatter.getIdentity({ accounts: [this.network] });
  }

  public sendTransaction(address: any, func: any, formData: any) {
    return new Promise((resolve, reject) => {
      this.setChainId()
        .then(() => this.forgetIdentity())
        .then(() => this.scatter.suggestNetwork(this.network))
        .then(() => this.scatter.getIdentity({ accounts: [this.network] }))
        .then(identity => {
          this.currentIdentity = identity;

          let accountName = this.getAccountName(identity);

          this.eos = this.scatter.eos(this.network, Eos, this.configEosDapp);

          return this.eos.transaction(address, contract => {
            contract[func.name](...formData, { authorization: accountName });
          });
        })
        .then(result => {
          resolve({
            result,
            func,
            formData
          });
        })
        .catch(error => reject(error));
    });
  }

  public readTable(address: any, tableKey: any, func: any, formData: any) {
    return new Promise((resolve, reject) => {
      this.setChainId()
        .then(() => {
          this.eos = this.scatter.eos(this.network, Eos, this.configEosDapp);

          return this.eos.getTableRows({
            json: true,
            code: address,
            scope: address,
            table: func.name,
            table_key: tableKey,
            lower_bound: formData[0],
            limit: 1
          });
        })
        .then(result => {
          resolve({
            result,
            func,
            formData
          });
        })
        .catch(error => reject(error));
    });
  }

  public executeFunc(abi: any, func: any, address: any, formData: any) {
    return new Promise((resolve, reject) => {
      switch (getFuncType(func)) {
        case "write":
          this.sendTransaction(address, func, formData)
            .then(() => resolve("success"))
            .catch(error => reject(error));
          break;
        case "ask":
          const table = <any>_.find(abi.tables, { name: func.name });
          const tableKey = table.key_names[0];

          this.readTable(address, tableKey, func, formData)
            .then((data: any) => {
              const rows = data.result.rows;

              let result =
                rows.length > 0 &&
                data.formData[0].toString() === rows[0][tableKey].toString()
                  ? data.result.rows[0]
                  : "Not found";

              let strString = JSON.stringify(result);
              strString = strString.substr(1, strString.length - 2);

              resolve(strString);
            })
            .catch(error => reject(error));
          break;
        case "view":
          return null;
        default:
          break;
      }
    });
  }
}
