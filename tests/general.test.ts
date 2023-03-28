import * as cnf from '../src/config'
import * as util from '../src/eosio-core/utils'
test('config', function () {
    expect(cnf.testPrivateKey).toBeTruthy()
    expect(cnf.testChainDefinition.id).toBeTruthy()
    expect(cnf.testChainDefinition.url).toBeTruthy()
    expect(cnf.testAccountName).toBeTruthy()
    expect(cnf.testPermissionName).toBeTruthy()
})
test('conversions', function () {
    expect(util.arrayToHex(util.hexToArray('abc123'))).toStrictEqual('abc123')
})
test('bad hex', function() {
    expect(() => {
        util.hexToArray('abc')
    }).toThrow('Odd number of hex digits')
    expect(() => {
        util.hexToArray('XYZ1')
    }).toThrow('Expected hex string')
})
