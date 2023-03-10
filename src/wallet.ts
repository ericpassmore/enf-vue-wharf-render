import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'

import {Checksum256, PermissionLevel, PrivateKey, Transaction} from '@greymass/eosio'

import {
    AbstractWalletPlugin,
    Cancelable,
    cancelable,
    LoginContext,
    PrivateKeyType,
    ResolvedSigningRequest,
    TransactContext,
    WalletPlugin,
    WalletPluginConfig,
    WalletPluginLoginResponse,
    WalletPluginMetadata,
    WalletPluginSignResponse,
} from '@wharfkit/session'

import {testPrivateKey} from './config'

export function makeWallet() {
    return new EnfWalletPlugin(testPrivateKey)
}

export class EnfWalletPlugin extends AbstractWalletPlugin implements WalletPlugin {
    public id = 'enf-wallet-plugin-privatekey'
    readonly config: WalletPluginConfig = {
        requiresChainSelect: true,
        requiresPermissionSelect: true,
    }
    readonly metadata: WalletPluginMetadata = {
        name: 'ENF Test Wallet Plugin',
        description: 'A wallet with test permissions',
    }
    constructor(privateKeyData: PrivateKeyType) {
        super()
        const privateKey = PrivateKey.from(privateKeyData)
        this.data.privateKey = privateKey
        this.metadata.publicKey = privateKey.toPublic()
    }

    login(context: LoginContext): Cancelable<WalletPluginLoginResponse> {
        let chain: Checksum256
        if (context.chain) {
            chain = context.chain.id
        }
        return cancelable(
            new Promise((resolve, reject) => {
                if (!context.permissionLevel) {
                    return reject(
                        'Calling login() without a permissionLevel is not supported by the WalletPluginPrivateKey plugin.'
                    )
                }
                resolve({
                    chain,
                    permissionLevel: context.permissionLevel,
                })
            })
        )
    }

    sign(
        resolved: ResolvedSigningRequest,
        context: TransactContext
    ): Cancelable<WalletPluginSignResponse> {
        return cancelable(
            new Promise((resolve) => {
                const transaction = Transaction.from(resolved.transaction)
                const digest = transaction.signingDigest(Checksum256.from(context.chain.id))
                const privateKey = PrivateKey.from(this.data.privateKey)
                const signature = privateKey.signDigest(digest)
                resolve({
                    signatures: [signature],
                })
            })
        )
    }
}
