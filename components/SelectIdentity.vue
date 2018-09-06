<template lang="pug">
  div(:class="b()")
    div(v-if='!identity')
      h3(:class="b('label')") Select Account:
      el-button(type='primary' @click='selectIdentity' :disabled='!readyToSelect') With Scatter
    div(v-else)
      h3(:class="b('label')") Selected Account:
      el-form(:inline="true")
        el-form-item(:class="b('item')")
          el-input(:value='identity.name' :disabled='true')
        el-form-item(:class="b('item')")
          el-button(type='danger' @click='forgetIdentity' icon='el-icon-close' :cirle="true")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { State, Action } from "vuex-class";
import { INetworkModel, IScatterIdentity } from "~/types";
import { chooseIdentity, forgetIdentity } from "~/lib/eos-helper";

@Component({
  name: "el-select-identity"
})
export default class SelectIdentity extends Vue {
  @State network: INetworkModel;
  @State chainId: string;
  @State identity: IScatterIdentity;

  @Action setIdentity;

  get readyToSelect(): boolean {
    return !!this.network;
  }

  async selectIdentity() {
    const identity = await chooseIdentity(this.$store.state);
    await this.setIdentity(identity);
    this.$emit("selected", identity);
  }

  async forgetIdentity() {
    await forgetIdentity();
    await this.setIdentity(null);
  }
}
</script>


<style lang="scss">
.el-select-identity {
  &__label {
    margin-top: 0;
  }

  &__item {
    margin-bottom: 0;
  }
}
</style>