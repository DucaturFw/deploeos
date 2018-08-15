<template lang="pug">
  div(:class="b()")
    h3(:class="b('label')") Selected Account:
    el-button(type='primary') With Scatter
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "el-select-identity"
})
export default class SelectIdentity extends Vue {}
</script>


<style lang="scss">
.el-select-identity {
  &__label {
    margin-top: 0;
  }
}
</style>