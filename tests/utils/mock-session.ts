/*
 * from @wharfkit/session/test/utils
 * Copyright (c) 2023 Greymass Inc. All Rights Reserved.
 * Copyright 2023 EOS Network Foundation
 */
import {PermissionLevel} from '@greymass/eosio'
import {Session, SessionArgs, SessionOptions} from '@wharfkit/session'
import {
    bigBrotherMockPermissionLevel,
    littleBrotherMockPermissionLevel,
    mockChainDefinition,
} from './mock-config'
import {mockFetch} from './mock-fetch'
import {makeWallet} from './mock-wallet'

const wallet = makeWallet()

export const mockSessionArgs: SessionArgs = {
    chain: mockChainDefinition,
    permissionLevel: PermissionLevel.from(littleBrotherMockPermissionLevel),
    walletPlugin: wallet,
}

export const bigBrotherMockSessionArgs: SessionArgs = {
    chain: mockChainDefinition,
    permissionLevel: PermissionLevel.from(bigBrotherMockPermissionLevel),
    walletPlugin: wallet,
}

export const mockSessionOptions: SessionOptions = {
    appName: 'ENF Mock Session',
    broadcast: false, // Disable broadcasting by default for tests, enable when required.
    fetch: mockFetch, // Required for unit tests
}

export const mockSession = new Session(mockSessionArgs, mockSessionOptions)
export const bigBrotherMockSession = new Session(bigBrotherMockSessionArgs, mockSessionOptions)
