<template lang="pug">
    div(:class="b()")
      div(v-if="ready")
        pre(v-if="!error") 
          ul
            li(v-for="action in actions") 
              h3 {{ action.name }}
              p(v-if="action.ricardian_contract") {{ action.ricardian_contract }}
              el-form(:model='interact.actions[action.name]' label-width="240px")
                el-editor-wrapper(:name="action.name" :type="action.type" :customs="customTypes")
                //- div(v-for="(type, name) in customTypes[action.type].fields")
                //-   el-form-item(v-for="editor in typeToComponent(type)" :label='name')
                //-     component(:is="editor")
                //-   //- el-input(v-model='contract.account')
              //- div() {{ name }}: {{ type }}
          //- ul
          //-   li(v-for="struct in structs")
          //-     h3 {{struct.name}}
          //-     div(v-for="field in struct.fields" style="margin-bottom: 20px") 
          //-       div {{field.name}}
          //-       div {{field.type}}
                component(v-for="editor in typeToComponent(field.type)" :is="editor")
        el-alert(v-else :title="abi.message" type="error")
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
import { getAbi, getEos, getScatter, getAccountName } from "~/lib/eos-helper";
import {
  INetworkModel,
  IScatterIdentity,
  IAbiResponse,
  IAbiStructField,
  IAbiStruct,
  IAbiAction
} from "~/types";

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
    try {
      const { eos } = await getEos(this.network);
      return await eos.getAbi({
        account_name: getAccountName(this.identity)
      });
    } catch (e) {
      return {
        status: 500,
        message: e.message
      };
    }
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
      const reduce = <T, V>(
        arr: T[],
        key: (obj: T) => string,
        val: (obj: T) => V
      ) =>
        arr.reduce((acc, cur) => ((acc[key(cur)] = val(cur)), acc), {} as {
          [key: string]: V;
        });

      return reduce(
        this.structs,
        x => x.name,
        x =>
          Object.assign({}, x, {
            fields: reduce(x.fields, f => f.name, f => f.type)
          })
      );
    }
    return {};
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