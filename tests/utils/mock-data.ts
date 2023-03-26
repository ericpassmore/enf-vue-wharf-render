/*
 * from @wharfkit/session/test/utils
 * Copyright (c) 2023 Greymass Inc. All Rights Reserved.
 * Copyright 2023 EOS Network Foundation
 */
import {Session} from '@wharfkit/session'

import {makeClient} from './mock-client'
import {mockSessionArgs, mockSessionOptions} from './mock-session'
import {makeMockAction, makeMockActions, makeMockTransaction} from './mock-transfer'

const client = makeClient()
export async function mockData(memo?: string) {
    const info = await client.v1.chain.get_info()
    const action = await makeMockAction(memo)
    const actions = await makeMockActions(memo)
    const transaction = await makeMockTransaction(info, memo)
    const session = new Session(mockSessionArgs, mockSessionOptions)
    return {
        action,
        actions,
        info,
        session,
        transaction,
    }
}
