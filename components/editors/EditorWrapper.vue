<template lang="pug">
  div(:class="b()")
    div {{ name }} {{ type }} {{ wrapper }}
    div(v-if="!wrapper")
      el-input(v-model='value')
      //- pre {{ customs }}
    div(v-else)
      span nested
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { State, Action } from "vuex-class";
import { isChainType } from "~/lib/eos-types";
// import { INetworkModel, IScatterIdentity } from "~/types";
// import { chooseIdentity, forgetIdentity } from "~/lib/eos-helper";

@Component({
  name: "el-editor-wrapper"
})
export default class EditorWrapper extends Vue {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: () => ({}) })
  customs: {
    [key: string]: {
      base?: string;
      fields: {
        [name: string]: string;
      };
    };
  };

  value: any = null;

  get wrapper() {
    return !isChainType(this.type);
  }
}
</script>
