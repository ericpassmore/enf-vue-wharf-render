<template>
    <img id="logo" alt="Vue logo" src="./assets/logo.png" width="75" height="75" />
    <h1>Welcome To Your Wallet</h1>
    <Wallet :wallet-message="wallet.metadata.description" :wallet-name="wallet.metadata.name" />
    <AccountInfo
        :account-name="accountProfile.name"
        :account-liquid-balance="accountProfile.liquidBalance"
        :cpu-percentage-available="accountProfile.cpuPercentageAvailable()"
        :net-percentage-available="accountProfile.netPercentageAvailable()"
        :ram-usage="accountProfile.ramUsage.toNumber()"
    />
    <TransferFunds
        :is-active="enableTransfer"
        :private-key="getTestPrivateKey()"
        :account-name="accountProfile.name"
    />
    <SessionError :is-error="isError" :error-title="errorName" :error-details="errorDetails" />
</template>

<!-- Vue3 does not work with Typescript -->
<!-- workaround use CompositionAPI for Typescript Support -->
<!-- https://github.com/vuejs/vue/issues/9873 -->
<script>
// import from wharf session kit
import {Session} from '@wharfkit/session'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {PrivateKey} from '@greymass/eosio'
// import other vue views
import Wallet from '@/components/Wallet.vue'
import SessionError from '@/components/Error.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import TransferFunds from '@/components/Transfer.vue'
// import out app scripts and config
import {enableTransfer, testChainDefinition, testPermissionLevel, testPrivateKey} from '@/config'
import {createSession} from '@/session.ts'
import {AccountProfile} from '@/account.ts'

export default {
    components: {TransferFunds, SessionError, Wallet, AccountInfo},
    data() {
        return {
            errorDetails: undefined,
            errorName: undefined,
            isError: undefined,
            enableTransfer: enableTransfer,
            wallet: new WalletPluginPrivateKey(PrivateKey.from(testPrivateKey)),
            session: typeof Session,
            accountProfile: new AccountProfile(),
        }
    },
    mounted() {
        this.session = createSession(testChainDefinition, testPermissionLevel, this.wallet)
        this.wallet.metadata.description = 'enf test wallet'
        this.wallet.metadata.name = 'Private Key Wallet'
        this.didLogin()
        this.refreshAccount()
    },
    methods: {
        getTestPrivateKey() {
            return testPrivateKey
        },
        didLogin() {
            console.info('running did login')
        },
        refreshAccount() {
            this.session.client.v1.chain
                .get_account(this.session.actor)
                .then((result) => {
                    const account = result
                    this.accountProfile.fromAccount(account)
                })
                .catch((error) => {
                    this.isError = true
                    this.errorDetails = error.toString()
                    this.errorName = 'error:session get account'
                })
        },
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin-top: 60px;
    margin-left: 5em;
}
#logo {
    margin-left: 10em;
}
.wallet {
    border: 1px solid grey;
    padding-left: 1em;
}
.account {
    padding: 1em;
    border: 1px solid grey;
    margin-top: 1em;
}
.account ul {
    list-style-type: none;
    padding-left: 0;
}
.transfer {
    border: 1px solid grey;
    margin-top: 1em;
    padding: 1em;
}
#sourceAccount {
    background-color: #cccccc;
}
</style>
