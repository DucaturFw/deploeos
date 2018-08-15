import EosClass from "lib/eos";
import { INetworkModel } from "types";

type Nullable<T> = { [P in keyof T]: T[P] | null };

export interface IStorageState {
  eos: EosClass;
  abi: any;
  wast: Buffer;

  network: INetworkModel;
  selectedIdentity: string;
}

export function state(): Nullable<IStorageState> {
  return {
    eos: null,
    abi: null,
    wast: null,
    network: null,
    selectedIdentity: null
  };
}

export class mutations {
  static setNetwork(state: IStorageState, network: INetworkModel) {
    state.network = network;
  }

  static setIdentity(state: IStorageState, identity: string) {
    state.selectedIdentity = identity;
  }

  static setEos(state: IStorageState, eos: EosClass) {
    state.eos = eos;
  }
}

export class actions {
  static async setNetwork(ctx, network: INetworkModel) {
    console.log(ctx);
  }
}
