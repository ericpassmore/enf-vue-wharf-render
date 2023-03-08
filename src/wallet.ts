import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'

import {Checksum256, PermissionLevel, PrivateKey, Transaction} from '@greymass/eosio'

import {
    AbstractWalletPlugin,
    ChainDefinition,
    LoginContext,
    ResolvedSigningRequest,
    SigningRequest,
    TransactContext,
    WalletPluginConfig,
    WalletPluginData,
    WalletPluginSignResponse,
} from '@wharfkit/session'

import {testChainDefinition, testPrivateKey, testPermissionLevel} from "./config";

import {makeTestAction} from "./transfer";

export function makeWallet() {
    return new WalletPluginPrivateKey(PrivateKey.from(testPrivateKey))
}

export class WalletPluginConfigs extends AbstractWalletPlugin {
    readonly metadata = {
        name: 'ENF Test Wallet Plugin',
        description: 'A wallet plugin for testing chain selection',
    }
    testModify = false
    config: WalletPluginConfig
    constructor(config?: WalletPluginConfig, initialData: WalletPluginData = {}) {
        super()
        if (config) {
            this.config = config
        } else {
            this.config = {
                requiresChainSelect: true,
                requiresPermissionSelect: false,
            }
        }
        this.data = initialData
    }

    get id() {
        return 'TestWalletPluginConfigs'
    }

    async login(context: LoginContext) {
        // Return the chain and permission level for this fake wallet
        return {
            chain: context.chain ? context.chain.id : ChainDefinition.from(testChainDefinition).id,
            permissionLevel: context.permissionLevel || PermissionLevel.from(testPermissionLevel),
        }
    }

    async sign(
        resolved: ResolvedSigningRequest,
        context: TransactContext
    ): Promise<WalletPluginSignResponse> {
        if (context.storage) {
            context.storage.write('testModify', this.data.testModify)
        }
        // If the `testModify` flag is enabled, modify the transaction for testing purposes
        if (this.data.testModify) {
            const request = await SigningRequest.create(
                {action: makeTestAction('modified transaction')},
                context.esrOptions
            )
            const modifiedResolved = await context.resolve(request)
            const transaction = Transaction.from(modifiedResolved.transaction)
            const digest = transaction.signingDigest(Checksum256.from(context.chain.id))
            const privateKey = PrivateKey.from(this.data.privateKey)
            const signature = privateKey.signDigest(digest)
            return {
                request: request,
                signatures: [signature],
            }
        }
        // Otherwise sign what was returned
        const transaction = Transaction.from(resolved.transaction)
        const digest = transaction.signingDigest(Checksum256.from(context.chain.id))
        const privateKey = PrivateKey.from(this.data.privateKey)
        const signature = privateKey.signDigest(digest)
        return {
            signatures: [signature],
        }
    }
}