<template lang="pug">
    div(:class="b()" v-loading='!eos')
      div 
      //- el-form(:model='contract' label-width="120px")
      //-   el-form-item(label='Contract account')
      //-     el-input(v-model='contract.account')
</template>

<style lang="scss">
.inspect-page {
}
</style>


<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import Eos, { EosInstance } from "eosjs";
import { getAccountName } from "~/lib/eos-helper";

@Component({
  name: "inspect-page",
  watch: {
    network: "loadAccount",
    identity: "loadAccount"
  }
})
export default class extends Vue {
  @State identity;
  @State network;
  @State networkEndpoint;
  @State chainId;

  _account: any = null;

  get account(): any {
    if (this._account) {
      return this._account;
    } else {
      return "Loading...";
    }
  }

  get eos(): EosInstance | null {
    if (this.network && this.networkEndpoint) {
      return Eos({
        httpEndpoint: this.networkEndpoint,
        chainId: this.network.chainId
      });
    } else {
      return null;
    }
  }

  get ready() {
    return this.network && this.eos && this.identity;
  }

  async loadAccount() {
    if (!this.ready) {
      return;
    }

    const acc = await this.eos!.getAccount({
      account_name: getAccountName(this.identity)
    });

    this._account = acc;
  }

  contract = {
    account: ""
  };
}
</script>