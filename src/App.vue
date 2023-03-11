<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <Wallet
        header-title="Welcome To Your Wallet"
        :wallet-message="wallet.metadata.description"
        :wallet-name="wallet.metadata.name"
    />
    <AccountInfo
        :account-name="accountProfile.name"
        :account-liquid-balence="accountProfile.liquidBalence"
        :cpu-percentage-available="accountProfile.cpuPercentageAvailable"
        :net-percentage-available="accountProfile.netPercentageAvailable"
        :ram-useage="accountProfile.ramUsage"
    />
    <SessionError :error-title="errorTitle" :error-details="errorDetails" />
</template>

<!-- Vue3 does not work this Typescript -->
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
// import out app scripts and config
import {testChainDefinition, testPermissionLevel, testPrivateKey} from '@/config'
import {AccountProfile, createSession} from '@/session.ts'
export default {
    components: {SessionError, Wallet, AccountInfo},
    data() {
        return {
            errorDetails: undefined,
            errorTitle: undefined,
            wallet: new WalletPluginPrivateKey(PrivateKey.from(testPrivateKey)),
            session: typeof Session,
            accountProfile: new AccountProfile(),
        }
    },
    mounted() {
        this.session = createSession(testChainDefinition, testPermissionLevel, this.wallet)
        this.wallet.metadata.description = this.didLogin()
        this.refreshAccount()
    },
    methods: {
        didLogin() {
            console.info('running did login')
            return 'enf test wallet from wallet-plugin-privatekey'
        },
        refreshAccount() {
            this.session.client.v1.chain
                .get_account(this.session.actor)
                .then((result) => {
                    const account = result
                    this.accountProfile.name = account.account_name.toString()
                    this.accountProfile.liquidBalence = account.core_liquid_balance
                        ? account.core_liquid_balance.toString()
                        : '0.0000'
                    this.accountProfile.cpuPercentageAvailable =
                        account.cpu_limit.available / account.cpu_limit.max
                    this.accountProfile.netPercentageAvailable =
                        account.net_limit.available / account.net_limit.max
                    this.accountProfile.ramQuota = account.ram_quota
                    this.accountProfile.ramUsage = account.ram_usage
                })
                .catch((error) => {
                    this.errorDetails = error.toString()
                    this.errorTitle = 'error:session get account'
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
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
