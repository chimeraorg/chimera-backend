module.exports = {
    testRegex: '.*\\.spec\\.ts$',
    rootDir: './',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },

    transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)'
    ],

    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/config/$1',
        '^@infra/(.*)$': '<rootDir>/infrastructure/$1',
        '^@package/(.*)$': '<rootDir>/package/$1'
    },

    collectCoverageFrom: [
        'package/**/*.ts',
        'infrastructure/**/*.ts',
        '!**/*.module.ts',
        '!**/*.controller.ts',
        '!**/*.dto.ts',
        '!infrastructure/database/migrations/*.ts',
        '!infrastructure/http/main.ts',
        '!ormconfig.ts'
    ],
    coverageDirectory: 'coverage'
}