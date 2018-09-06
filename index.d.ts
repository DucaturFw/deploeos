declare module "*.vue" {
  import Vue from "vue";
  const _default: Vue;
  export default _default;
}

declare module "scatter-js" {
  const d: any;
  export default d;
}

declare module "eosjs" {
  import * as EosEcc from "eosjs-ecc";

  export type Name = string;
  export type BlockNumber = number;
  export type DateString = string;
  export type AssetString = string;

  interface EosDefault {
    (config: any): EosInstance;
    modules: {
      ecc: typeof EosEcc;
    };
  }
  let Eos: EosDefault;
  export default Eos;
  interface ITableResult<T> {
    rows: T[];
    more: boolean;
  }
  export interface IBandwidthLimit {
    used: number;
    available: number;
    max: number;
  }
  export interface IPermissionAuthKeys {
    key: string;
    weight: number;
  }
  export interface IPermissionAuthAccount {
    permission: {
      actor: Name;
      permission: Name;
    };
    weight: number;
  }
  export interface IPermissionAuth {
    threshold: number;
    keys: IPermissionAuthKeys[];
    accounts: IPermissionAuthAccount[];
    waits: any[];
  }
  export interface IPermission {
    perm_name: Name;
    parent: Name;
    required_auth: IPermissionAuth;
  }

  export interface IAccountResponse {
    account_name: Name;
    head_block_num: BlockNumber;
    head_block_time: DateString;
    privileged: boolean;
    last_code_update: DateString;
    created: DateString;
    core_liquid_balance: AssetString;
    ram_quota: number;
    net_weight: number;
    cpu_weight: number;
    net_limit: IBandwidthLimit;
    cpu_limit: IBandwidthLimit;
    ram_usage: number;
    permissions: IPermission[];
    total_resources: {
      owner: Name;
      net_weight: AssetString;
      cpu_weight: AssetString;
      ram_bytes: number;
    };
    self_delegated_bandwidth: {
      from: Name;
      to: Name;
      net_weight: AssetString;
      cpu_weight: AssetString;
    };
    refund_request: any;
    voter_info: {
      owner: Name;
      proxy: string;
      producers: any[];
      staked: number;
      last_vote_weight: string;
      proxied_vote_weight: string;
      is_proxy: number;
    };
  }

  export interface IAccountRequest {
    account_name: Name;
  }

  export interface IInfoResponse {
    server_version: string;
    chain_id: string;
    head_block_num: number;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    head_block_id: string;
    head_block_time: string;
    head_block_producer: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
    block_cpu_limit: number;
    block_net_limit: number;
  }

  export interface ITableRequest {
    code: Name;
    scope: Name;
    table: Name;
    json?: string | boolean;
    limit?: number;
    lower_bound?: number;
    upper_bound?: number;
  }

  export interface IProducersTable {
    owner: Name;
    total_votes: string;
    producer_key: string;
    is_active: number;
    url: string;
    unpaid_blocks: number;
    last_claim_time: string;
    location: number;
  }

  export interface ICurrencyRequest {
    code: Name;
    account: Name;
    symbol?: string;
  }

  export interface ICurrencyStatsRequest {
    code: Name;
    symbol: Name;
  }
  export interface ICurrencyStat {
    supply: IAsset;
    max_supply: IAsset;
    issuer: Name;
  }
  export interface ICurrencyStatsResponse {
    [symbol: string]: ICurrencyStatsResponse;
  }

  export type IAsset = string;

  interface EosMethod<TRequest, TResponse> {
    (): void;
    (config: TRequest, extra?: IEosjsCallsParams): Promise<TResponse>;
    (
      config: TRequest,
      extra: IEosjsCallsParams,
      cb: (err: Error, result: TResponse) => void
    ): void;
    // <T extends TRequest[keyof TRequest]>(...args: T[]): Promise<TResponse>;
  }

  interface ISetCodeRequest {
    account: Name;
    vmtype: number;
    vmversion: number;
    code: Buffer;
  }

  interface ISetAbiRequest {
    account: Name;
    abi: any | Buffer | string;
  }

  export class EosInstance {
    fc: any;
    api: any;
    getCurrencyBalance: EosMethod<ICurrencyRequest, IAsset[]>;
    getCurrencyStats: EosMethod<ICurrencyStatsRequest, ICurrencyStatsResponse>;
    getProducers: EosMethod<
      Partial<ITableRequest>,
      ITableResult<IProducersTable> & { total_producer_vote_weight: number }
    >;
    getInfo: EosMethod<{}, IInfoResponse>;
    setabi: EosMethod<ISetAbiRequest, any>;
    setcode: EosMethod<ISetCodeRequest, any>;

