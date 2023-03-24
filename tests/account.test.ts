import { AccountResourceLimit } from "@/eosio-core/types";
import {AccountProfile} from '../src/account'
import {Int64} from '@wharfkit/session'

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
})
