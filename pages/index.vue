<template lang="pug">
    div(:class="b()")
      div(:class="b('upload-row')" v-loading="disabled")
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") ABI File
          el-upload.upload-demo(drag='', 
                                :disabled="disabled"
                                action='/',
                                :before-upload='possibleAbi'
                                ref='upload'
                                :on-remove="removeAbi"
                                :limit="1"
                                :file-list="fileList")
            i.el-icon-upload
            .el-upload__text
              em click to upload
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") WASM File
          el-upload.upload-demo(drag='', 
                                :disabled="disabled"
                                action='/',
                                :before-upload='possibleWasm'
                                :on-remove="removeWasm"
                                ref='upload'
                                :limit="1"
                                :file-list="fileList")
            i.el-icon-upload
            .el-upload__text
              em click to upload

      el-button(type="primary" @click='deploy' :disabled="!readyToDeploy") Deploy
</template>

<style lang="scss">
.index-page {
  &__upload-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__uploader {
    margin: 20px;
  }
}
</style>


<script lang="ts">
import { deployContract } from "~/lib/eos-helper";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { INetworkModel } from "types";

@Component({
  name: "index-page"
})
export default class extends Vue {
  @State network: INetworkModel;
  @State identity: string;

  bin: any = null;
  abi: any = null;
  fileList: any[] = [];

  get disabled() {
    return this.network === null || this.identity === null;
  }

  async deploy() {
    return deployContract(this.network, this.identity, this.bin, this.abi);
  }

  get readyToDeploy() {
    return (
      !this.disabled && this.bin && this.abi && typeof this.abi === "object"
    );
  }

  async possibleWasm(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.bin = Buffer.from(reader.result);
      console.log(reader.result, this.bin);
    };
    reader.readAsArrayBuffer(f);
    // throw new Error("do not upload hack");
  }
  async possibleAbi(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.abi = JSON.parse(reader.result);
      console.log(reader.result, this.abi);
    };
    reader.readAsText(f);
  }

  removeAbi(file: any, fileList: any) {
    this.abi = null;
  }

  removeWasm(file: any, fileList: any) {
    this.bin = null;
  }
}
</script>