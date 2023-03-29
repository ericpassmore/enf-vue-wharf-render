import fetch from 'node-fetch'
import {
    ChainDefinition,
    PermissionLevel,
    Session,
    SessionArgs,
    SessionOptions,
    WalletPlugin,
} from '@wharfkit/session'

/*
 * creates a new Wharf Session Object
 * broadcasts are always off
 */
export function createSession(
    chainParams: {id: string; url: string},
    permissionLevel: string,
    wallet: WalletPlugin,
    fetch?: fetch
): Session {
    const enfSessionArgs: SessionArgs = {
        chain: ChainDefinition.from(chainParams),
        permissionLevel: PermissionLevel.from(permissionLevel),
        walletPlugin: wallet,
    }
    const enfSessionOptions: SessionOptions = {
        broadcast: false,
        fetch: fetch,
    }
    return new Session(enfSessionArgs, enfSessionOptions)
}