    getBlock: EosMethod<any, any>;
    getAccount: EosMethod<IAccountRequest, IAccountResponse>;
    getCode: EosMethod<any, any>;
    getAbi: EosMethod<any, any>;
    getTableRows<T>(config: ITableRequest): Promise<ITableResult<T>>;
    abiJsonToBin: EosMethod<any, any>;
    abiBinToJson: EosMethod<any, any>;
    getRequiredKeys: EosMethod<any, any>;
    pushBlock: EosMethod<any, any>;
    pushTransaction: EosMethod<any, any>;
    pushTransactions: EosMethod<any, any>;
    getActions: EosMethod<any, any>;
    getControlledAccounts: EosMethod<any, any>;
    getKeyAccounts(...args: any[]): Promise<{ account_names: string[] }>;
    getTransaction: EosMethod<any, any>;
    createTransaction: EosMethod<any, any>;
    transaction: EosMethod<any, any>;
    bidname: EosMethod<any, any>;
    buyram: EosMethod<any, any>;
    buyrambytes: EosMethod<any, any>;
    canceldelay: EosMethod<any, any>;
    claimrewards: EosMethod<any, any>;
    delegatebw: EosMethod<any, any>;
    deleteauth: EosMethod<any, any>;
    linkauth: EosMethod<any, any>;
    newaccount: EosMethod<any, any>;
    onerror: EosMethod<any, any>;
    refund: EosMethod<any, any>;
    regproducer: EosMethod<any, any>;
    regproxy: EosMethod<any, any>;
    reqauth: EosMethod<any, any>;
    rmvproducer: EosMethod<any, any>;
    sellram: EosMethod<any, any>;
    setalimits: EosMethod<any, any>;
    setglimits: EosMethod<any, any>;
    setprods: EosMethod<any, any>;
    setparams: EosMethod<any, any>;
    setpriv: EosMethod<any, any>;
    setram: EosMethod<any, any>;
    undelegatebw: EosMethod<any, any>;
    unlinkauth: EosMethod<any, any>;
    unregprod: EosMethod<any, any>;
    updateauth: EosMethod<any, any>;
    voteproducer: EosMethod<any, any>;
    create: EosMethod<any, any>;
    issue: EosMethod<any, any>;
    transfer: ((
      from: string,
      to: string,
      quantity: string,
      memo: string
    ) => Promise<any>) &
      ((
        from: string,
        to: string,
        quantity: string,
        memo: string,
        callback: (err: any, res: any) => void
      ) => void) &
      EosMethod<
        { from: string; to: string; quantity: string; memo: string },
        any
      >;
    // contract(...args: any[]): any
    contract<T extends IEosContract>(
      name: string,
      callback: (err: any, res: T) => void
    ): void;
    contract<T extends IEosContract>(name: string): Promise<T>;
    contract<T extends IEosContract>(
      name: string,
      args: IEosjsCallsParams,
      callback: (err: any, res: T) => void
    ): void;
    contract<T extends IEosContract>(
      name: string,
      args: IEosjsCallsParams
    ): Promise<T>;
  }
  export class IEosjsCallsParams {
    authorization?: string;
    sign?: boolean;
  }
  export class IEosContract {
    [name: string]: ((...args: any[]) => any) | any;
    transaction(...args: any[]): any;
    fc: {
      abi: {
        version: "eosio::abi/1.0";
        types: any[];
        structs: any[];
        actions: any[];
        tables: any[];
        ricardian_clauses: any[];
        error_messages: any[];
        abi_extensions: any[];
      };
      schema: {
        time_t: "int32";
        channel: any;
        open: any;
        extend: any;
        validate: any;
        close: any;
        hi: any;
      };
      structs: {
        extensions_type: any;
        transaction_header: any;
        transaction: any;
        signed_transaction: any;
        field_def: any;
        producer_key: any;
        producer_schedule: any;
        chain_config: any;
        type_def: any;
        struct_def: any;
        clause_pair: any;
        error_message: any;
        abi_def: any;
        table_def: any;
        action: any;
        action_def: any;
        block_header: any;
        packed_transaction: any;
        nonce: any;
        authority: any;
        bidname: any;
        blockchain_parameters: any;
        buyram: any;
        buyrambytes: any;
        canceldelay: any;
        claimrewards: any;
        connector: any;
        delegatebw: any;
        delegated_bandwidth: any;
        deleteauth: any;
        eosio_global_state: any;
        exchange_state: any;
        key_weight: any;
        linkauth: any;
        namebid_info: any;
        newaccount: any;
        onerror: any;
        permission_level: any;
        permission_level_weight: any;
        producer_info: any;
        refund: any;
        refund_request: any;
        regproducer: any;
        regproxy: any;
        require_auth: any;
        rmvproducer: any;
        sellram: any;
        set_account_limits: any;
        set_global_limits: any;
        set_producers: any;
        setabi: any;
        setcode: any;
        setparams: any;
        setpriv: any;
        setram: any;
        total_resources: any;
        undelegatebw: any;
        unlinkauth: any;
        unregprod: any;
        updateauth: any;
        user_resources: any;
        voteproducer: any;
        voter_info: any;
        wait_weight: any;
        account: any;
        create: any;
        currency_stats: any;
        issue: any;
        transfer: any;
        channel: any;
        open: any;
        extend: any;
        validate: any;
        close: any;
        hi: any;
        fields: any;
      };
      types: {
        bytes(...args: any[]): any;
        string(...args: any[]): any;
        vector(...args: any[]): any;
        optional(...args: any[]): any;
        time(...args: any[]): any;
        map(...args: any[]): any;
        static_variant(...args: any[]): any;
        fixed_string16(...args: any[]): any;
        fixed_string32(...args: any[]): any;
        fixed_bytes16(...args: any[]): any;
        fixed_bytes20(...args: any[]): any;
        fixed_bytes28(...args: any[]): any;
        fixed_bytes32(...args: any[]): any;
        fixed_bytes33(...args: any[]): any;
        fixed_bytes64(...args: any[]): any;
        fixed_bytes65(...args: any[]): any;
        uint8(...args: any[]): any;
        uint16(...args: any[]): any;
        uint32(...args: any[]): any;
        uint64(...args: any[]): any;
        uint128(...args: any[]): any;
        uint224(...args: any[]): any;
        uint256(...args: any[]): any;
        uint512(...args: any[]): any;
        varuint32(...args: any[]): any;
        int8(...args: any[]): any;
        int16(...args: any[]): any;
        int32(...args: any[]): any;
        int64(...args: any[]): any;
        int128(...args: any[]): any;
        int224(...args: any[]): any;
        int256(...args: any[]): any;
        int512(...args: any[]): any;
        varint32(...args: any[]): any;
        float64(...args: any[]): any;
        name(...args: any[]): any;
        public_key(...args: any[]): any;
        symbol(...args: any[]): any;
        extended_symbol(...args: any[]): any;
        asset(...args: any[]): any;
        extended_asset(...args: any[]): any;
        signature(...args: any[]): any;
        config: any;
        checksum160(...args: any[]): any;
        checksum256(...args: any[]): any;
        checksum512(...args: any[]): any;
        message_type(...args: any[]): any;
        symbol_code(...args: any[]): any;
        field_name(...args: any[]): any;
        account_name(...args: any[]): any;
        permission_name(...args: any[]): any;
        type_name(...args: any[]): any;
        token_name(...args: any[]): any;
        table_name(...args: any[]): any;
        scope_name(...args: any[]): any;
        action_name(...args: any[]): any;
        time_point(...args: any[]): any;
        time_point_sec(...args: any[]): any;
        timestamp(...args: any[]): any;
        block_timestamp_type(...args: any[]): any;
        block_id(...args: any[]): any;
        checksum_type(...args: any[]): any;
        checksum256_type(...args: any[]): any;
        checksum512_type(...args: any[]): any;
        checksum160_type(...args: any[]): any;
        sha256(...args: any[]): any;
        sha512(...args: any[]): any;
        sha160(...args: any[]): any;
        weight_type(...args: any[]): any;
        block_num_type(...args: any[]): any;
        share_type(...args: any[]): any;
        digest_type(...args: any[]): any;
        context_free_type(...args: any[]): any;
        unsigned_int(...args: any[]): any;
        bool(...args: any[]): any;
        transaction_id_type(...args: any[]): any;
        time_t(...args: any[]): any;
      };
      fromBuffer(...args: any[]): any;
      toBuffer(...args: any[]): any;
    };
  }
}
declare module "eosjs-ecc" {
  export function PrivateKey(d: any): any;

