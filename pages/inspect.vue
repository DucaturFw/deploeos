<template lang="pug">
  div(:class="b()")
    el-card(shadow="never")
      el-input(v-model="accountName")
    div(:class="b('inspect')" v-if="account")
      h3 Summary 

      el-row(:class="b('row', { type: 'account' })" :gutter="30")
        el-col(:class="b('col', { label: true, type: 'account' })" :span="8")
          span Account name
        el-col(:class="b('col', { data: true, type: 'account' })" :span="16")
          span {{ account.account_name }}


      el-row(:class="b('row', { type: 'created' })" :gutter="30")
        el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
          span Creation date
        el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
          span {{ account.created }}

      h3 Fuel
      el-row(:class="b('row', { type: 'created' })" :gutter="30")
        el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
          span RAM
        el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
          span {{ account.ram_usage }} of {{ account.ram_quota }}
      el-row(:class="b('row', { type: 'created' })" :gutter="30")
        el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
          span CPU
        el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
          span {{ account.cpu_limit.used }} of {{ account.cpu_limit.max }}
      el-row(:class="b('row', { type: 'created' })" :gutter="30")
        el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
          span Network
        el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
          span {{ account.net_limit.used }} of {{ account.net_limit.max }}

      h3 Permissions

      div( v-for="permission in account.permissions")
        el-row(:class="b('row', { type: 'created' })" :gutter="30")
          el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
            span {{ permission.perm_name }}
          el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
            div(v-for="key in permission.required_auth.keys") {{ key.weight }} - {{ key.key }}
            div(v-for="account in permission.required_auth.accounts") {{ account.weight }} - {{ account.permission.actor }}@{{ account.permission.permission }}
      pre {{ account }}
    div(v-loading="true" v-else)
      h3 Loading
</template>

<style lang="scss">
.inspect-page {
}
</style>


<script lang="ts">
import { IAccountResponse } from "eosjs";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { getAccountName, getEos } from "~/lib/eos-helper";
import Async from "~/plugins/async-computed.plugin";

@Component({
  name: "inspect-page",
  mounted() {
    this.accountName = this.accountName || getAccountName(this.identity);
  }
})
export default class extends Vue {
  @State identity;
  @State network;

  accountName: string = "";

  @Async(async function() {
    if (this.accountName) {
      try {
        const { eos } = await getEos(this.network);
        return await eos.getAccount({
          account_name: this.accountName
        });
      } catch (e) {
        this.$message({
          message: "Couldn't load account with name: " + this.accountName,
          type: "error"
        });

        return null;
      }
    }
  })
  account: IAccountResponse | null = null;
  // export interface IAccountResponse {
  //   account_name: Name;
  //   head_block_num: BlockNumber;
  //   head_block_time: DateString;
  //   privileged: boolean;
  //   last_code_update: DateString;
  //   created: DateString;
  //   core_liquid_balance: AssetString;
  //   ram_quota: number;
  //   net_weight: number;
  //   cpu_weight: number;
  //   net_limit: IBandwidthLimit;
  //   cpu_limit: IBandwidthLimit;
  //   ram_usage: number;
  //   permissions: IPermission[];
  //   total_resources: {
  //     owner: Name;
  //     net_weight: AssetString;
  //     cpu_weight: AssetString;
  //     ram_bytes: number;
  //   };
  //   self_delegated_bandwidth: {
  //     from: Name;
  //     to: Name;
  //     net_weight: AssetString;
  //     cpu_weight: AssetString;
  //   };
  //   refund_request: any;
  //   voter_info: {
  //     owner: Name;
  //     proxy: string;
  //     producers: any[];
  //     staked: number;
  //     last_vote_weight: string;
  //     proxied_vote_weight: string;
  //     is_proxy: number;
  //   };
  // }
}
</script>