<template lang="pug">
  div(:class="b()")
    h3(:class="b('label')") Selected Network:
    el-select(:class="b('select')" v-model='selectedNetwork' placeholder='Select or add')
      el-option(v-for="net in networks" :key="net.id" :label="net.name" :value="net.id")
</template>

<script lang="ts">
import { INetworkModel } from "~/types";
import { NETWORKS } from "~/constants";
import { Component, Vue } from "nuxt-property-decorator";
import { Action, State } from "vuex-class";

@Component({
  name: "el-select-network"
})
export default class SelectNetwork extends Vue {
  @State network: INetworkModel;
  @Action setNetwork;
  networks: INetworkModel[] = NETWORKS;
  networkId: string = "";

  get selectedNetwork() {
    return this.network ? this.network.id : "";
  }

  set selectedNetwork(id) {
    const network = this.networks[parseInt(id)];
    this.setNetwork(network);
    this.$emit("selected", network);
  }
}
</script>

<style lang="scss">
.el-select-network {
  &__label {
    margin-top: 0;
  }
}
</style>


