import EosClass from "~/lib/eos";
import {
  INetworkModel,
  Nullable,
  IStorageState,
  IScatterIdentity
} from "~/types";
import axios from "axios";

export function state(): Nullable<IStorageState> {
  return {
    abi: null,
    wast: null,
    network: null,
    networkEndpoint: null,
    identity: null
  };
}

export class mutations {
  static setNetwork(state: IStorageState, network: INetworkModel) {
    state.network = network;
  }
  static setNetworkEndpoint(state: IStorageState, endpoint: string) {
    state.networkEndpoint = endpoint;
  }

  static setIdentity(state: IStorageState, identity: IScatterIdentity) {
    state.identity = identity;
  }
}

export class actions {
  static async setNetwork({ commit, state }, network: INetworkModel) {
    // get chain id
    commit("setNetwork", network);
    commit(
      "setNetworkEndpoint",
      `${network.protocol}://${network.host}:${network.port}`
    );
    commit("setIdentity", null);
  }
  static async setIdentity({ commit }, identity: IScatterIdentity) {
    commit("setIdentity", identity);
  }
}
