import _ from "lodash/fp";
import { toDictionary } from "../utils";

export const baseTypes = {
  uint64: true,
  fixed_bytes20: true,
  fixed_bytes32: true,
  fixed_bytes64: true,
  fixed_bytes65: true,
  fixed_bytes33: true,
  fixed_string16: true,
  string: true,
  name: true,
  int64: true,
  time: true,
  uint32: true,
  timestamp: true,
  uint16: true,
  checksum_type: true,
  bytes: true,
  varuint32: true,
  uint8: true
};

export type TypeDef =
  | string
  | { [field: string]: TypeDef }
  | [(string | { [field: string]: TypeDef })];

// export function expand(
//   name: string,
//   type: string,
//   customs?: {
//     [key: string]: TypeDef;
//   }
// ): TypeScalar[] {
//   return [
//     {
//       name,
//       type
//     }
//   ];
//   // if (typeEditors[type]) {
//   //   return [typeEditors[type]];
//   // } else if (chainTypes[type]) {
//   //   return expand(chainTypes[type], customs);
//   // } else if (customs[type]) {
//   //   return Object.keys(customs[type].fields)
//   //     .map(f => expand(customs[type].fields[f], customs))
//   //     .reduce((acc, val) => acc.concat(val), []);
//   // } else {
//   //   throw new Error("unknown type: " + type);
//   // }
// }

function wrap(a: any, w: boolean): any {
  return w ? [a] : a;
}

export function lookUpBase(type: string): any {
  const array = isArray(type);
  if (array) {
    type = type.substr(0, type.length - 2);
  }

  let r;

  if (isBase(type)) {
    r = type;
  } else if (isChainType(type)) {
    const chain = chainTypes[type];

    if (typeof chain === "string") {
      r = lookUpBase(chain);
    } else if (chain.base && chain.base.length) {
      console.log(chain.base, lookUpBase(chain.base));
      r = Object.assign(
        lookUpBase(chain.base),
        toDictionary(
          Object.keys(chain.fields),
          k => k,
          k => lookUpBase(chain.fields[k])
        )
      );
    } else {
      r = toDictionary(
        Object.keys(chain.fields),
        k => k,
        k => lookUpBase(chain.fields[k])
      );
    }
  } else {
    r = `unknown_${type}`;
  }

  return wrap(r, array);
}

export function isArray(type: string): boolean {
  return type.endsWith("[]");
}

export function isBase(type: string): boolean {
  return typeof baseTypes[type] !== "undefined";
}

export function isChainType(type: string): boolean {
  return isBase(type) || typeof chainTypes[type] !== "undefined";
}

export const chainTypes = {
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
};
