<template>
    <div class="error">
        <h2>{{ errorTitle }}</h2>
        <p>{{ errorDetails }}</p>
    </div>
</template>

<script>
export default {
    name: `SessionError`,
    props: {
        errorTitle: String,
        errorDetails: String,
    },
}
</script>

<style scoped>
.error {
    background-color: darkred;
    color: white;
}
</style>
