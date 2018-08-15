<template lang="pug">
    div(:class="b()")
      div(:class="b('upload-row')")
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") ABI File
          el-upload.upload-demo(drag='', 
                                action='/',
                                :before-upload='possibleAbi'
                                ref='upload')
            i.el-icon-upload
            .el-upload__text
              em click to upload
        div(:class="b('uploader')")
          h2(:class="b('title', {type:'file'})") WASM File
          el-upload.upload-demo(drag='', 
                                action='/',
                                :before-upload='possibleWasm'
                                ref='upload')
            i.el-icon-upload
            .el-upload__text
              em click to upload

      el-button(type="primary" @click='deploy') Deploy
      el-button(type="primary" @click='powerUp') Power
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

@Component({
  name: "index-page",
})
export default class extends Vue {
  @State eos: EosClass;

  bin: any = null;
  abi: any = {};

  async deploy() {
    if (this.eos) {
      const result = await this.eos.deployContract(this.bin, this.abi);
      console.log(result);
    }
  }
}
</script>