  export function PublicKey(Q: any, ...args: any[]): any;

  export function Signature(r: any, s: any, i: any, ...args: any[]): any;

  export function initialize(...args: any[]): any;

  export function isValidPrivate(wif: any): any;

  export function isValidPublic(pubkey: any): any;

  export function privateToPublic(wif: any): any;

  export function randomKey(cpuEntropyBits: any): any;

  export function recover(signature: any, data: any, ...args: any[]): any;

  export function recoverHash(
    signature: any,
    dataSha256: any,
    ...args: any[]
  ): any;

  export function seedPrivate(seed: any): any;

  export function sha256(data: any, ...args: any[]): any;

  export function sign(data: any, privateKey: any, ...args: any[]): any;

  export function signHash(
    dataSha256: any,
    privateKey: any,
    ...args: any[]
  ): any;

  export function unsafeRandomKey(): any;

  export function verify(
    signature: any,
    data: any,
    pubkey: any,
    ...args: any[]
  ): any;

  export function verifyHash(
    signature: any,
    dataSha256: any,
    pubkey: any,
    ...args: any[]
  ): any;

  export namespace Aes {
    function decrypt(
      private_key: any,
      public_key: any,
      nonce: any,
      message: any,
      checksum: any
    ): any;

    function encrypt(
      private_key: any,
      public_key: any,
      message: any,
      ...args: any[]
    ): any;

