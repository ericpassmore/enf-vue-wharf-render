<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <Wallet
        header-title="Welcome To Your Wallet"
        :wallet-message="wallet.metadata.description"
        :wallet-name="wallet.metadata.name"
    />
    <SessionError :error-title="errorTitle" :error-details="errorDetails" />
</template>

<script>
import {makeWallet, EnfWalletPlugin} from '@/wallet.ts'
import {testChainDefinition, testPermissionLevel} from '@/config'
import Wallet from '@/components/Wallet.vue'
import SessionError from '@/components/Error.vue'
export default {
    components: {SessionError, Wallet},
    data() {
        return {
            errorDetails: undefined,
            errorTitle: undefined,
            wallet: makeWallet()
        }
    },
    methods: {
        didLogin() {
            console.info('running did login')
        },

        async refreshAccount() {
            this.session.client.v1.chain.get_account(this.session.actor).then((result) => {
                this.account = result
            })
        },
    },
    mounted() {
        this.wallet.login({
            chain: testChainDefinition,
            permissionLevel: testPermissionLevel,
        })
        this.didLogin()
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
