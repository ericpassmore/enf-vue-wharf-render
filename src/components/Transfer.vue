<template>
    <div class="transfer">
        <h3>Transfer</h3>
        <form>
            <p>
                From account:<span id="sourceAccount">{{ sourceAccount }}</span> send
                <input id="amount" type="text" value="0" /> EOS to destination account:
                <select id="destAccount">
                    <option value="act1">Act1</option>
                    <option value="act2">Act2</option>
                </select>
            </p>
            <input type="submit" value="Submit" />
        </form>
    </div>
</template>

<script>
export default {
    name: 'TransferFunds',
    props: {
        sourceAccount: {type: String, default: 'NA'},
        destAccount: {type: String, default: 'NA'},
        amount: {type: Number, default: 0},
    },
}
</script>

<style scoped></style>
