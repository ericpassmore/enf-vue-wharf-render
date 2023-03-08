<template>
    <div class="error">
        <h2>{$t('error.title', {default: 'Error'})}</h2>
        <p>{$errorDetails}</p>
    </div>
    div>
</template>

<script>
export default {
    name: ['Session Error'],
}
</script>

<style scoped>
.error {
    background-color: darkred;
    color: white;
}
</style>
