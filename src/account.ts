import {Int64, UInt64} from '@wharfkit/session'
import {AccountObject, AccountResourceLimit} from '@/eosio-core/types'
import {arrayToHex} from '@/eosio-core/utils'
export interface AccountProfileArgs {
    name: string
    liquidBalance: string
    cpuLimit: AccountResourceLimit
    netLimit: AccountResourceLimit
    ramQuota: Int64
    ramUsage: UInt64
    netPercentageAvailable: number
    cpuPercentageAvailable: number
}
export class AccountProfile implements AccountProfileArgs {
    name
    liquidBalance
    netLimit
    cpuLimit
    ramQuota
    ramUsage
    netPercentageAvailable
    cpuPercentageAvailable

    constructor() {
        this.name = ''
        this.liquidBalance = '0.0000'
        this.netLimit = {
            used: Int64.from(0),
            available: Int64.from(0),
            max: Int64.from(0),
        }
        this.cpuLimit = {
            used: Int64.from(0),
            available: Int64.from(0),
            max: Int64.from(0),
        }
        this.ramQuota = Int64.from(0)
        this.ramUsage = Int64.from(0)
    }

    fromAccount(sessionAccount: AccountObject) {
        this.name = sessionAccount.account_name.toString()
        this.liquidBalance = sessionAccount.core_liquid_balance
            ? sessionAccount.core_liquid_balance.toString()
            : '0.0000'
        this.netLimit = sessionAccount.net_limit
        this.cpuLimit = sessionAccount.cpu_limit
        this.ramQuota = Int64.from(0)
        this.ramUsage = UInt64.from(0)
        this.netPercentageAvailable = this.calcNetPercentageAvailable()
        this.cpuPercentageAvailable = this.calcCPUPercentageAvailable()
    }

    calculatePercentage(limits: AccountResourceLimit): number {
        const max = limits.max.toNumber()
        const available = limits.available.toNumber()
        // don't divide by zero
        if (max > 0) {
            return available / max
        }
        return 0
    }
    calcNetPercentageAvailable(): number {
        return this.calculatePercentage(this.netLimit)
    }
    calcCPUPercentageAvailable(): number {
        return this.calculatePercentage(this.cpuLimit)
    }
}
