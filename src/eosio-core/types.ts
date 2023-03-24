import {Asset, Authority, Int64, Name, NameType, TimePoint, UInt32, UInt64} from '@greymass/eosio'
export interface AccountPermission {
    perm_name: Name
    parent: Name
    required_auth: Authority
}

export interface AccountResourceLimit {
    used: Int64
    available: Int64
    max: Int64
}

export interface AccountTotalResources {
    owner: Name
    net_weight: Asset
    cpu_weight: Asset
    ram_bytes: UInt64
}

interface AccountSelfDelegatedBandwidth {
    from: Name
    to: Name
    net_weight: Asset
    cpu_weight: Asset
}

interface AccountRefundRequest {
    owner: Name
    request_time: TimePoint
    net_amount: Asset
    cpu_amount: Asset
}

export interface AccountVoterInfo {
    owner: Name
    proxy: Name
    producers: Name[]
    staked?: Int64
    is_proxy: boolean
    flags1?: UInt32
    reserved2: UInt32
    reserved3: string
}

export interface AccountRexInfoMaturities {
    /** Expected results from after EOSIO.Contracts v1.9.0 */
    key?: TimePoint
    value?: Int64
    /** Expected results from before EOSIO.Contracts v1.9.0 */
    first?: TimePoint
    second?: Int64
}

export interface AccountRexInfo {
    version: UInt32
    owner: Name
    vote_stake: Asset
    rex_balance: Asset
    matured_rex: Int64
    rex_maturities: AccountRexInfoMaturities[]
}

export interface AccountObject {
    /** The account name of the retrieved account */
    account_name: Name
    /** Highest block number on the chain */
    head_block_num: UInt32
    /** Highest block unix timestamp. */
    head_block_time: TimePoint
    /** Indicator of if this is a privileged system account */
    privileged: boolean
    /** Last update to accounts contract as unix timestamp. */
    last_code_update: TimePoint
    /** Account created as unix timestamp. */
    created: TimePoint
    /** Account core token balance */
    core_liquid_balance?: Asset
    ram_quota: Int64
    net_weight: Int64
    cpu_weight: Int64
    net_limit: AccountResourceLimit
    cpu_limit: AccountResourceLimit
    ram_usage: UInt64
    permissions: AccountPermission[]
    total_resources: AccountTotalResources
    self_delegated_bandwidth?: AccountSelfDelegatedBandwidth
    refund_request?: AccountRefundRequest
    voter_info?: AccountVoterInfo
    rex_info?: AccountRexInfo

    getPermission(permission: NameType): AccountPermission
}
