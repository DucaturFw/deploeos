<template lang="pug">
  section(:class="b()")
    link(href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,800&amp;subset=cyrillic" rel="stylesheet")
    div(:class="b('header')")
      h1(:class="b('brand')") Deploeos
      select-network(:class="b('network')" @change='onNetworkSelect')
      select-identity(:class="b('identity')" @change='onIdentitySelect')

    el-menu.el-menu-demo(mode="horizontal" :router="true")
      el-menu-item(index='deploy' :route="{ path: '/' }") Deploy
      el-menu-item(index='interact' :route="{ path: '/interact' }") Interact

    div(:class="b('content')")
      nuxt
</template>

<script lang="ts">
import Eos from "~/lib/eos";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { setInterval } from "timers";

import SelectNetwork from "~/components/SelectNetwork.vue";
import SelectIdentity from "~/components/SelectIdentity.vue";
import { INetworkModel } from "types";

@Component({
  name: "default-layout",
  components: {
    SelectIdentity,
    SelectNetwork
  }
})
export default class extends Vue {
  onNetworkSelect(network: INetworkModel) {
    console.log(network);
  }
  onIdentitySelect(identity: any) {
    console.log(identity);
  }
}
</script>


<style lang="scss">
body {
  font-family: "Montserrat", sans-serif;
}

.default-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;

  &__brand {
    text-transform: uppercase;
    font-size: 64px;
    margin: 0;
    margin-right: auto;
    font-weight: 800;
    letter-spacing: -0.065em;
  }

  &__header {
    padding: 50px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__network {
    margin-right: 25px;
  }

  &__content {
    padding: 50px 0;
  }
}
</style>