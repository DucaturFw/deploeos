import "jest-extended";
import * as eosTypes from "./eos-types";

describe("Eos Types converter", function() {
  it("base type", function() {
    Object.keys(eosTypes.baseTypes).forEach(type =>
      expect(eosTypes.isBase(type)).toBeTrue()
    );
  });

  it("inline base", function() {
    expect(
      [
        "uint64",
        "fixed_bytes20",
        "fixed_bytes32",
        "fixed_bytes64",
        "fixed_bytes65",
        "fixed_bytes33",
        "fixed_string16",
        "string",
        "name",
        "int64",
        "time",
        "uint32",
        "timestamp",
        "uint16",
        "checksum_type",
        "bytes",
        "varuint32",
        "uint8"
      ].forEach(t => expect(eosTypes.isBase(t)).toBeTrue())
    );
  });

  it("expand base", function() {
    expect(eosTypes.lookUpBase("uint64")).toEqual("uint64");
  });

  it("expand nested default", function() {
    expect(eosTypes.lookUpBase("extensions_type")).toEqual({
      type: "uint16",
      data: "bytes"
    });
  });

  it("expand deep", function() {
    expect(eosTypes.lookUpBase("producer_schedule")).toEqual({
      version: "uint32",
      producers: [
        {
          producer_name: "name",
          block_signing_key: "fixed_bytes33"
        }
      ]
    });
  });

  it("complex", function() {
    expect(JSON.stringify(eosTypes.lookUpBase("transaction"), null, 2)).toEqual(
      JSON.stringify(
        {
          expiration: "time",
          ref_block_num: "uint16",
          ref_block_prefix: "uint32",
          max_net_usage_words: "varuint32",
          max_cpu_usage_ms: "uint8",
          delay_sec: "varuint32",
          context_free_actions: [
            {
              account: "name",
              name: "name",
              authorization: [
                {
                  actor: "name",
                  permission: "name"
                }
              ],
              data: "bytes"
            }
          ],
          actions: [
            {
              account: "name",
              name: "name",
              authorization: [
                {
                  actor: "name",
                  permission: "name"
                }
              ],
              data: "bytes"
            }
          ],
          transaction_extensions: [
            {
              type: "uint16",
              data: "bytes"
            }
          ]
        },
        null,
        2
      )
    );
  });
});
