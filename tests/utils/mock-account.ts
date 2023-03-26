import {AccountObject, AccountResourceLimit, AccountTotalResources} from '@/eosio-core/types'
import {Authority, AuthorityType} from '@greymass/eosio'
import {Asset, Int64, Name, NameType, TimePoint, UInt32, UInt64} from '@wharfkit/session'
import Symbol = Asset.Symbol
export const resources: AccountResourceLimit = {
    used: Int64.from(20),
    available: Int64.from(80),
    max: Int64.from(100),
}
export const mockAuthorityType: AuthorityType = {
    threshold: UInt32.from(0),
}
export class AccountPermission {
    perm_name: Name = Name.from('mock permission')
    parent: Name = Name.from('mock account')
    required_auth: Authority = Authority.from(mockAuthorityType)
}

export const mockAccountTotalResources: AccountTotalResources = {
    owner: Name.from('mock account'),
    net_weight: new Asset(UInt64.from(0), new Symbol(UInt64.from(2))),
    cpu_weight: new Asset(UInt64.from(0), new Symbol(UInt64.from(4))),
    ram_bytes: UInt64.from(0),
}

export const accountObject: AccountObject = {
    account_name: Name.from('test'),
    core_liquid_balance: new Asset(UInt64.from(12456), new Symbol(UInt64.from(8))),
    ram_quota: UInt64.from(1024),
    ram_usage: UInt64.from(16),
    net_limit: resources,
    cpu_limit: resources,
    head_block_num: UInt32.from(123456),
    head_block_time: TimePoint.fromInteger(123456),
    privileged: false,
    created: TimePoint.fromInteger(123456),
    last_code_update: TimePoint.fromInteger(123456),
    net_weight: Int64.from(1),
    cpu_weight: Int64.from(1),
    permissions: [new AccountPermission()],
    getPermission(permission: NameType): AccountPermission {
        return this.permissions[0]
    },
    total_resources: mockAccountTotalResources,
}
