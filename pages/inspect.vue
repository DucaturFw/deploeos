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

        el-card(:class="b('permission')" v-for="permission in permissions" shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span(:class="b('permission-name')") {{ permission.perm_name }} 
              span(:class="b('permission-threshold')") {{ permission.required_auth.threshold }} 
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('permission-list', {type: 'keys'})" v-for="(key, index) in permission.required_auth.keys")
                el-input(:class="b('permission-data')" :value="key.key")
                el-input(:class="b('permission-weight')" :value="key.weight")
                el-button(:circle="true" size="mini" type="danger" :plain="true" style="margin-left: 10px" icon="el-icon-close" @click="removeKey(permission.perm_name, index)")
              div(:class="b('permission-list', {type: 'accounts'})" v-for="(account, index) in permission.required_auth.accounts") 
                el-input(:class="b('permission-data')" :value="`${account.permission.actor}@${account.permission.permission}`")
                el-input(:class="b('permission-weight')" :value="account.weight")
                el-button(:circle="true" size="mini" type="danger" :plain="true" style="margin-left: 10px" icon="el-icon-close" @click="removeAccount(permission.perm_name, index)")
              el-button-group(:class="b('permission-manage')")
                el-button(type="default" icon="el-icon-plus" @click="addKey(permission.perm_name)") Add key
                el-button(type="default" icon="el-icon-plus" @click="addAccount(permission.perm_name)") Add account
                el-button(type="danger" v-if="!same[permission.perm_name]" @click="resetPermission(permission.perm_name)") Reset
                el-button(type="primary" v-if="!same[permission.perm_name]" @click="updatePermission(permission.perm_name)") Update
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
import { IAccountResponse, IPermission } from "eosjs";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { getAccountName, getEos } from "~/lib/eos-helper";
import Async from "~/plugins/async-computed.plugin";
import { toDictionary, clone } from "~/utils";

import equal from "deep-equal";

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

  permissions: { [key: string]: IPermission } = {};
  same: { [key: string]: boolean } = {};

  buyResource(resource: "cpu" | "net" | "ram") {
    console.log("buy", resource, this.buy[resource]);
  }
  @Async(async function() {
    if (this.accountName) {
      try {
        const { eos } = await getEos(this.network);
        const acc = (await eos.getAccount({
          account_name: this.accountName
        })) as IAccountResponse;

        this.permissions = toDictionary(
          acc.permissions,
          p => p.perm_name,
          p => clone(p)
        );
        this.same = toDictionary(acc.permissions, p => p.perm_name, p => true);

        return acc;
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

  samePermission(key: string) {
    if (this.account && this.permissions) {
      this.same[key] = equal(
        this.permissions[key],
        this.account.permissions.find(p => p.perm_name === key)
      );
      console.log("compare", key, this.same[key]);
    } else {
      this.same[key] = false;
    }
  }

  resetPermission(key: string) {
    this.$set(this.permissions, key, {
      ...this.account!.permissions.find(p => p.perm_name === key)!
    });

    this.samePermission(key);
  }

  async updatePermission(key: string) {
    console.log(this.permissions[key]);
  }

  addKey(key: string) {
    this.permissions[key].required_auth.keys.push({
      key: "...",
      weight: 1
    });
    this.samePermission(key);
  }

  addAccount(key: string) {
    this.permissions[key].required_auth.accounts.push({
      permission: {
        actor: "...",
        permission: "active"
      },
      weight: 1
    });

    this.samePermission(key);
  }

  removeKey(key: string, index: number) {
    this.permissions[key].required_auth.keys.splice(index);
    this.samePermission(key);
  }

  removeAccount(key: string, index: number) {
    this.permissions[key].required_auth.accounts.splice(index);
    this.samePermission(key);
  }
}
</script>
