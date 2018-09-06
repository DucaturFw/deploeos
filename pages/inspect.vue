<template lang="pug">
  div(:class="b()")
    el-card(shadow="never")
      el-input(v-model="accountName")
    div(:class="b('inspect')" v-if="account")
    
      el-card(shadow="never" body-style="padding: 0")
        div(slot="header")
          h3(style="margin: 0")  Summary 

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'account' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'account' })" :span="8")
              span Account name
            el-col(:class="b('col', { data: true, type: 'account' })" :span="16")
              span {{ account.account_name }}

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span Creation date
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              span {{ account.created }}

      el-card(shadow="never" body-style="padding: 0")
        div(slot="header")
          h3(style="margin: 0")  Fuel

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span RAM
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('spacer')")
                div(:class="b('spacer-inside', { type: 'grow' })")
                  span(:class="b('resource-used')") {{ account.ram_usage }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.ram_quota }} 
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input-number(v-model.number="buy.ram" controls-position="right" :min="1")
                  el-button(type="default" @click='buyResource("ram")') Buy More

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span CPU
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('spacer')")
                div(:class="b('spacer-inside', { type: 'grow' })")
                  span(:class="b('resource-used')") {{ account.cpu_limit.used }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.cpu_limit.max }} 
                  span(:class="b('resource-cost')") {{account.total_resources.cpu_weight}}
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input-number(v-model.number="buy.cpu" controls-position="right" :min="1")
                  el-button(type="default" @click='buyResource("cpu")') Buy More

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span Network
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('spacer')")
                div(:class="b('spacer-inside', { type: 'grow' })")
                  span(:class="b('resource-used')") {{ account.net_limit.used }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.net_limit.max }} 
                  span(:class="b('resource-cost')") {{account.total_resources.net_weight}}
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input-number(v-model.number="buy.net" controls-position="right" :min="1")
                  el-button(type="default" @click='buyResource("net")') Buy More

      el-card(shadow="never" body-style="padding: 0")
        div(slot="header")
          h3(style="margin: 0")  Permissions

        el-card(:class="b('permission')" v-for="permission in account.permissions" shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span(:class="b('permission-name')") {{ permission.perm_name }} 
              span(:class="b('permission-threshold')") {{ permission.required_auth.threshold }} 
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('permission-list', {type: 'keys'})" v-for="key in permission.required_auth.keys")
                span(:class="b('permission-data')") {{ key.key }}
                span(:class="b('permission-weight')") {{ key.weight }} 
              div(:class="b('permission-list', {type: 'accounts'})" v-for="account in permission.required_auth.accounts") 
                span(:class="b('permission-data')") {{ account.permission.actor }}@{{ account.permission.permission }}
                span(:class="b('permission-weight')") {{ account.weight }} 
              el-button-group(:class="b('permission-manage')")
                el-button(type="default" icon="el-icon-plus") Add key
                el-button(type="default" icon="el-icon-plus") Add account
      pre {{ account }}
    div(v-loading="true" v-else)
      h3(style="margin: 0")  Loading
</template>

<style lang="scss">
.inspect-page {
  &__spacer {
    display: flex;
    align-items: center;

    &-inside {
      &--type-grow {
        flex-grow: 1;
      }
    }
  }

  &__permission {
    &-data {
      flex-grow: 1;
    }

    &-manage {
      margin-top: 20px;
    }

    &-list {
      display: flex;
      align-items: center;
    }
  }
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

  buy = {
    cpu: 0,
    net: 0,
    ram: 0
  };

  buyResource(resource: "cpu" | "net" | "ram") {
    console.log("buy", resource, this.buy[resource]);
  }
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
