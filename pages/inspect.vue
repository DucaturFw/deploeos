<template lang="pug">
    div(:class="b()" v-loading='!eos')
      pre {{ eos }}
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

@Component({
  name: "inspect-page"
})
export default class extends Vue {
  @State identity;
  @State network;
  @State networkEndpoint;
  @State chainId;

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

  contract = {
    account: ""
  };
}
</script>