import type { Config } from 'jest';

const config: Config = {
    testPathIgnorePatterns: [
        '/e2e/',
        '/home.spec.ts/',
    ],
};

export default config;