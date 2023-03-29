import {arrayToHex} from '../src/eosio-core/utils'
import {Action, Bytes, PrivateKey, Transaction} from '@greymass/eosio'
import {littleBrotherMockAccountName, mockPermissionName, mockPrivateKey} from './utils/mock-config'
import {mockSession} from './utils/mock-session'
import {buildTransaction, signTransaction} from '../src/transaction'

let mockTransaction: Transaction

describe('transaction', function () {
    beforeAll(async function () {
        // get info, tapos may change, don't cache
        const info = await mockSession.client.v1.chain.get_info()
        // build action with data
        const action = Action.from({
            authorization: [
                {
                    actor: littleBrotherMockAccountName,
                    permission: mockPermissionName,
                },
            ],
            account: littleBrotherMockAccountName,
            name: 'mock',
            data: arrayToHex([0, 2, 3, 4]),
        })
        // create transaction
        mockTransaction = await buildTransaction(info, action)
    })

    test('building a transaction', async function () {
        expect(mockTransaction.actions[0].account.toString()).toStrictEqual(
            littleBrotherMockAccountName
        )
        expect(mockTransaction.delay_sec.toNumber()).toBe(0)
    })

    test('signing a transaction', async function () {
        // get info, tapos may change, don't cache
        const info = await mockSession.client.v1.chain.get_info()
        const signedTransaction = await signTransaction(
            mockTransaction,
            info,
            PrivateKey.from(mockPrivateKey)
        )
        expect(signedTransaction.signingDigest(info.chain_id).toString()).toBe(
            'f8b3cd041851f18db660a3e3c40ed14ad8e926bb76dd63630ab1d839a5e9bf91'
        )
    })

    test('ignores undef data', async function () {
        const action = mockTransaction.actions[0]
        // get info, tapos may change, don't cache
        const info = await mockSession.client.v1.chain.get_info()
        const mockTransactionWithUndefData = await buildTransaction(info, action, undefined)
        // test actor
        expect(mockTransactionWithUndefData.actions[0].account.toString()).toStrictEqual(
            littleBrotherMockAccountName
        )
        // test header
        expect(mockTransaction.delay_sec.toNumber()).toBe(0)
    })

    test('data override', async function () {
        // copy data to buffer before it gets over writtern
        const beforeData = new Bytes(mockTransaction.actions[0].data.array)
        const action = mockTransaction.actions[0]
        // get info, tapos may change, don't cache
        const info = await mockSession.client.v1.chain.get_info()
        const mockTransactionWithNewData = await buildTransaction(info, action, new Bytes())

        expect(mockTransactionWithNewData.actions[0].data).toStrictEqual(new Bytes())
        expect(beforeData).not.toStrictEqual(new Bytes())
    })
})
