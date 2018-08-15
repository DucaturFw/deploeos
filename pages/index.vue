<template lang="pug">
    div(:class="b()")
      div(:class="b('upload-row')" v-loading="disabled")
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") ABI File
          el-upload.upload-demo(drag='', 
                                :disabled="disabled"
                                action='/',
                                :before-upload='possibleAbi'
                                ref='upload')
            i.el-icon-upload
            .el-upload__text
              em click to upload
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") WASM File
          el-upload.upload-demo(drag='', 
                                :disabled="disabled"
                                action='/',
                                :before-upload='possibleWasm'
                                ref='upload')
            i.el-icon-upload
            .el-upload__text
              em click to upload

      el-button(type="primary" @click='deploy') Deploy
</template>

<style lang="scss">
.index-page {
  &__upload-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__uploader {
    margin: 20px;
  }
}
</style>


<script lang="ts">
import EosClass from "~/lib/eos";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { INetworkModel } from "types";

@Component({
  name: "index-page"
})
export default class extends Vue {
  @State eos: EosClass;
  @State network: INetworkModel;
  @State identity: string;

  bin: any = null;
  abi: any = {};

  get disabled() {
    return this.network === null || this.identity === null;
  }

  async deploy() {
    if (this.eos) {
      const result = await this.eos.deployContract(this.bin, this.abi);
      console.log(result);
    }
  }

  async possibleWasm(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.bin = Buffer.from(reader.result);
      console.log(reader.result, this.bin);
    };
    reader.readAsArrayBuffer(f);
    throw new Error("do not upload hack");
  }
  async possibleAbi(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.abi = JSON.parse(reader.result);
      console.log(reader.result, this.abi);
    };
    reader.readAsText(f);
    throw new Error("do not upload hack");
  }
}
</script>