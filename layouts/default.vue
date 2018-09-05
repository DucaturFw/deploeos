<template lang="pug">
  section(:class="b()")
    link(href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,800&amp;subset=cyrillic" rel="stylesheet")
    div(:class="b('header')")
      h1(:class="b('brand')") Deploeos
      select-network(:class="b('network')")
      select-identity(:class="b('identity')")

    el-menu.el-menu-demo(:class='b("menu")' mode="horizontal" :router="true" v-if='ready')
      el-menu-item(index='deploy' :route="{ path: '/' }") Deploy
      el-menu-item(index='interact' :route="{ path: '/interact' }") Interact
      el-menu-item(index='inspect' :route="{ path: '/inspect' }") Inspect Identity

    nuxt(:class="b('content')" v-if='ready')
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State, Action } from "vuex-class";
import { setInterval } from "timers";

import SelectNetwork from "~/components/SelectNetwork.vue";
import SelectIdentity from "~/components/SelectIdentity.vue";
import { INetworkModel, IScatterIdentity } from "types";

@Component({
  name: "default-layout",
  components: {
    SelectIdentity,
    SelectNetwork
  }
})
export default class extends Vue {
  @State identity: IScatterIdentity;
  @State network: INetworkModel;

  get ready() {
    return !!this.identity && !!this.network;
  }
}
</script>


<style lang="scss">
body {
  font-family: "Montserrat", sans-serif;
}

.default-layout {
  max-width: 1400px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 40px;
  min-height: 100vh;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

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
    width: 100%;
  }

  &__menu {
    width: 100%;
  }

  &__network {
    margin-right: 25px;
  }

  &__content {
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    padding-bottom: 80px;
  }
}
</style>