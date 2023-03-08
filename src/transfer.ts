import {Action, API, Asset, Name, Struct, Transaction} from '@greymass/eosio'

import {testAccountName, testPermissionName} from './config'

@Struct.type('transfer')
class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}

export function makeTestAction(memo?: string): Action {
    // Generate typed data for action data
    const transfer = Transfer.from({
        from: testAccountName,
        to: 'enfsession11',
        quantity: '0.2500 EOS',
        memo: memo || 'evaluating wharfkit March 2023',
    })
    // Assemble action with action data and metadata
    const action = Action.from({
        authorization: [
            {
                actor: testAccountName,
                permission: testPermissionName,
            },
        ],
        account: 'eosio.token',
        name: 'transfer',
        data: transfer,
    })
    return action
}

export function makeTestActions(memo?: string): Action[] {
    return [makeTestAction(memo)]
}

export function makeTestTransaction(info: API.v1.GetInfoResponse, memo?: string): Transaction {
    // Assemble transaction header
    const header = info.getTransactionHeader(90)
    // Generate array of actions
    const actions = makeTestActions(memo)
    // Form and return transaction object
    const transaction = Transaction.from({
        ...header,
        actions,
    })
    return transaction
}
