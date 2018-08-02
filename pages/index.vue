<template lang="pug">
  section
    h1.header Deploeos
    el-row(:gutter='50')
      el-col(:span='12')
        h2 ABI File
        el-upload.upload-demo(drag='', 
                              action='/',
                              :before-upload='possibleAbi'
                              ref='upload')
          i.el-icon-upload
          .el-upload__text
            em click to upload
      el-col(:span='12')
        h2 WASM File
        el-upload.upload-demo(drag='', 
                              action='/',
                              :before-upload='possibleWasm'
                              ref='upload')
          i.el-icon-upload
          .el-upload__text
            em click to upload

    el-button(type="primary" @click='deploy') Deploy
    el-button(type="primary" @click='powerUp') Power

    // pre {{ eos }}
</template>

<script lang="ts">
import Eos from "~/lib/eos";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { setInterval } from "timers";

@Component({
  mounted() {
    this.findEOS();
  }
})
export default class extends Vue {
  @State people;

  eos: Eos | null = null;
  bin: any = null;
  abi: any = {};

  async deploy() {
    if (this.eos) {
      const result = await this.eos.deployContract(this.bin, this.abi);
      console.log(result);
    }
  }

  async powerUp() {
    console.log(await this.eos!.initiatePower(10e6, 100, 100));
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

  findEOS() {
    this.eos = (<any>process).client
      ? new Eos({
          port: 443,
          host: "jungle.eos.smartz.io",
          protocol: "https",
          blockchain: "eos"
        })
      : null;
    if (!this.eos) {
      setTimeout(() => this.findEOS(), 300);
    }
  }
}
</script>
<style>
body {
  font-family: "Montserrat", sans-serif;
}
</style>