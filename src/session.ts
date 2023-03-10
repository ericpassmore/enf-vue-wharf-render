import {PermissionLevel} from '@greymass/eosio'

import {
    AbstractUserInterface,
    Cancelable,
    cancelable,
    Checksum256,
    LoginContext,
    LoginOptions,
    PromptArgs,
    PromptResponse,
    Session,
    SessionArgs,
    SessionKit,
    SessionKitOptions,
    SessionOptions,
    UserInterface,
    UserInterfaceLoginResponse,
} from '@wharfkit/session'

import {testChainDefinition, testPermissionLevel} from '@/config'
import {makeWallet} from '@/wallet'
import {EnfStorage} from '@/storage'

const wallet = makeWallet()

export class EnfUserInterface extends AbstractUserInterface implements UserInterface {
    readonly logging = false
    public messages: string[] = []

    log(message: string) {
        this.messages.push(message)
        if (this.logging) {
            // eslint-disable-next-line no-console
            console.info('MockUserInterface', message)
        }
    }

    async login(context: LoginContext): Promise<UserInterfaceLoginResponse> {
        let chainId: Checksum256
        if (context.chain) {
            chainId = context.chain.id
        } else {
            chainId = new Checksum256(new Uint8Array())
        }
        if (!chainId) {
            this.log('no chain id')
        } else {
            this.log('chain id is ${chainId}')
        }
        const permissionLevel = context.permissionLevel
        if (!permissionLevel) {
            this.log('no permission')
        }
        return {
            chainId,
            permissionLevel,
            walletPluginIndex: 0,
        }
    }

    async onError(error: Error) {
        this.log('onError: ' + JSON.stringify(error))
    }

    async onLogin(options?: LoginOptions) {
        this.log('onLogin: ' + JSON.stringify(options))
    }

    async onLoginComplete() {
        this.log('onLoginComplete')
    }

    async onTransact() {
        this.log('onTransact')
    }

    async onTransactComplete() {
        this.log('onTransactComplete')
    }

    async onSign() {
        this.log('onSign')
    }

    async onSignComplete() {
        this.log('onSignComplete')
    }

    async onBroadcast() {
        this.log('onBroadcast')
    }

    async onBroadcastComplete() {
        this.log('onBroadcastComplete')
    }

    prompt(args: PromptArgs): Cancelable<PromptResponse> {
        this.log('prompt' + JSON.stringify(args))
        return cancelable(new Promise(() => {}), (canceled) => {
            // do things to cancel promise
            throw canceled
        })
    }

    status(message: string) {
        this.log(`status:('${message}')`)
    }

    addTranslations(): void {
        this.log('addTranslations')
    }
}

export const enfSessionKitOptions: SessionKitOptions = {
    appName: 'enftest',
    chains: [testChainDefinition],
    storage: new EnfStorage(),
    ui: new EnfUserInterface(),
    walletPlugins: [wallet],
}

export const enfSessionKit = new SessionKit(enfSessionKitOptions)

export const enfSessionArgs: SessionArgs = {
    chain: testChainDefinition,
    permissionLevel: PermissionLevel.from(testPermissionLevel),
    walletPlugin: wallet,
}

export const enfSessionOptions: SessionOptions = {
    broadcast: false, // Disable broadcasting by default for tests, enable when required.
}

export const enfSession = new Session(enfSessionArgs, enfSessionOptions)
