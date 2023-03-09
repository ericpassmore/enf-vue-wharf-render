<template>
  <div class="wallet">
    <h1>{{ header_title }}</h1>
    <p>a wallet message should be listed above</p>
    <p>enf session message {{ wallet_message }} </p>
  </div>
</template>

<script>
export default {
  name: "Wallet",
  props: {
    header_title: "Empty",
    wallet_message: "Empty Wallet!",
  },
};
</script>

<style scoped>

</style>