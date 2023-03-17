<template>
    <div v-if="isError" class="error">
        <h2>{{ errorTitle }}</h2>
        <p>{{ errorDetails }}</p>
    </div>
</template>

<script>
export default {
    name: `SessionError`,
    props: {
        isError: {type: Boolean, default: false},
        errorTitle: {type: String, default: 'default-error-title'},
        errorDetails: {type: String, default: 'default-error-detail'},
    },
}
</script>

<style scoped>
.error {
    background-color: darkred;
    color: white;
}
</style>
