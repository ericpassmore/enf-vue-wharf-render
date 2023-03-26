import { bigBrotherMockSession, mockSession } from "./utils/mock-session";
import {Checksum256, Name} from '@wharfkit/session'
describe('session', function () {
    test('basic', function () {
        expect(mockSession.appName).toBeTruthy()
        expect(mockSession.appName).toStrictEqual(Name.from('ENF Mock Session'))
    })
    test('get little brother account', async function () {
        const actor = await mockSession.client.v1.chain.get_account(mockSession.actor)
        expect(actor.account_name).toStrictEqual(Name.from('enfsession22'))
        expect(actor.ram_usage.toNumber()).toStrictEqual(3784)
    })
    test('get big brother account', async function () {
        const actor = await bigBrotherMockSession.client.v1.chain.get_account(
            bigBrotherMockSession.actor
        )
        expect(actor.account_name).toStrictEqual(Name.from('enfsession11'))
        expect(actor.ram_usage.toNumber()).toStrictEqual(4070)
    })
    test('get chain info', async function () {
        const infoResponse = await mockSession.client.v1.chain.get_info()
        expect(infoResponse.head_block_id).toStrictEqual(
            Checksum256.from('040f8dbad4263fb76698ce76b680dc56f755ba3b12641be9d500f2107111f2e4')
        )
    })
})
