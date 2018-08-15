<template lang="pug">
  div(:class="b()")
    h3(:class="b('label')") Selected Network:
    el-select(:class="b('select')" v-model='network')
      el-option(v-for="net in networks" :key="net.id" :label="net.name" :value="net.id")
</template>

<script lang="ts">
import { INetworkModel } from "~/types";
import { NETWORKS } from "~/constants";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "el-select-network"
})
export default class SelectNetwork extends Vue {
  networks: INetworkModel[] = NETWORKS;
  network: string = "0";
}
</script>

<style lang="scss">
.el-select-network {
  &__label {
    margin-top: 0;
  }
}
</style>


