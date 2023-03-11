import {
    ChainDefinition,
    Int64,
    PermissionLevel,
    Session,
    SessionArgs,
    SessionOptions,
    WalletPlugin,
} from '@wharfkit/session'

export interface AccountProfileArgs {
    name: string
    liquidBalence: string
    netPercentageAvailable: number
    cpuPercentageAvailable: number
    ramQuota: Int64
    ramUsage: Int64
}
export class AccountProfile implements AccountProfileArgs {
    name = ''
    liquidBalence = '0.0000'
    netPercentageAvailable = 0.0
    cpuPercentageAvailable = 0.0
    ramQuota: Int64 = Int64.from(0)
    ramUsage: Int64 = Int64.from(0)
}

export function createSession(
    chainParams: {id: string; url: string},
    permissionLevel: string,
    wallet: WalletPlugin
): Session {
    const enfSessionArgs: SessionArgs = {
        chain: ChainDefinition.from(chainParams),
        permissionLevel: PermissionLevel.from(permissionLevel),
        walletPlugin: wallet,
    }
    const enfSessionOptions: SessionOptions = {
        broadcast: false,
    }
    return new Session(enfSessionArgs, enfSessionOptions)
}
