<template lang="pug">
  el-card(:class="b()" shadow="hover")
    div(slot="header") 
      span {{ name }}
    component(v-if="base" :is="knownTypes[type].component" v-bind="knownTypes[type].config" @input="onInput")
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
  mounted() {
    if (this.base) {
      this.$emit("input", knownTypes[this.type].default(this.type, this.name));
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

  @Emit("input")
  onInput(newValue) {
    this.value = newValue;
    return newValue;
  }

  get knownTypes() {
    return knownTypes;
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
