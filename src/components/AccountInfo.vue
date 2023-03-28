<template>
    <div class="account">
        <h3>Account</h3>
        <h4>account name: {{ accountName }}</h4>
        <ul>
            <li><strong>Balance</strong> {{ accountLiquidBalance }}</li>
            <li>
                <strong>CPU Available</strong>
                {{
                    cpuPercentageAvailable.toLocaleString(undefined, {
                        style: 'percent',
                        minimumFractionDigits: 2,
                    })
                }}
            </li>
            <li>
                <strong>Net Available</strong>
                {{
                    netPercentageAvailable.toLocaleString(undefined, {
                        style: 'percent',
                        minimumFractionDigits: 2,
                    })
                }}
            </li>
            <li><strong>RAM Used</strong> {{ ramUsage }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import {Int64} from '@wharfkit/session'

export default {
    name: 'AccountInfo',
    props: {
        accountName: {type: String, default: 'default-account-name'},
        accountLiquidBalance: {type: String, default: 'default-balance'},
        cpuPercentageAvailable: {type: Number, default: 0.0},
        netPercentageAvailable: {type: Number, default: 0.0},
        ramQuota: {type: Int64, default: 0},
        ramUsage: {type: Int64, default: 0},
    },
}
</script>

<style scoped></style>
