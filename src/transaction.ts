import {Action, API, Bytes, PrivateKey, SignedTransaction, Transaction} from '@greymass/eosio'

/*
 * @greymass/eosio Reference
 * https://greymass.github.io/eosio-core/
 */
export function buildTransferAction(
    // name of account, string with 12 chars
    fromAccount: string,
    // name of permission, example "test"
    usingPermission: string,
    // name of a account, string with 12 chars
    toAccount: string,
    // example "1.0000 EOS", requires symbol name
    quantity: string,
    // tag the transaction, default provided
    memo?
): Action {
    // Generate typed data for action data
    // make an interface for this?
    const transfer = {
        from: fromAccount,
        to: toAccount,
        quantity: quantity,
        memo: memo || 'EOS 4 ever',
    }
    // Assemble action with action data and metadata
    // for transfer account is always 'eosio.token'
    // for transfer name is always 'transfer'
    const action = Action.from({
        authorization: [
            {
                actor: fromAccount,
                permission: usingPermission,
            },
        ],
        account: 'eosio.token',
        name: 'transfer',
        data: transfer,
    })
    return action
}

export async function buildTransaction(
    info: API.v1.GetInfoResponse,
    // what we are doing, who is doing it, and meta-data
    action: Action,
    // meta-data, may already be set in action param
    data?: Bytes
): Promise<Transaction> {
    // assemble header
    const header = info.getTransactionHeader(90)
    // Set action data and metadata to passed in action
    // will override, values if data provided
    action.data = data ? data : action.data
    // Form and return transaction object
    const transaction = Transaction.from({
        ...header,
        actions: [action],
    })
    return transaction
}

export async function signTransaction(
    transaction: Transaction,
    info: API.v1.GetInfoResponse,
    signingKey: PrivateKey
): Promise<SignedTransaction> {
    // Use private key and create signature for transaction
    const signature = signingKey.signDigest(transaction.signingDigest(info.chain_id))
    // Form and return signedTransaction object
    const signedTransaction = SignedTransaction.from({
        ...transaction,
        signatures: [signature],
    })
    return signedTransaction
}
