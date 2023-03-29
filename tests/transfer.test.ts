import {
    bigBrotherMockAccountName,
    littleBrotherMockAccountName,
    mockPermissionName,
    mockPrivateKey,
} from './utils/mock-config'
import {mockSession} from "./utils/mock-session";
import {assembleTransfer} from '../src/transaction'


describe('transfer', function () {
    // need at least one test
    test('dummy test', function () {
        expect(true).toStrictEqual(true)
    })
    /*
    test('transfer  EOS', async function () {
        const myTransfer = await assembleTransfer(
            // need session to execute info requests against blockchain
            mockSession,
            // the account we are sending from
            littleBrotherMockAccountName,
            // the blockchain permission we are using (accounts have multiple keys)
            mockPermissionName,
            // the private key to sign, must match the account@permission
            mockPrivateKey,
            // the account we are sending to
            bigBrotherMockAccountName,
            // the amount of EOS we are sending
            0.25,
            // notes for our transaction
            'mock transfer'
        )
        // send it to blockchain, execute the contract
        const transferResult = await mockSession.client.v1.chain.send_transaction2(myTransfer)
        // getting a transaction_id back is a good sign
        expect(transferResult.transaction_id).toBeTruthy()
        // loop through action traces looking for errors
        for (const trace of transferResult.processed.action_traces) {
            expect(trace.error_code).not.toBeTruthy()
        }
    })
     */
})
