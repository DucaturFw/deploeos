<template lang="pug">
  div(:class="b()")
    el-card(shadow="never")
      el-input(v-model="accountName")
    div(:class="b('inspect')" v-if="account" v-loading="updating")
    
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
                  span(:class="b('resource-used')") {{ account.ram_usage | formatBytes }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.ram_quota | formatBytes }} 
                  span(:class="b('resource-left')") {{ (account.ram_usage / account.ram_quota * 100).toFixed(2) }}%
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input(v-model.number="buy.ram")
                    div(slot="append" style="width: 30px")
                      el-select(v-model='scale.ram')
                        el-option(label='B',  :value='1')
                        el-option(label='KB', :value='1024')
                        el-option(label='MB', :value='1048576')
                  el-button(style="margin-left: 10px;" type="default" @click='buyResource("ram")') Buy More

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span CPU
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('spacer')")
                div(:class="b('spacer-inside', { type: 'grow' })")
                  span(:class="b('resource-used')") {{ account.cpu_limit.used | formatMicroseconds }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.cpu_limit.max | formatMicroseconds }} 
                  span(:class="b('resource-left')") {{ (account.cpu_limit.used / account.cpu_limit.max * 100).toFixed(2) }}%
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input(v-model.number="buy.cpu")
                    div(slot="append" style="width: 30px")
                      el-select(v-model='scale.cpu')
                        el-option(label='us',  :value='1')
                        el-option(label='ms', :value='1000')
                        el-option(label='sec', :value='1000000')
                  el-button(style="margin-left: 10px;" type="default" @click='buyResource("cpu")') Buy More

        el-card(shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span Network
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              div(:class="b('spacer')")
                div(:class="b('spacer-inside', { type: 'grow' })")
                  span(:class="b('resource-used')") {{ account.net_limit.used | formatBytes }} 
                  span(:class="b('resource-divider')") of  
                  span(:class="b('resource-max')") {{ account.net_limit.max | formatBytes }} 
                  span(:class="b('resource-left')") {{ (account.net_limit.used / account.net_limit.max * 100).toFixed(2) }}%
                  //- span(:class="b('resource-left')") {{account.total_resources.net_weight}}
                div(:class="b('spacer-inside', { type: 'shrink' })")
                  el-input(v-model.number="buy.net")
                    div(slot="append" style="width: 30px")
                      el-select(v-model='scale.net')
                        el-option(label='B',  :value='1')
                        el-option(label='KB', :value='1024')
                        el-option(label='MB', :value='1048576')
                  el-button(style="margin-left: 10px;" type="default" @click='buyResource("net")') Buy More

      el-card(shadow="never" body-style="padding: 0")
        div(slot="header")
          h3(style="margin: 0")  Permissions

        el-card(:class="b('permission')" v-for="permission in permissions" shadow="never")
          el-row(:class="b('row', { type: 'created' })" :gutter="30")
            el-col(:class="b('col', { label: true, type: 'created' })" :span="8")
              span(:class="b('permission-name')") {{ permission.perm_name }} 
              span(:class="b('permission-threshold')") {{ permission.required_auth.threshold }} 
            el-col(:class="b('col', { data: true, type: 'created' })" :span="16")
              el-row(:class="b('permission-list', {type: 'header'})" :gutter="15")
                el-col(:span='16')
                  h5(style="margin-top: 10px; margin-bottom: 15px;") Auth
                el-col(:span='8')
                  h5(style="margin-top: 10px; margin-bottom: 15px;") Weight
              el-row(:class="b('permission-list', {type: 'keys'})" v-for="(key, index) in permission.required_auth.keys" :gutter="15" style="margin-bottom: 10px")
                el-col(:span='16')
                  el-input(:class="b('permission-data')" v-model="key.key")
                el-col(:span='8')
                  el-input(:class="b('permission-weight')" v-model="key.weight")
                    el-button(slot="append" type="danger" :plain="true" icon="el-icon-close" @click="removeKey(permission.perm_name, index)")
              el-row(:class="b('permission-list', {type: 'accounts'})" v-for="(account, index) in permission.required_auth.accounts" :gutter="15" style="margin-bottom: 10px")
                el-col(:class="b('spacer')" :span='16')
                  el-input(:class="b('permission-data')" v-model="account.permission.actor")
                  el-input(:class="b('permission-data')" v-model="account.permission.permission")
                    div(slot="prepend") @
                el-col(:span='8')
                  el-input(:class="b('permission-weight')" v-model="account.weight")
                    el-button(slot="append" type="danger" :plain="true" icon="el-icon-close" @click="removeAccount(permission.perm_name, index)")
              el-button-group(:class="b('permission-manage')")
                el-button(type="default" icon="el-icon-plus" @click="addKey(permission.perm_name)") Add key
                el-button(type="default" icon="el-icon-plus" @click="addAccount(permission.perm_name)") Add account
                el-button(type="danger" :plain="true" v-if="!same[permission.perm_name]" @click="resetPermission(permission.perm_name)") Reset
                el-button(type="success" :plain="true" v-if="!same[permission.perm_name]" @click="updatePermission(permission.perm_name)") Update
    div(v-loading="true" v-else)
      h3(style="margin: 0")  Loading
</template>

<style lang="scss">
.inspect-page {
  &__spacer {
    display: flex;
    align-items: center;

    &-inside {
      display: flex;
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

  &__resource {
    &-used,
    &-max,
    &-left,
    &-divider {
      margin: 0 3px;
      line-height: 20px;
    }

    &-left {
      opacity: 0.6;
      font-size: 80%;
      margin-left: 15px;
    }
  }
}
</style>


<script lang="ts">
import { IAccountResponse, IPermission } from "eosjs";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import {
  getAccountName,
  getEos,
  buyRam,
  stakeCpu,
  stakeNet,
  updatePermissions
} from "~/lib/eos-helper";
import Async from "~/plugins/async-computed.plugin";
import { toDictionary, clone } from "~/utils";

import equal from "deep-equal";

@Component({
  name: "inspect-page",
  mounted() {
    this.accountName = this.accountName || getAccountName(this.identity);
  },
  filters: {
    formatBytes(a: any) {
      if (0 == a) return "0 B";
      var c = 1024,
        d = 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    formatMicroseconds(a: any) {
      if (0 == a) return "0 us";
      var c = 1000,
        d = 2,
        e = ["us", "ms", "sec"],
        f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    }
  }
})
export default class extends Vue {
  @State identity;
  @State network;

  accountName: string = "";

  updating: boolean = false;

  buy = {
    cpu: 0,
    net: 0,
    ram: 0
  };

  scale = {
    cpu: 1,
    net: 1,
    ram: 1
  };

  permissions: { [key: string]: IPermission } = {};
  same: { [key: string]: boolean } = {};

  async buyResource(resource: "cpu" | "net" | "ram") {
    const amount = Math.floor(this.buy[resource] * this.scale[resource]);
    console.log("buy", resource, amount);

    let r: any;
    this.updating = true;
    try {
      switch (resource) {
        case "ram":
          r = await buyRam(this.network, this.identity, amount);
          console.log(r);
          return r;
        case "cpu":
          // const cost = this.account!.total_resources.cpu_weight
          r = await stakeCpu(this.network, this.identity, 10);
          console.log(r);
          return r;
        case "net":
          // const cost = this.account!.total_resources.cpu_weight
          r = await stakeNet(this.network, this.identity, 10);
          console.log(r);
          return r;
      }
    } catch (e) {
      this.$message({
        message: "Couldn't buy reasources (" + e + ")",
        type: "error"
      });
    }
    this.updating = false;
  }

  async updatePermission(key: string) {
    // console.log(this.permissions[key]);
    this.updating = true;
    try {
      await updatePermissions(
        this.network,
        this.identity,
        this.permissions[key]
      );

      await this.updateAccount();
    } catch (e) {
      this.$message({
        message: "Update permission was failed (" + e + ")",
        type: "error"
      });
    }
    this.updating = false;
  }

  async updateAccount() {
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
  }
  @Async(async function() {
    return await this.updateAccount();
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
    this.$set(
      this.permissions,
      key,
      clone(this.account!.permissions.find(p => p.perm_name === key))
    );

    this.samePermission(key);
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
    this.permissions[key].required_auth.keys.splice(index, 1);
    this.samePermission(key);
  }

  removeAccount(key: string, index: number) {
    this.permissions[key].required_auth.accounts.splice(index, 1);
    this.samePermission(key);
  }
}
</script>
