<template lang="pug">
    div(:class="b()")
      div(v-if="ready")
        pre(v-if="!error") 
          //- ul
          //-   li(v-for="action in actions") {{ action }}
          ul
            li(v-for="struct in structs")
              h3 {{struct.name}}
              div(v-for="field in struct.fields" style="margin-bottom: 20px") 
                div {{field.name}}
                div {{field.type}}
                component(v-for="editor in typeToComponent(field.type)" :is="editor")
        el-alert(v-else :title="abi.message" type="error")
</template>

<style lang="scss">
.interact-page {
}
</style>


<script lang="ts">
import _ from "lodash/fp";
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import Async from "~/plugins/async-computed.plugin";
import { getAbi, getEos, getScatter, getAccountName } from "~/lib/eos-helper";
import {
  INetworkModel,
  IScatterIdentity,
  IAbiResponse,
  IAbiStructField,
  IAbiStruct
} from "~/types";

const typeEditors = {
  uint64: "el-input",
  fixed_bytes20: "el-input",
  fixed_bytes32: "el-input",
  fixed_bytes64: "el-input",
  fixed_bytes65: "el-input",
  fixed_bytes33: "el-input",
  fixed_string16: "el-input",
  string: "el-input",
  name: "el-input",
  int64: "el-input",
  time: "el-input",
  uint32: "el-input",
  timestamp: "el-input",
  uint16: "el-input",
  checksum_type: "el-input",
  bytes: "el-input",
  varuint32: "el-input",
  uint8: "el-input"
};

const chainTypes = {
  name: "uint64",
  checksum160: "fixed_bytes20",
  checksum256: "fixed_bytes32",
  checksum512: "fixed_bytes64",
  signature: "fixed_bytes65",
  public_key: "fixed_bytes33",
  message_type: "fixed_string16",
  symbol: "uint64",
  symbol_code: "uint64",
  field_name: "string",
  account_name: "name",
  permission_name: "name",
  type_name: "string",
  token_name: "name",
  table_name: "name",
  scope_name: "name",
  action_name: "name",
  time_point: "int64",
  time_point_sec: "time",
  timestamp: "uint32",
  block_timestamp_type: "timestamp",
  block_id: "fixed_bytes32",
  checksum_type: "fixed_bytes32",
  checksum256_type: "fixed_bytes32",
  checksum512_type: "fixed_bytes64",
  checksum160_type: "fixed_bytes20",
  sha256: "fixed_bytes32",
  sha512: "fixed_bytes64",
  sha160: "fixed_bytes20",
  weight_type: "uint16",
  block_num_type: "uint32",
  share_type: "int64",
  digest_type: "checksum_type",
  context_free_type: "bytes",
  unsigned_int: "varuint32",
  bool: "uint8",
  extensions_type: {
    base: "",
    fields: {
      type: "uint16",
      data: "bytes"
    }
  },
  transaction_header: {
    base: "",
    fields: {
      expiration: "time",
      ref_block_num: "uint16",
      ref_block_prefix: "uint32",
      max_net_usage_words: "unsigned_int",
      max_cpu_usage_ms: "uint8",
      delay_sec: "unsigned_int"
    }
  },
  transaction: {
    base: "transaction_header",
    fields: {
      context_free_actions: "action[]",
      actions: "action[]",
      transaction_extensions: "extensions_type[]"
    }
  },
  signed_transaction: {
    base: "transaction",
    fields: {
      signatures: "signature[]",
      context_free_data: "bytes[]"
    }
  },
  fields: "field_def[]",
  field_def: {
    fields: {
      name: "field_name",
      type: "type_name"
    }
  },
  asset: {
    fields: {
      amount: "share_type",
      sym: "symbol"
    }
  },
  producer_key: {
    fields: {
      producer_name: "account_name",
      block_signing_key: "public_key"
    }
  },
  producer_schedule: {
    fields: {
      version: "uint32",
      producers: "producer_key[]"
    }
  },
  chain_config: {
    fields: {
      target_block_size: "uint32",
      max_block_size: "uint32",
      target_block_acts_per_scope: "uint32",
      max_block_acts_per_scope: "uint32",
      target_block_acts: "uint32",
      max_block_acts: "uint32",
      real_threads: "uint64",
      max_storage_size: "uint64",
      max_transaction_lifetime: "uint32",
      max_authority_depth: "uint16",
      max_transaction_exec_time: "uint32",
      max_inline_depth: "uint16",
      max_inline_action_size: "uint32",
      max_generated_transaction_size: "uint32"
    }
  },
  type_def: {
    base: "",
    fields: {
      new_type_name: "type_name",
      type: "type_name"
    }
  },
  struct_def: {
    base: "",
    fields: {
      name: "type_name",
      base: "type_name",
      fields: "field_def[]"
    }
  },
  clause_pair: {
    base: "",
    fields: {
      id: "string",
      body: "string"
    }
  },
  error_message: {
    base: "",
    fields: {
      error_code: "uint64",
      error_msg: "string"
    }
  },
  abi_def: {
    base: "",
    fields: {
      version: "string",
      types: "type_def[]",
      structs: "struct_def[]",
      actions: "action_def[]",
      tables: "table_def[]",
      ricardian_clauses: "clause_pair[]",
      error_messages: "error_message[]",
      abi_extensions: "extensions_type[]"
    }
  },
  table_def: {
    base: "",
    fields: {
      name: "table_name",
      index_type: "type_name",
      key_names: "field_name[]",
      key_types: "type_name[]",
      type: "type_name"
    }
  },
  permission_level: {
    base: "",
    fields: {
      actor: "account_name",
      permission: "permission_name"
    }
  },
  action: {
    base: "",
    fields: {
      account: "account_name",
      name: "action_name",
      authorization: "permission_level[]",
      data: "bytes"
    }
  },
  action_def: {
    base: "",
    fields: {
      name: "action_name",
      type: "type_name",
      ricardian_contract: "string"
    }
  },
  block_header: {
    base: "",
    fields: {
      previous: "checksum256",
      timestamp: "timestamp",
      transaction_mroot: "checksum256",
      action_mroot: "checksum256",
      block_mroot: "checksum256",
      producer: "account_name",
      schedule_version: "uint32",
      new_producers: "producer_schedule?"
    }
  },
  packed_transaction: {
    fields: {
      signatures: "signature[]",
      compression: "uint8",
      packed_context_free_data: "bytes",
      packed_trx: "bytes"
    }
  }
} as TypeDict;

