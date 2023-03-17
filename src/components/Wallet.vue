<template>
    <div class="wallet">
        <h1>{{ headerTitle }}</h1>
        <p>
            <strong>{{ walletName }}</strong> {{ walletMessage }}
        </p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'WharfWallet',
    props: {
        headerTitle: {type: String, default: 'default-header'},
        walletMessage: {type: String, default: 'default-message'},
        walletName: {type: String, default: 'default-wallet-name'},
    },
}
</script>

<style scoped></style>
