import type {JestConfigWithTsJest} from 'ts-jest'

/* reference https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/ */
const config: JestConfigWithTsJest = {
    extensionsToTreatAsEsm: ['.ts'],
    verbose: true,
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', {useESM: true}],
    },
    testPathIgnorePatterns: ['./dist'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
}
export default config
