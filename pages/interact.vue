<template lang="pug">
    div(:class="b()")
</template>

<style lang="scss">
.interact-page {
}
</style>


<script lang="ts">
import Eos from "~/lib/eos";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";

@Component({
  name: "interact-page"
})
export default class extends Vue {
}
</script>