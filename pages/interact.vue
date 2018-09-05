<template lang="pug">
    div(:class="b()")
      div(v-if="ready")
        el-card(v-if="!error" v-for="action in actions" shadow="never" style="margin: 15px 0") 
          div(slot="header")
            h3 {{ action.name }}
          el-row(:gutter="20")
            el-col(:span="16")
              el-editor-wrapper(:name="action.name" :type="expand(action.type, customTypes)" @input='data => $set(interact.actions, action.name, data)')
            el-col(:span="8")
              pre {{ interact.actions[action.name] }}
        el-alert(v-else :title="abi && abi.message" type="error")
      el-card(v-else shadow="never")
          div(slot="header")
            h3 Loading ABI
</template>

<style lang="scss">
.interact-page {
}
</style>


<script lang="ts">
import _ from "lodash/fp";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import Async from "~/plugins/async-computed.plugin";
import EditorWrapper from "~/components/editors/EditorWrapper.vue";
import { toDictionary } from "~/utils";
import { getAbi, getEos, getScatter, getAccountName } from "~/lib/eos-helper";
import {
  INetworkModel,
  IScatterIdentity,
  IAbiResponse,
  IAbiStructField,
  IAbiStruct,
  IAbiAction
} from "~/types";
import { isChainType, lookUpBase } from "~/lib/eos-types";

@Component({
  name: "interact-page",
  components: {
    "el-editor-wrapper": EditorWrapper
  }
})
export default class extends Vue {
  @State network: INetworkModel;
  @State identity: IScatterIdentity;

  interact = {
    actions: {}
  };

  @Async(async function() {
    let abi: { abi: IAbiResponse };
    try {
      abi = await getAbi(getAccountName(this.identity), this.network);
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: e.message
      };
    }

    this.interact.actions = toDictionary(
      abi.abi.actions,
      a => a.name,
      _ => ({})
    );

    return abi;
  })
  abi: { abi?: IAbiResponse; status: number; text: string } | null = null;

  get structs() {
    if (this.abi && this.abi.abi && !this.error) {
      return this.abi.abi.structs;
    }
  }

  get actions() {
    if (this.abi && this.abi.abi && !this.error) {
      return this.abi.abi.actions;
    }
  }

  get customTypes() {
    if (this.structs) {
      return toDictionary(
        this.structs,
        x => x.name,
        x =>
          Object.assign({}, x, {
            fields: toDictionary(x.fields, f => f.name, f => f.type)
          })
      );
    }
    return {};
  }

  expand(type: string, customs: any): any {
    try {
      return lookUpBase(type, customs);
    } catch (e) {
      console.error("editor err", e);
      return "error_type_" + type;
    }
  }

  get error() {
    return this.abi && (<any>this.abi).status === 500;
  }

  get ready() {
    return this.abi != null;
  }

  // typeToComponent(type: TypeDef): string[] {
  //   if (typeof type === "string") {
  //     if (typeEditors[type]) {
  //       return [typeEditors[type]];
  //     } else if (chainTypes[type]) {
  //       return this.typeToComponent(chainTypes[type]);
  //     } else if (this.customTypes[type]) {
  //       return this.typeToComponent(this.customTypes[type]);
  //     }
  //     console.log(this.customTypes);

  //     return ["unknown"];
  //   } else {
  //     const base = type.base ? this.typeToComponent(type.base) : [];
  //     const fields = Object.keys(type.fields)
  //       .map(k => type.fields[k])
  //       .map(t => this.typeToComponent(t))
  //       .reduce((acc, val) => acc.concat(val), []);

  //     return [...base, ...fields];
  //   }
  // }

  // actionToEditor(action: IAbiAction): any {
  //   console.log(this.customTypes[action.type]);
  //   // return _.zipObject(['component', 'label'])(this.typeToComponent(action.type), this.customTypes[action.type])
  // }
}

interface IEditorConfiguration {
  component: string;
}
</script>