<template>
    <div class="account">
        <h3>Account: {{ accountName }}</h3>
        <ul>
            <li><strong>Balence</strong> {{ accountLiquidBalence }}</li>
            <li><strong>CPU Available</strong> {{ cpuPercentageAvailable.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) }}</li>
            <li><strong>Net Available</strong> {{ netPercentageAvailable.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) }}</li>
            <li><strong>RAM Used</strong> {{ ramUseage }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import {Int64} from '@wharfkit/session'

export default {
    name: 'AccountInfo',
    props: {
        accountName: String,
        accountLiquidBalence: String,
        cpuPercentageAvailable: Number,
        netPercentageAvailable: Number,
        ramQuota: Int64,
        ramUseage: Int64,
    },
}
</script>

<style scoped></style>
