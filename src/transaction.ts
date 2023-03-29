import {Transfer} from '../src/eosio-core/types'
import {
    Action,
    API,
    Bytes,
    Name,
    PrivateKey,
    SignedTransaction,
    Transaction,
} from '@greymass/eosio'
import {Session} from '@wharfkit/session'

/*
 * Complete this function
 * Returns a Transaction
 * does not send transaction to service
 * NOTE: passing in primitive types, this function is designed to be called from Web
 */
export async function assembleTransfer(
    // we need to get blockchain info, session required
    session: Session,
    // name of account, string with 12 chars
    fromAccount: string,
    // name of permission, example "test"
    usingPermission: string,
    // key to sign transaction
    signingKey: string,
    // name of an account, string with 12 chars
    toAccount: string,
    // example 1.0000
    quantity: number,
    // tag the transaction, default provided
    memo?: string
): Promise<SignedTransaction> {
    // stub replace this code
    return new SignedTransaction(undefined)
}

/*
 * @greymass/eosio Reference
 * https://greymass.github.io/eosio-core/
 */
export function buildTransferAction(
    // name of account, string with 12 chars
    fromAccount: string,
    // name of permission, example "test"
    usingPermission: string,
    // name of an account, string with 12 chars
    toAccount: string,
    // example 0.25, we will add symbol name
    quantity: number,
    // tag the transaction, default provided
    memo?: string
): Action {
    // build out quantity 4 decimal places, "EOS" required
    const eosAmount = `${quantity.toFixed(4)} EOS`
    // Generate typed data for action data
    // make an interface for this?
    const transfer = Transfer.from({
        from: Name.from(fromAccount),
        to: Name.from(toAccount),
        quantity: eosAmount,
        memo: memo || 'EOS 4 ever',
    })
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
