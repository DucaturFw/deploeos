<template lang="pug">
  el-card(:class="b()" shadow="hover")
    div(slot="header" class="clearfix") 
      span(:class="b('name')") {{ name }}
      span(v-if="base" :class="b('type')" style="float: right") {{ type }}
    component(v-if="base" :class="b('editor')" :is="knownType.component" v-bind="knownType.config" @input="onInput")
    div(v-else-if="nested")
      el-editor-wrapper(v-for="(childType, childName) in type" :type="childType" :name="childName" @input="data => onNested(childName, data)")
    div(v-else-if="array")
      el-editor-wrapper(:type="type[0]" :name="name" @input="data => onNested('0', data)")
    //- div(v-if="defaultType")
      el-input(v-model='value')
      //- pre {{ customs }}
    //- div(v-else)
      //- div(v-for="(editor, name) in expand")
      //-   span {{editor}} - {{name}}
</template>


<script lang="ts">
import { Component, Vue, Prop, Emit } from "nuxt-property-decorator";
import { State, Action } from "vuex-class";
import { TypeDef, knownTypes } from "~/lib/eos-types";

@Component({
  name: "el-editor-wrapper",
  async mounted() {
    if (this.base) {
      const def = await this.knownType.default(this.type, this.name);
      const normalized = await this.knownType.normalize(
        def,
        this.type,
        this.name
      );
      this.$emit("input", normalized);
    }
  }
})
export default class EditorWrapper extends Vue {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: TypeDef;

  value: any = {};

  onNested(key: string, newValue: any) {
    console.log(key, newValue);
    this.$set(this.value, key, newValue);
    this.$emit("input", this.value);
  }

  async onInput(newValue) {
    this.value = newValue;
    const normalized = await this.knownType.normalize(newValue);
    console.assert(await this.knownType.validation(normalized));
    this.$emit("input", normalized);
  }

  get knownType() {
    if (this.base) {
      return knownTypes[this.type as string];
    } else {
      throw new Error("Unknown type");
    }
  }

  get base(): boolean {
    return typeof this.type === "string";
  }

  get array(): boolean {
    return Array.isArray(this.type);
  }

  get nested(): boolean {
    return typeof this.type === "object";
  }
}
</script>
