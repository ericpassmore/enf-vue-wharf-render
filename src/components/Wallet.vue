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
        headerTitle: String,
        walletMessage: String,
        walletName: String,
    },
}
</script>

<style scoped></style>
