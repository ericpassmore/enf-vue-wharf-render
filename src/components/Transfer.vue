<template>
    <div v-if="isActive" class="transfer">
        <h3>Transfer</h3>
        <form @submit.prevent="createTransfer">
            <p>
                From account: <span id="sourceAccount">{{ accountName }}</span> send
                <input id="amount" type="text" value="0" /> EOS to destination account:
                <select id="destAccount">
                    <option value="enfsession11">enfsession11</option>
                    <option value="alicetestlio">alicetestlio</option>
                </select>
            </p>
            <input type="submit" value="Submit" />
        </form>
    </div>
</template>

<script>
import {testChainDefinition, testPermissionLevel, testPermissionName} from '@/config'
import {createSession} from '@/session'
import {assembleTransfer} from '@/transaction'
import {PrivateKey} from '@greymass/eosio'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'

let session
export default {
    name: 'TransferFunds',
    props: {
        isActive: {type: Boolean, default: false},
        privateKey: {type: String, default: ''},
        accountName: {type: String, default: 'NA'},
        destAccount: {type: String, default: 'NA'},
        amount: {type: Number, default: 0},
    },
    mounted() {
        session = createSession(
            testChainDefinition,
            testPermissionLevel,
            new WalletPluginPrivateKey(PrivateKey.from(this.privateKey))
        )
    },
    methods: {
        logTransfer(submitEvent) {
            console.log(
                `${this.accountName} ${testPermissionName} ${this.privateKey} ${submitEvent.target.elements.destAccount.value} ${submitEvent.target.elements.amount.value}`
            )
        },
        createTransfer(submitEvent) {
            let destAccount = submitEvent.target.elements.destAccount.value
            let amount = submitEvent.target.elements.amount.value
            assembleTransfer(
                // we need to get blockchain info, session required
                session,
                // name of account, string with 12 chars
                this.accountName,
                // name of permission, example "test"
                testPermissionName,
                // key to sign transaction
                this.privateKey,
                // name of a account, string with 12 chars
                destAccount,
                // example "1.0000 EOS", requires symbol name
                Number(amount),
                // tag the transaction, default provided
                'live transfer of EOS'
            )
                .then((result) => {
                    console.log('sending transfer transaction')
                    session.client.v1.chain
                        .send_transaction2(result)
                        .then(() => {
                            console.log('transfer a success')
                            location.reload()
                            //isSuccess = true
                        })
                        .catch((error) => {
                            console.log(`send2 transfer failed ${error.name}`)
                            //parent.Error.name = error.name
                        })
                })
                .catch((error) => {
                    console.log(`assemble transfer failed ${error.name}`)
                    //parent.Error.name = error.name
                })
        },
    },
}
</script>

<style scoped></style>
