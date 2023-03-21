import {AccountProfile} from "../src/session.ts"

describe('account', function () {
    test('default AccountProfile', function () {
        const defaultAccountProfile = new AccountProfile()
        expect(defaultAccountProfile.name).toBe('')
    })
})
