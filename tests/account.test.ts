import {AccountProfile} from '../src/account'
import {AccountResourceLimit} from '../src/eosio-core/types'
import {Asset, Int64, UInt64} from '@wharfkit/session'
import {accountObject} from './utils/mock-account'

// build a zero balance directly from Asset and Symbol type
// first argument is amount of tokens, second argument is token type
// 4 == Core Symbol Type , EOS == Symbol Name
const zeroBalance = new Asset(UInt64.from(0), Asset.Symbol.from('4,EOS'))
describe('account', function () {
    test('default AccountProfile', function () {
        const defaultAccountProfile = new AccountProfile()
        expect(defaultAccountProfile.name).toBe('')
        expect(defaultAccountProfile.liquidBalance).toBe(zeroBalance.toString())
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
        const account = new AccountProfile()
        account.fromAccount(accountObject)
        expect(account.name).toBe('test')
        expect(account.ramQuota).toStrictEqual(UInt64.from(1024))
        expect(account.cpuPercentageAvailable()).toBe(0.8)
        expect(account.netPercentageAvailable()).toBe(0.8)
    })

    test('zero balance', function () {
        const account = new AccountProfile()
        accountObject.core_liquid_balance = undefined
        account.fromAccount(accountObject)
        expect(account.liquidBalance).toBe(zeroBalance.toString())
    })
})
