import {AccountProfile} from '../src/account'
import {AccountObject, AccountResourceLimit, AccountTotalResources} from '../src/eosio-core/types'
import {Authority, AuthorityType} from '@greymass/eosio'
import {Asset, Int64, Name, NameType, TimePoint, UInt32, UInt64} from '@wharfkit/session'
import Symbol = Asset.Symbol

function setupAccountObject(): AccountObject {
    const resources: AccountResourceLimit = {
        used: Int64.from(20),
        available: Int64.from(80),
        max: Int64.from(100),
    }
    const mockAuthorityType: AuthorityType = {
        threshold: UInt32.from(0),
    }
    class AccountPermission {
        perm_name: Name = Name.from('mock permission')
        parent: Name = Name.from('mock account')
        required_auth: Authority = Authority.from(mockAuthorityType)
    }

    const mockAccountTotalResources: AccountTotalResources = {
        owner: Name.from('mock account'),
        net_weight: new Asset(UInt64.from(0), new Symbol(UInt64.from(2))),
        cpu_weight: new Asset(UInt64.from(0), new Symbol(UInt64.from(4))),
        ram_bytes: UInt64.from(0),
    }

    const accountObject: AccountObject = {
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
    return accountObject
}
describe('account', function () {
    test('default AccountProfile', function () {
        const defaultAccountProfile = new AccountProfile()
        expect(defaultAccountProfile.name).toBe('')
        expect(defaultAccountProfile.liquidBalance).toBe('0.0000')
        expect(defaultAccountProfile.netPercentageAvailable()).toBe(0)
        expect(defaultAccountProfile.cpuPercentageAvailable()).toBe(0)
        expect(defaultAccountProfile.ramQuota).toStrictEqual(Int64.from(0))
        expect(defaultAccountProfile.ramUsage).toStrictEqual(Int64.from(0))
    })

    test('calculate percentages', function () {
        const account = new AccountProfile()
        const resources: AccountResourceLimit = {
            used: Int64.from(20),
            available: Int64.from(80),
            max: Int64.from(100),
        }
        expect(account.calculatePercentage(resources)).toStrictEqual(0.8)
    })

    test('from AccountObject', function () {
        const accountObject = setupAccountObject()
        const account = new AccountProfile()
        account.fromAccount(accountObject)
        expect(account.name).toBe('test')
        expect(account.ramQuota).toStrictEqual(UInt64.from(1024))
        expect(account.cpuPercentageAvailable()).toBe(0.8)
        expect(account.netPercentageAvailable()).toBe(0.8)
    })
})
