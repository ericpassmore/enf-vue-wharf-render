/*
 * from @wharfkit/session/test/utils
 * Copyright (c) 2023 Greymass Inc. All Rights Reserved.
 * Copyright 2023 EOS Network Foundation
 */
import {PrivateKey} from '@greymass/eosio'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {mockPrivateKey} from './mock-config'

export function makeWallet() {
    return new WalletPluginPrivateKey(PrivateKey.from(mockPrivateKey))
}