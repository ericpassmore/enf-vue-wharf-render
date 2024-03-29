import {
    littleBrotherMockAccountName,
    littleBrotherMockPermissionLevel,
    mockChainDefinition,
} from './utils/mock-config'
import {bigBrotherMockSession, mockSession} from './utils/mock-session'
import {Checksum256, Name} from '@wharfkit/session'
import {createSession} from '../src/session'
import {makeWallet} from './utils/mock-wallet'
import {mockFetch} from './utils/mock-fetch'

describe('session', function () {
    test('basic', function () {
        expect(mockSession.appName).toBeTruthy()
        expect(mockSession.appName).toStrictEqual(Name.from('ENF Mock Session'))
    })
    test('create session', function () {
        const session = createSession(
            mockChainDefinition,
            littleBrotherMockPermissionLevel,
            makeWallet(),
            mockFetch
        )
        expect(session.actor).toStrictEqual(Name.from(littleBrotherMockAccountName))
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
            Checksum256.from('041789995a82ad9e2b09ae2de7a045bbbbda0e52ad1e96dd5e893aec6072c1fc')
        )
    })
})