    namespace decrypt {
      const prototype: {};
    }

    namespace encrypt {
      const prototype: {};
    }
  }

  export namespace PrivateKey {
    const prototype: {};

    function fromBuffer(buf: any): any;

    function fromHex(hex: any): any;

    function fromSeed(seed: any): any;

    function fromString(privateStr: any): any;

    function fromWif(str: any): any;

    function initialize(...args: any[]): any;

    function isValid(key: any): any;

    function isWif(text: any): any;

    function randomKey(...args: any[]): any;

    function unsafeRandomKey(): any;

    namespace fromBuffer {
      const prototype: {};
    }

    namespace fromHex {
      const prototype: {};
    }

    namespace fromSeed {
      const prototype: {};
    }

    namespace fromString {
      const prototype: {};
    }

    namespace fromWif {
      const prototype: {};
    }

    namespace initialize {
      const prototype: {};
    }

    namespace isValid {
      const prototype: {};
    }

    namespace isWif {
      const prototype: {};
    }

    namespace randomKey {
      const prototype: {};
    }

    namespace unsafeRandomKey {
      const prototype: {};
    }
  }

  export namespace PublicKey {
    const prototype: {};

    function fromBinary(bin: any): any;

    function fromBuffer(buffer: any): any;

    function fromHex(hex: any): any;

    function fromPoint(point: any): any;

    function fromString(public_key: any): any;

    function fromStringHex(hex: any): any;

    function fromStringOrThrow(public_key: any): any;

    function isValid(text: any): any;

    namespace fromBinary {
      const prototype: {};
    }

    namespace fromBuffer {
      const prototype: {};
    }

    namespace fromHex {
      const prototype: {};
    }

    namespace fromPoint {
      const prototype: {};
    }

    namespace fromString {
      const prototype: {};
    }

    namespace fromStringHex {
      const prototype: {};
    }

    namespace fromStringOrThrow {
      const prototype: {};
    }

    namespace isValid {
      const prototype: {};
    }
  }

  export namespace Signature {
    const prototype: {};

    function from(o: any): any;

    function fromBuffer(buf: any): any;

    function fromHex(hex: any): any;

    function fromString(signature: any): any;

    function fromStringOrThrow(signature: any): any;

    function sign(data: any, privateKey: any, ...args: any[]): any;

    function signHash(dataSha256: any, privateKey: any, ...args: any[]): any;

    namespace from {
      const prototype: {};
    }

    namespace fromBuffer {
      const prototype: {};
    }

    namespace fromHex {
      const prototype: {};
    }

    namespace fromString {
      const prototype: {};
    }

    namespace fromStringOrThrow {
      const prototype: {};
    }

    namespace sign {
      const prototype: {};
    }

    namespace signHash {
      const prototype: {};
    }
  }

  export namespace initialize {
    const prototype: {};
  }

  export namespace isValidPrivate {
    const prototype: {};
  }

  export namespace isValidPublic {
    const prototype: {};
  }

  export namespace key_utils {
    function addEntropy(...args: any[]): void;

    function checkDecode(keyString: any, ...args: any[]): any;

    function checkEncode(keyBuffer: any, ...args: any[]): any;

    function cpuEntropy(...args: any[]): any;

    function entropyCount(): any;

    function random32ByteBuffer(...args: any[]): any;

    namespace addEntropy {
      const prototype: {};
    }

    namespace checkDecode {
      const prototype: {};
    }

    namespace checkEncode {
      const prototype: {};
    }

    namespace cpuEntropy {
      const prototype: {};
    }

    namespace entropyCount {
      const prototype: {};
    }

    namespace random32ByteBuffer {
      const prototype: {};
    }
  }

  export namespace privateToPublic {
    const prototype: {};
  }

  export namespace randomKey {
    const prototype: {};
  }

  export namespace recover {
    const prototype: {};
  }

  export namespace recoverHash {
    const prototype: {};
  }

  export namespace seedPrivate {
    const prototype: {};
  }

  export namespace sha256 {
    const prototype: {};
  }

  export namespace sign {
    const prototype: {};
  }

  export namespace signHash {
    const prototype: {};
  }

  export namespace unsafeRandomKey {
    const prototype: {};
  }

  export namespace verify {
    const prototype: {};
  }

  export namespace verifyHash {
    const prototype: {};
  }
}