type TypeDef = string | { base?: string; fields: { [key: string]: string } };
type TypeDict = { [key: string]: TypeDef };

@Component({
  name: "interact-page"
})
export default class extends Vue {
  @State network: INetworkModel;
  @State identity: IScatterIdentity;

  @Async(async function() {
    try {
      const { eos } = await getEos(this.network);
      return await eos.getAbi({
        account_name: getAccountName(this.identity)
      });
    } catch (e) {
      return {
        status: 500,
        message: e.message
      };
    }
  })
  abi: { abi?: IAbiResponse; status: number; text: string } | null = null;

  get structs() {
    if (this.abi && this.abi.abi && !this.error) {
      return this.abi.abi.structs;
    }
  }

  get actions() {
    if (this.abi && this.abi.abi && !this.error) {
      return this.abi.abi.actions;
    }
  }

  get customTypes() {
    if (this.structs) {
      const pickFieldType = _.mapValues((field: IAbiStructField) => field.type);
      const reduceFields = _.keyBy((field: IAbiStructField) => field.name);
      const reduceStructs = _.keyBy((struct: IAbiStruct) => struct.name);
      const reduceStructFields = _.map((struct: IAbiStruct) => ({
        ...struct,
        fields: pickFieldType(reduceFields(struct.fields))
      }));

      const r = <TypeDict>(<any>reduceStructs(
        reduceStructFields(this.structs)
      ));
      console.log(r);
      return r;
    }
    return {};
  }

  get error() {
    return this.abi && (<any>this.abi).status === 500;
  }

  get ready() {
    return this.abi != null;
  }

  typeToComponent(type: TypeDef): string[] {
    if (typeof type === "string") {
      if (typeEditors[type]) {
        return [typeEditors[type]];
      } else if (chainTypes[type]) {
        return this.typeToComponent(chainTypes[type]);
      } else if (this.customTypes[type]) {
        return this.typeToComponent(this.customTypes[type]);
      }
      console.log(this.customTypes);

      return ["unknown"];
    } else {
      const base = type.base ? this.typeToComponent(type.base) : [];
      const fields = Object.keys(type.fields)
        .map(k => type.fields[k])
        .map(t => this.typeToComponent(t))
        .reduce((acc, val) => acc.concat(val), []);

      return [...base, ...fields];
    }
  }
}
</script>