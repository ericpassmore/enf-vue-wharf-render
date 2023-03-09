<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <Wallet header_title="Welcome To Your Wallet" wallet_message="Default!" />
</template>

<script>
import {testAccountName} from "./config.ts";
import Wallet from './components/Wallet.vue';
Wallet.props.wallet_message="NOT ****** NOT";

export default {
    name: 'App',
    components: {
        Wallet,
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
