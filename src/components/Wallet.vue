<template>
    <div class="wallet">
        <h3>Wallet</h3>
        <p>
            <strong>{{ walletName }}</strong> {{ walletMessage }}
        </p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'WharfWallet',
    props: {
        walletMessage: {type: String, default: 'default-message'},
        walletName: {type: String, default: 'default-wallet-name'},
    },
}
</script>

<style scoped></style>
